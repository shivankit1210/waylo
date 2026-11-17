import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updatePackingItemSchema,
  type UpdatePackingItemInput,
  type PackingItem,
  PackingCategory,
  PackingStatus,
  type LuggageBag,
} from '@waylo/shared';
import { useUpdatePackingItem } from '../hooks';
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
import { Edit3, Luggage, Calendar, User, Tag, CheckCircle2 } from 'lucide-react';

interface EditItemDialogProps {
  tripId: string;
  item: PackingItem | null;
  bags: LuggageBag[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES: { cat: PackingCategory; label: string }[] = [
  { cat: PackingCategory.TOPS, label: 'Tops & Shirts' },
  { cat: PackingCategory.BOTTOMS, label: 'Bottoms & Pants' },
  { cat: PackingCategory.INNERWEAR, label: 'Innerwear & Socks' },
  { cat: PackingCategory.SLEEPWEAR, label: 'Sleepwear' },
  { cat: PackingCategory.FOOTWEAR, label: 'Footwear' },
  { cat: PackingCategory.WEATHER_LAYERS, label: 'Weather & Thermals' },
  { cat: PackingCategory.MOTORCYCLE_GEAR, label: 'Motorcycle Gear' },
  { cat: PackingCategory.TOILETRIES, label: 'Toiletries & Grooming' },
  { cat: PackingCategory.MEDICINES, label: 'Medicines & First Aid' },
  { cat: PackingCategory.ELECTRONICS, label: 'Electronics & Cables' },
  { cat: PackingCategory.DOCUMENTS, label: 'Travel Documents' },
  { cat: PackingCategory.FOOD_WATER, label: 'Food, Snacks & Water' },
  { cat: PackingCategory.CAMPING, label: 'Camping Gear' },
  { cat: PackingCategory.MISCELLANEOUS, label: 'Miscellaneous' },
];

const STATUSES: { status: PackingStatus; label: string }[] = [
  { status: PackingStatus.NOT_PACKED, label: 'Not Packed' },
  { status: PackingStatus.PACKED, label: 'Packed' },
  { status: PackingStatus.WORN, label: 'Worn Today' },
  { status: PackingStatus.DIRTY, label: 'Dirty / Laundry' },
  { status: PackingStatus.WASHED, label: 'Washed' },
  { status: PackingStatus.MISSING, label: 'Missing / Need to Buy' },
  { status: PackingStatus.UNPACKED, label: 'Unpacked' },
];

export function EditItemDialog({
  tripId,
  item,
  bags,
  open,
  onOpenChange,
}: EditItemDialogProps) {
  const updateItemMutation = useUpdatePackingItem(tripId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdatePackingItemInput>({
    resolver: zodResolver(updatePackingItemSchema),
  });

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        weightGrams: item.weightGrams ?? undefined,
        status: item.status,
        isRequired: item.isRequired,
        isShared: item.isShared,
        assignedTo: item.assignedTo || '',
        bagId: item.bagId || '',
        dayNumber: item.dayNumber ?? undefined,
        notes: item.notes || '',
      });
    }
  }, [item, reset]);

  if (!item) return null;

  const selectedCategory = watch('category');
  const selectedStatus = watch('status');
  const isRequired = watch('isRequired');
  const isShared = watch('isShared');

  const onSubmit = async (data: UpdatePackingItemInput) => {
    try {
      await updateItemMutation.mutateAsync({
        itemId: item.id,
        data: {
          ...data,
          quantity: data.quantity ? Number(data.quantity) : 1,
          weightGrams: data.weightGrams ? Number(data.weightGrams) : null,
          dayNumber: data.dayNumber ? Number(data.dayNumber) : null,
          bagId: data.bagId || null,
        },
      });

      toast.success('Item updated!');
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to update item');
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
              <DialogTitle className="text-xl font-bold">Edit Item</DialogTitle>
              <DialogDescription className="text-xs">
                Update item details, bag allocation, laundry, or missing status
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Status Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Current Status
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map(({ status, label }) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setValue('status', status)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                    selectedStatus === status
                      ? status === 'MISSING'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : status === 'PACKED'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-primary text-white shadow-sm'
                      : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs">
              Item Name *
            </Label>
            <Input id="name" {...register('name')} className="h-10 text-sm font-medium" />
            {errors.name && (
              <p className="text-[11px] text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-primary" /> Category
            </Label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {CATEGORIES.map(({ cat, label }) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setValue('category', cat)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="quantity" className="text-xs">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                {...register('quantity', { valueAsNumber: true })}
                className="h-10 text-xs font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="weightGrams" className="text-xs">
                Weight (grams)
              </Label>
              <Input
                id="weightGrams"
                type="number"
                placeholder="450"
                {...register('weightGrams', { valueAsNumber: true })}
                className="h-10 text-xs"
              />
            </div>
          </div>

          {/* Bag & Assignee */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bagId" className="text-xs flex items-center gap-1">
                <Luggage className="h-3.5 w-3.5 text-blue-500" />
                Luggage Bag
              </Label>
              <select
                id="bagId"
                {...register('bagId')}
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Unassigned</option>
                {bags.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.bagType.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="assignedTo" className="text-xs flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-emerald-500" />
                Packer / Assignee
              </Label>
              <Input id="assignedTo" {...register('assignedTo')} className="h-10 text-xs" />
            </div>
          </div>

          {/* Day Number */}
          <div className="space-y-1.5">
            <Label htmlFor="dayNumber" className="text-xs flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-purple-500" />
              Day / Outfit Target
            </Label>
            <Input
              id="dayNumber"
              type="number"
              min="1"
              {...register('dayNumber', { valueAsNumber: true })}
              className="h-10 text-xs"
            />
          </div>

          {/* Toggles */}
          <div className="p-3.5 rounded-2xl border border-border/80 bg-muted/20 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Required Item</p>
                <p className="text-[11px] text-muted-foreground">Cannot be left behind</p>
              </div>
              <Switch
                checked={isRequired}
                onCheckedChange={(checked) => setValue('isRequired', checked)}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div>
                <p className="text-xs font-semibold text-foreground">Shared Group Item</p>
                <p className="text-[11px] text-muted-foreground">Shared gear for the crew</p>
              </div>
              <Switch
                checked={isShared}
                onCheckedChange={(checked) => setValue('isShared', checked)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs">
              Notes
            </Label>
            <Textarea id="notes" rows={2} {...register('notes')} className="resize-none text-xs" />
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
              disabled={updateItemMutation.isPending}
              className="rounded-xl font-semibold"
            >
              {updateItemMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
