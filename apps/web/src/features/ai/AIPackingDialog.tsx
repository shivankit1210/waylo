import { useState } from 'react';
import {
  Sparkles,
  Luggage,
  Check,
  CheckCircle2,
  RefreshCw,
  Plus,
  ShieldAlert,
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
import { Badge } from '@/components/ui/badge';
import { useGeneratePacking, useApplyPacking } from './hooks';
import type { TripWithDetails, AIGeneratedPackingItem, PackingCategory } from '@waylo/shared';
import { toast } from 'sonner';

interface AIPackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripWithDetails | any;
}

export function AIPackingDialog({ open, onOpenChange, trip }: AIPackingDialogProps) {
  const generateMutation = useGeneratePacking();
  const applyMutation = useApplyPacking(trip?.id);

  const [climate, setClimate] = useState('Moderate / Coastal');
  const [includeRidingGear, setIncludeRidingGear] = useState(
    trip?.tripType === 'MOTORCYCLE' || trip?.transportModes?.includes('MOTORCYCLE')
  );
  const [suggestedItems, setSuggestedItems] = useState<AIGeneratedPackingItem[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const handleGenerate = async () => {
    try {
      const days = trip?.startDate && trip?.endDate
        ? Math.max(1, Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86400000) + 1)
        : 3;

      const res = await generateMutation.mutateAsync({
        destination: trip?.destination || 'Destination',
        tripType: trip?.tripType || 'ROAD_TRIP',
        daysCount: days,
        climate,
        includeRidingGear,
        tripId: trip?.id,
      });

      setSuggestedItems(res.items);
      setSelectedNames(res.items.map((i) => i.name)); // Select all by default
      toast.success(`Generated ${res.items.length} gear & clothing recommendations!`);
    } catch {
      // Handled
    }
  };

  const toggleSelect = (name: string) => {
    if (selectedNames.includes(name)) {
      setSelectedNames(selectedNames.filter((n) => n !== name));
    } else {
      setSelectedNames([...selectedNames, name]);
    }
  };

  const handleApply = async () => {
    const itemsToApply = suggestedItems.filter((i) => selectedNames.includes(i.name));
    if (itemsToApply.length === 0) {
      toast.error('Please select at least one item to add');
      return;
    }

    try {
      await applyMutation.mutateAsync({
        tripId: trip.id,
        items: itemsToApply,
      });
      onOpenChange(false);
    } catch {
      // Handled
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 rounded-3xl">
        <DialogHeader className="shrink-0 space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>AI Packing Assistant</span>
          </div>
          <DialogTitle className="text-xl font-bold">
            Smart Gear Suggestions for {trip?.destination || 'Your Trip'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Our travel AI analyzes your climate, duration, and riding transport to propose an optimal packing list.
          </DialogDescription>
        </DialogHeader>

        {/* Options Bar */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 shrink-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-muted-foreground">Climate:</span>
              <select
                value={climate}
                onChange={(e) => setClimate(e.target.value)}
                className="bg-card border border-border/80 rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none"
              >
                <option value="Moderate / Pleasant">Moderate / Pleasant</option>
                <option value="Cold / Sub-zero Mountain Passes">Cold / High Mountain Passes</option>
                <option value="Hot / Sunny Desert">Hot / Desert</option>
                <option value="Monsoon / Rainy">Monsoon / Rainy</option>
                <option value="Tropical Beach">Tropical Beach</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-xs">
              <input
                type="checkbox"
                checked={includeRidingGear}
                onChange={(e) => setIncludeRidingGear(e.target.checked)}
                className="rounded accent-primary h-4 w-4"
              />
              <span>Include Motorcycle Armor & Spares</span>
            </label>

            <Button
              size="sm"
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="rounded-xl font-bold gap-1.5 text-xs bg-primary text-white hover:bg-primary/90"
            >
              {generateMutation.isPending ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>{suggestedItems.length > 0 ? 'Re-generate' : 'Generate Checklist'}</span>
            </Button>
          </div>
        </div>

        {/* Items Container */}
        <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
          {suggestedItems.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-muted-foreground">
              <Luggage className="h-10 w-10 mx-auto text-muted-foreground/50" />
              <p className="text-sm font-semibold">No suggestions generated yet</p>
              <p className="text-xs">Tap "Generate Checklist" above to synthesize items.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1 pb-1">
                <span>
                  {selectedNames.length} of {suggestedItems.length} items selected
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedNames(
                      selectedNames.length === suggestedItems.length
                        ? []
                        : suggestedItems.map((i) => i.name)
                    )
                  }
                  className="font-semibold text-primary hover:underline"
                >
                  {selectedNames.length === suggestedItems.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {suggestedItems.map((item, idx) => {
                const isSelected = selectedNames.includes(item.name);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleSelect(item.name)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-primary/50 bg-primary/5 text-foreground'
                        : 'border-border/60 bg-card/60 opacity-60 text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-5 w-5 rounded-lg border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-primary border-primary text-white'
                            : 'border-muted-foreground/40'
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-snug">{item.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground font-medium">
                            Qty: {item.quantity}
                          </span>
                          {item.notes && (
                            <span className="text-[10px] text-muted-foreground italic">
                              • {item.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                      {item.category.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                );
              })}
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
            disabled={suggestedItems.length === 0 || applyMutation.isPending}
            className="rounded-xl font-bold text-xs gap-1.5 bg-primary text-white hover:bg-primary/90"
          >
            {applyMutation.isPending ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            <span>Add {selectedNames.length} Items to Checklist</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
