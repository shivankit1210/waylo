import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createItineraryDaySchema,
  type CreateItineraryDayInput,
} from '@waylo/shared';
import { useCreateDay } from '../hooks';
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
import { CalendarPlus, MapPin, Navigation, Clock } from 'lucide-react';

interface CreateDayDialogProps {
  tripId: string;
  nextDayNumber: number;
  tripStartDate?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (dayNumber: number) => void;
}

export function CreateDayDialog({
  tripId,
  nextDayNumber,
  tripStartDate,
  open,
  onOpenChange,
  onSuccess,
}: CreateDayDialogProps) {
  const createDayMutation = useCreateDay(tripId);

  // Default date calculated from start date if available
  const calculateDefaultDate = () => {
    if (!tripStartDate) return '';
    const d = new Date(tripStartDate);
    d.setDate(d.getDate() + (nextDayNumber - 1));
    return d.toISOString().split('T')[0];
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateItineraryDayInput>({
    resolver: zodResolver(createItineraryDaySchema),
    defaultValues: {
      dayNumber: nextDayNumber,
      title: `Day ${nextDayNumber} Expedition`,
      plannedDeparture: '08:00',
      plannedArrival: '18:00',
      plannedDistanceKm: 120,
    },
  });

  const onSubmit = async (data: CreateItineraryDayInput) => {
    try {
      await createDayMutation.mutateAsync({
        ...data,
        dayNumber: Number(data.dayNumber),
        date: data.date ? new Date(data.date).toISOString() : undefined,
        plannedDistanceKm: data.plannedDistanceKm ? Number(data.plannedDistanceKm) : undefined,
      });

      toast.success(`Day ${data.dayNumber} added to itinerary!`);
      reset();
      onOpenChange(false);
      onSuccess?.(Number(data.dayNumber));
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to create day');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg rounded-3xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <CalendarPlus className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Add Itinerary Day</DialogTitle>
              <DialogDescription className="text-xs">
                Plan a new day of exploration, routing, and waypoints
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
                placeholder="e.g. Coastal Route to Vagator"
                {...register('title')}
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs">
              Calendar Date (Optional)
            </Label>
            <Input
              id="date"
              type="date"
              defaultValue={calculateDefaultDate()}
              {...register('date')}
              className="h-10"
            />
          </div>

          {/* Locations */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startLocation" className="text-xs flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                Start Origin
              </Label>
              <Input
                id="startLocation"
                placeholder="e.g. Panjim / Hotel Base"
                {...register('startLocation')}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="endLocation" className="text-xs flex items-center gap-1">
                <Navigation className="h-3.5 w-3.5 text-emerald-500" />
                Target Destination
              </Label>
              <Input
                id="endLocation"
                placeholder="e.g. Palolem Beach"
                {...register('endLocation')}
                className="h-10"
              />
            </div>
          </div>

          {/* Timings & Distance */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="plannedDeparture" className="text-xs flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                Departure
              </Label>
              <Input
                id="plannedDeparture"
                type="time"
                {...register('plannedDeparture')}
                className="h-10 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="plannedArrival" className="text-xs flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-purple-500" />
                Arrival
              </Label>
              <Input
                id="plannedArrival"
                type="time"
                {...register('plannedArrival')}
                className="h-10 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="plannedDistanceKm" className="text-xs">
                Distance (km)
              </Label>
              <Input
                id="plannedDistanceKm"
                type="number"
                step="0.1"
                placeholder="120"
                {...register('plannedDistanceKm', { valueAsNumber: true })}
                className="h-10 text-xs"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs">
              Day Briefing & Road Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="e.g. Early fuel top-up recommended before mountain ghats. Carry rain shell."
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
              disabled={createDayMutation.isPending}
              className="rounded-xl font-semibold"
            >
              {createDayMutation.isPending ? 'Adding Day...' : 'Add Day to Plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
