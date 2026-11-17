import { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Plus,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGenerateItinerary, useApplyItinerary } from './hooks';
import type { TripWithDetails, AIGeneratedItinerary } from '@waylo/shared';
import { toast } from 'sonner';

interface AIGenerateDaysDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripWithDetails | any;
}

export function AIGenerateDaysDialog({
  open,
  onOpenChange,
  trip,
}: AIGenerateDaysDialogProps) {
  const generateMutation = useGenerateItinerary();
  const applyMutation = useApplyItinerary(trip?.id);

  const [daysCount, setDaysCount] = useState<number>(
    trip?.startDate && trip?.endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
              86400000
          ) + 1
        )
      : 3
  );

  const [travelPace, setTravelPace] = useState<'RELAXED' | 'MODERATE' | 'PACKED'>('MODERATE');
  const [preferences, setPreferences] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<AIGeneratedItinerary | null>(null);

  const handleGenerate = async () => {
    try {
      const plan = await generateMutation.mutateAsync({
        destination: trip?.destination || 'Destination',
        origin: trip?.startLocation || undefined,
        daysCount,
        tripType: trip?.tripType || 'MOTORCYCLE',
        travelPace,
        budget: 'MODERATE',
        preferences: preferences.trim() || undefined,
      });

      setGeneratedPlan(plan);
      toast.success('Generated AI itinerary preview!');
    } catch {
      // Handled
    }
  };

  const handleApply = async () => {
    if (!generatedPlan) return;

    try {
      await applyMutation.mutateAsync({
        tripId: trip.id,
        itinerary: generatedPlan,
      });
      onOpenChange(false);
    } catch {
      // Handled
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-6 rounded-3xl">
        <DialogHeader className="shrink-0 space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>AI Itinerary Generator</span>
          </div>
          <DialogTitle className="text-xl font-bold">
            Plan {daysCount}-Day Itinerary for {trip?.destination || trip?.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Crafts daily waypoints, scenic stops, meal breaks, and sunset vistas customized to your pace.
          </DialogDescription>
        </DialogHeader>

        {/* Configuration Bar */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 shrink-0 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground block mb-1">
                Number of Days:
              </label>
              <Input
                type="number"
                min={1}
                max={14}
                value={daysCount}
                onChange={(e) => setDaysCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="rounded-xl h-8 text-xs font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">
                Travel Pace:
              </label>
              <select
                value={travelPace}
                onChange={(e) => setTravelPace(e.target.value as any)}
                className="w-full bg-card border border-border/80 rounded-xl px-2.5 h-8 text-xs font-semibold focus:outline-none"
              >
                <option value="RELAXED">Relaxed (Late starts & chill)</option>
                <option value="MODERATE">Moderate (Balanced)</option>
                <option value="PACKED">Packed (Early starts & max stops)</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                size="sm"
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="w-full rounded-xl font-bold text-xs gap-1.5 h-8 bg-primary text-white hover:bg-primary/90"
              >
                {generateMutation.isPending ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span>{generatedPlan ? 'Re-generate' : 'Generate Itinerary'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
          {!generatedPlan ? (
            <div className="text-center py-12 space-y-2 text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto text-muted-foreground/50" />
              <p className="text-sm font-semibold">No itinerary generated yet</p>
              <p className="text-xs">Adjust your pace above and tap "Generate Itinerary".</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                <h4 className="font-bold text-sm text-foreground">{generatedPlan.tripTitle}</h4>
                <p className="text-xs text-muted-foreground">{generatedPlan.summary}</p>
              </div>

              {generatedPlan.days.map((day) => (
                <div key={day.dayNumber} className="space-y-2 p-3 rounded-2xl border border-border/70 bg-card">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">{day.title}</span>
                    <span className="text-[11px] text-muted-foreground">{day.stops.length} stops</span>
                  </div>

                  <div className="space-y-1.5 pl-2 border-l-2 border-primary/30 ml-2">
                    {day.stops.map((stop, sIdx) => (
                      <div key={sIdx} className="text-xs flex items-center justify-between gap-2 py-0.5">
                        <span className="font-medium text-foreground">{stop.title}</span>
                        <Badge variant="outline" className="text-[10px] uppercase font-semibold shrink-0">
                          {stop.plannedStartTime || stop.itemType}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="shrink-0 pt-4 border-t border-border/60 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleApply}
            disabled={!generatedPlan || applyMutation.isPending}
            className="rounded-xl font-bold text-xs gap-1.5 bg-primary text-white hover:bg-primary/90"
          >
            {applyMutation.isPending ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            <span>Apply Plan to Trip</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
