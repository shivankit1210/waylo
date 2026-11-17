import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createItineraryItemSchema,
  type CreateItineraryItemInput,
  ItineraryItemType,
  ActivityFlexibility,
} from '@waylo/shared';
import { useCreateItem } from '../hooks';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  PlusCircle,
  MapPin,
  Clock,
  Compass,
  UtensilsCrossed,
  Fuel,
  Coffee,
  Camera,
  Hotel,
  Navigation,
} from 'lucide-react';

interface CreateItemDialogProps {
  tripId: string;
  dayId: string;
  dayNumber: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextOrderIndex: number;
}

const ITEM_TYPES: { type: ItineraryItemType; label: string; icon: any }[] = [
  { type: ItineraryItemType.SIGHTSEEING, label: 'Sightseeing', icon: Camera },
  { type: ItineraryItemType.MEAL, label: 'Food / Meal', icon: UtensilsCrossed },
  { type: ItineraryItemType.FUEL_STOP, label: 'Fuel / Charging', icon: Fuel },
  { type: ItineraryItemType.REST, label: 'Rest / Break', icon: Coffee },
  { type: ItineraryItemType.ACTIVITY, label: 'Activity / Tour', icon: Compass },
  { type: ItineraryItemType.CHECK_IN, label: 'Hotel Check-in', icon: Hotel },
  { type: ItineraryItemType.TRAVEL, label: 'Scenic Route / Ride', icon: Navigation },
];

export function CreateItemDialog({
  tripId,
  dayId,
  dayNumber,
  open,
  onOpenChange,
  nextOrderIndex,
}: CreateItemDialogProps) {
  const createItemMutation = useCreateItem(tripId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateItineraryItemInput>({
    resolver: zodResolver(createItineraryItemSchema),
    defaultValues: {
      title: '',
      itemType: ItineraryItemType.SIGHTSEEING,
      orderIndex: nextOrderIndex,
      flexibility: ActivityFlexibility.FLEXIBLE,
      isCompleted: false,
      isOptional: false,
      currency: 'INR',
    },
  });

  const selectedType = watch('itemType');
  const isOptional = watch('isOptional');
  const flexibility = watch('flexibility');

  const onSubmit = async (data: CreateItineraryItemInput) => {
    try {
      await createItemMutation.mutateAsync({
        dayId,
        data: {
          ...data,
          orderIndex: nextOrderIndex,
          cost: data.cost ? Number(data.cost) : undefined,
        },
      });

      toast.success('Stop / activity added successfully!');
      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to add activity');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Add Stop or Activity</DialogTitle>
              <DialogDescription className="text-xs">
                Add to Day {dayNumber} schedule and timeline
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Category Selector Pills */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Activity Type</Label>
            <div className="flex flex-wrap gap-1.5">
              {ITEM_TYPES.map(({ type, label, icon: Icon }) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setValue('itemType', type)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedType === type
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs">
              Activity / Stop Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g. Aguada Fort Sunset Viewpoint"
              {...register('title')}
              className="h-10 text-sm font-medium"
            />
            {errors.title && (
              <p className="text-[11px] text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-xs flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
              Location / Waypoint Name
            </Label>
            <Input
              id="location"
              placeholder="e.g. Candolim, North Goa"
              {...register('location')}
              className="h-10 text-xs"
            />
          </div>

          {/* Timings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startTime" className="text-xs flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                {...register('startTime')}
                className="h-10 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="endTime" className="text-xs flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-purple-500" />
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                {...register('endTime')}
                className="h-10 text-xs"
              />
            </div>
          </div>

          {/* Flexibility & Optional Toggles */}
          <div className="p-3.5 rounded-2xl border border-border/80 bg-muted/20 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Fixed Schedule</p>
                <p className="text-[11px] text-muted-foreground">
                  Check if timing is rigid (e.g. ticketed slot or hotel check-in)
                </p>
              </div>
              <Switch
                checked={flexibility === ActivityFlexibility.FIXED}
                onCheckedChange={(checked) =>
                  setValue(
                    'flexibility',
                    checked ? ActivityFlexibility.FIXED : ActivityFlexibility.FLEXIBLE
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div>
                <p className="text-xs font-semibold text-foreground">Optional Stop</p>
                <p className="text-[11px] text-muted-foreground">
                  Can be dropped/skipped if the group runs late
                </p>
              </div>
              <Switch
                checked={isOptional}
                onCheckedChange={(checked) => setValue('isOptional', checked)}
              />
            </div>
          </div>

          {/* Cost */}
          <div className="space-y-1.5">
            <Label htmlFor="cost" className="text-xs">
              Estimated Cost (₹)
            </Label>
            <Input
              id="cost"
              type="number"
              placeholder="0"
              min="0"
              {...register('cost', { valueAsNumber: true })}
              className="h-10 text-xs"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs">
              Details & Instructions
            </Label>
            <Textarea
              id="notes"
              placeholder="e.g. Entry ticket ₹50 per person. Wear comfortable shoes."
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
              disabled={createItemMutation.isPending}
              className="rounded-xl font-semibold"
            >
              {createItemMutation.isPending ? 'Saving...' : 'Add Stop to Timeline'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
