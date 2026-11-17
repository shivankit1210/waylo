import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updateItineraryDaySchema,
  type UpdateItineraryDayInput,
  type ItineraryDay,
} from '@waylo/shared';
import { useUpdateDay } from '../hooks';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Edit3, MapPin, Navigation, Clock, CheckCircle2 } from 'lucide-react';

interface EditDayDialogProps {
  tripId: string;
  day: ItineraryDay | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDayDialog({
  tripId,
  day,
  open,
  onOpenChange,
}: EditDayDialogProps) {
  const updateDayMutation = useUpdateDay(tripId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateItineraryDayInput>({
    resolver: zodResolver(updateItineraryDaySchema),
  });

  useEffect(() => {
    if (day) {
      reset({
        dayNumber: day.dayNumber,
        title: day.title || '',
        startLocation: day.startLocation || '',
        endLocation: day.endLocation || '',
        plannedDeparture: day.plannedDeparture || '08:00',
        plannedArrival: day.plannedArrival || '18:00',
        actualDeparture: day.actualDeparture || '',
        actualArrival: day.actualArrival || '',
        plannedDistanceKm: day.plannedDistanceKm ?? undefined,
        actualDistanceKm: day.actualDistanceKm ?? undefined,
        notes: day.notes || '',
        date: day.date ? new Date(day.date).toISOString().split('T')[0] : undefined,
      });
    }
  }, [day, reset]);

  if (!day) return null;

  const onSubmit = async (data: UpdateItineraryDayInput) => {
    try {
      await updateDayMutation.mutateAsync({
        dayId: day.id,
        data: {
          ...data,
          dayNumber: data.dayNumber ? Number(data.dayNumber) : undefined,
          date: data.date ? new Date(data.date).toISOString() : null,
          plannedDistanceKm: data.plannedDistanceKm ? Number(data.plannedDistanceKm) : null,
          actualDistanceKm: data.actualDistanceKm ? Number(data.actualDistanceKm) : null,
        },
      });

      toast.success(`Day ${day.dayNumber} updated!`);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to update day');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Edit Day {day.dayNumber}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update planned & actual schedules, waypoints, and distance
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dayNumber" className="text-xs">
                Day #
              </Label>
              <Input
                id="dayNumber"
                type="number"
                min="1"
                {...register('dayNumber', { valueAsNumber: true })}
                className="h-10 font-bold"
              />
              {errors.dayNumber && (
                <p className="text-[11px] text-destructive">{errors.dayNumber.message}</p>
              )}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="title" className="text-xs">
                Day Title
              </Label>
              <Input
                id="title"
                placeholder="Day title"
                {...register('title')}
                className="h-10 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs">
              Calendar Date
            </Label>
            <Input id="date" type="date" {...register('date')} className="h-10" />
          </div>

          {/* Waypoints */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startLocation" className="text-xs flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                Origin / Morning Base
              </Label>
              <Input
                id="startLocation"
                placeholder="Panjim"
                {...register('startLocation')}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="endLocation" className="text-xs flex items-center gap-1">
                <Navigation className="h-3.5 w-3.5 text-emerald-500" />
                Target / Overnight Stay
              </Label>
              <Input
                id="endLocation"
                placeholder="Palolem"
                {...register('endLocation')}
                className="h-10"
              />
            </div>
          </div>

          {/* Planned Schedule */}
          <div className="p-3.5 rounded-2xl border border-border/80 bg-muted/20 space-y-2.5">
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Planned Schedule & Distance
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <Label htmlFor="plannedDeparture" className="text-[11px] text-muted-foreground">
                  Departure
                </Label>
                <Input
                  id="plannedDeparture"
                  type="time"
                  {...register('plannedDeparture')}
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="plannedArrival" className="text-[11px] text-muted-foreground">
                  Arrival
                </Label>
                <Input
                  id="plannedArrival"
                  type="time"
                  {...register('plannedArrival')}
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="plannedDistanceKm" className="text-[11px] text-muted-foreground">
                  Planned (km)
                </Label>
                <Input
                  id="plannedDistanceKm"
                  type="number"
                  step="0.1"
                  {...register('plannedDistanceKm', { valueAsNumber: true })}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Actual Logged Progress */}
          <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2.5">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Actual Recorded Progress (En-Route)
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <Label htmlFor="actualDeparture" className="text-[11px] text-muted-foreground">
                  Actual Dept.
                </Label>
                <Input
                  id="actualDeparture"
                  type="time"
                  {...register('actualDeparture')}
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="actualArrival" className="text-[11px] text-muted-foreground">
                  Actual Arriv.
                </Label>
                <Input
                  id="actualArrival"
                  type="time"
                  {...register('actualArrival')}
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="actualDistanceKm" className="text-[11px] text-muted-foreground">
                  Actual (km)
                </Label>
                <Input
                  id="actualDistanceKm"
                  type="number"
                  step="0.1"
                  {...register('actualDistanceKm', { valueAsNumber: true })}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs">
              Briefing & Road Condition Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Road warnings, scenic diversions, regroup notes"
              rows={2}
              {...register('notes')}
              className="resize-none text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              disabled={updateDayMutation.isPending}
              className="rounded-xl font-semibold"
            >
              {updateDayMutation.isPending ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
