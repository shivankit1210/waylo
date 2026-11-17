import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createLuggageBagSchema,
  type CreateLuggageBagInput,
  type LuggageBag,
  LuggageBagType,
} from '@waylo/shared';
import { useCreateLuggageBag, useDeleteLuggageBag } from '../hooks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Luggage, Plus, Trash2, ShieldAlert } from 'lucide-react';

interface ManageBagsDialogProps {
  tripId: string;
  bags: LuggageBag[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BAG_TYPES: { type: LuggageBagType; label: string }[] = [
  { type: LuggageBagType.TANK_BAG, label: 'Tank Bag' },
  { type: LuggageBagType.SADDLEBAGS, label: 'Saddlebags' },
  { type: LuggageBagType.TOP_BOX, label: 'Top Box' },
  { type: LuggageBagType.BACKPACK, label: 'Backpack / Rucksack' },
  { type: LuggageBagType.DUFFEL, label: 'Duffel Bag' },
  { type: LuggageBagType.SUITCASE, label: 'Suitcase / Trolley' },
  { type: LuggageBagType.DAYPACK, label: 'Daypack' },
  { type: LuggageBagType.OTHER, label: 'Other Bag' },
];

export function ManageBagsDialog({
  tripId,
  bags,
  open,
  onOpenChange,
}: ManageBagsDialogProps) {
  const [isAdding, setIsAdding] = useState(false);
  const createBagMutation = useCreateLuggageBag(tripId);
  const deleteBagMutation = useDeleteLuggageBag(tripId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLuggageBagInput>({
    resolver: zodResolver(createLuggageBagSchema),
    defaultValues: {
      bagType: LuggageBagType.BACKPACK,
      name: '',
    },
  });

  const onSubmit = async (data: CreateLuggageBagInput) => {
    try {
      await createBagMutation.mutateAsync({
        ...data,
        capacityLiters: data.capacityLiters ? Number(data.capacityLiters) : undefined,
        maxWeightKg: data.maxWeightKg ? Number(data.maxWeightKg) : undefined,
      });

      toast.success('Luggage bag added!');
      reset();
      setIsAdding(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Failed to add bag');
    }
  };

  const handleDelete = async (bagId: string) => {
    try {
      await deleteBagMutation.mutateAsync(bagId);
      toast.success('Bag removed');
    } catch {
      toast.error('Failed to remove bag');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg rounded-3xl p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Luggage className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Luggage Bags</DialogTitle>
              <DialogDescription className="text-xs">
                Organize items across tank bags, saddlebags, backpacks, and duffels
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* List of Existing Bags */}
          <div className="space-y-2">
            {bags.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4 bg-muted/30 rounded-2xl">
                No luggage bags created yet. Add your tank bag, saddlebags, or backpacks below.
              </p>
            ) : (
              bags.map((bag) => (
                <Card
                  key={bag.id}
                  className="p-3.5 rounded-2xl border-border/80 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground">{bag.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold">
                        {bag.bagType.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      {bag.capacityLiters && <span>{bag.capacityLiters} Liters</span>}
                      {bag.maxWeightKg && <span>Max: {bag.maxWeightKg} kg</span>}
                      {bag.color && <span>Color: {bag.color}</span>}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(bag.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))
            )}
          </div>

          {/* Add Bag Section */}
          {!isAdding ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAdding(true)}
              className="w-full gap-2 rounded-2xl text-xs font-semibold h-10"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Luggage Bag</span>
            </Button>
          ) : (
            <Card className="p-4 rounded-2xl border border-primary/30 bg-primary/5 space-y-3">
              <h4 className="text-xs font-bold text-foreground">Add Luggage Bag</h4>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-[11px]">
                    Bag Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. Left Saddlebag / 60L Rucksack"
                    {...register('name')}
                    className="h-9 text-xs"
                  />
                  {errors.name && (
                    <p className="text-[10px] text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="bagType" className="text-[11px]">
                      Bag Type
                    </Label>
                    <select
                      id="bagType"
                      {...register('bagType')}
                      className="w-full h-9 px-2.5 rounded-xl border border-input bg-background text-xs focus:outline-none"
                    >
                      {BAG_TYPES.map((b) => (
                        <option key={b.type} value={b.type}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="capacityLiters" className="text-[11px]">
                      Capacity (Liters)
                    </Label>
                    <Input
                      id="capacityLiters"
                      type="number"
                      placeholder="e.g. 30"
                      {...register('capacityLiters', { valueAsNumber: true })}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAdding(false)}
                    className="rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    size="sm"
                    disabled={createBagMutation.isPending}
                    className="rounded-xl text-xs font-semibold"
                  >
                    {createBagMutation.isPending ? 'Saving...' : 'Save Bag'}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
