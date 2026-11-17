import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  batchGenerateDaysSchema,
  type BatchGenerateDaysInput,
  type TripWithDetails,
} from '@waylo/shared';
import { useBatchGenerateDays } from '../hooks';
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
import { toast } from 'sonner';
import { Sparkles, Calendar, MapPin, Navigation } from 'lucide-react';

interface BatchGenerateDialogProps {
  trip: TripWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BatchGenerateDialog({
  trip,
  open,
  onOpenChange,
  onSuccess,
}: BatchGenerateDialogProps) {
  const batchGenerateMutation = useBatchGenerateDays(trip.id);

  // Default day count calculation
  const calculateDefaultDays = () => {
    if (trip.startDate && trip.endDate) {
      const diff = Math.abs(new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime());
      return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1, 1);
    }
    return 4;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BatchGenerateDaysInput>({
    resolver: zodResolver(batchGenerateDaysSchema),
    defaultValues: {
      dayCount: calculateDefaultDays(),
      startLocation: trip.startLocation || '',
      destination: trip.destination || '',
      startDate: trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : '',
      endDate: trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : '',
    },
  });

  const onSubmit = async (data: BatchGenerateDaysInput) => {
    try {
      await batchGenerateMutation.mutateAsync({
        ...data,
        dayCount: data.dayCount ? Number(data.dayCount) : undefined,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      });

      toast.success('Itinerary days and initial activities generated!');
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to generate days');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg rounded-3xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Auto-Generate Itinerary</DialogTitle>
              <DialogDescription className="text-xs">
                Create structured daily schedules based on your trip duration & route
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="dayCount" className="text-xs">
              Number of Days
            </Label>
            <Input
              id="dayCount"
              type="number"
              min="1"
              max="60"
              {...register('dayCount', { valueAsNumber: true })}
              className="h-10 font-bold"
            />
            {errors.dayCount && (
              <p className="text-[11px] text-destructive">{errors.dayCount.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="text-xs flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                Start Date
              </Label>
              <Input id="startDate" type="date" {...register('startDate')} className="h-10 text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="endDate" className="text-xs flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-purple-500" />
                End Date
              </Label>
              <Input id="endDate" type="date" {...register('endDate')} className="h-10 text-xs" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startLocation" className="text-xs flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                Origin / Start City
              </Label>
              <Input
                id="startLocation"
                placeholder="e.g. Manali"
                {...register('startLocation')}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="destination" className="text-xs flex items-center gap-1">
                <Navigation className="h-3.5 w-3.5 text-emerald-500" />
                Primary Destination
              </Label>
              <Input
                id="destination"
                placeholder="e.g. Leh"
                {...register('destination')}
                className="h-10"
              />
            </div>
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
              disabled={batchGenerateMutation.isPending}
              className="rounded-xl font-semibold gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              {batchGenerateMutation.isPending ? 'Generating...' : 'Generate Daily Itinerary'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
