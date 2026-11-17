import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ExpenseCategory,
  PaymentMethod,
  ExpenseSplitType,
  type TripWithDetails,
} from '@waylo/shared';
import { useCreateExpense } from './hooks';

interface CreateExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripWithDetails | any;
}

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FUEL]: '⛽ Fuel & Charging',
  [ExpenseCategory.ACCOMMODATION]: '🏨 Stay & Homestay',
  [ExpenseCategory.FOOD]: '🍽️ Food & Dining',
  [ExpenseCategory.TOLLS]: '🛣️ Tolls & Highway',
  [ExpenseCategory.PARKING]: '🅿️ Parking',
  [ExpenseCategory.TICKETS]: '🎟️ Tickets & Entry',
  [ExpenseCategory.VEHICLE_RENTAL]: '🚗 Vehicle Rental',
  [ExpenseCategory.REPAIRS]: '🔧 Repairs & Service',
  [ExpenseCategory.SHOPPING]: '🛍️ Shopping & Souvenirs',
  [ExpenseCategory.CONNECTIVITY]: '📶 SIM & WiFi',
  [ExpenseCategory.MISCELLANEOUS]: '📦 Miscellaneous',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.UPI]: '⚡ Instant UPI',
  [PaymentMethod.CARD]: '💳 Credit / Debit Card',
  [PaymentMethod.CASH]: '💵 Cash',
  [PaymentMethod.BANK_TRANSFER]: '🏦 Bank Transfer / NEFT',
  [PaymentMethod.OTHER]: '✨ Other',
};

export function CreateExpenseDialog({
  open,
  onOpenChange,
  trip,
}: CreateExpenseDialogProps) {
  const createMutation = useCreateExpense(trip.id);

  const [title, setTitle] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.FOOD);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.UPI);
  const [paidById, setPaidById] = useState<string>(trip.ownerId || '');
  const [splitType, setSplitType] = useState<ExpenseSplitType>(ExpenseSplitType.EQUAL);
  const [notes, setNotes] = useState('');

  // Selected members to split with (defaults to all members)
  const initialSelected = trip.members?.map((m: any) => m.userId) || [trip.ownerId];
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(initialSelected);

  const toggleMember = (userId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(displayAmount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    // Convert standard units (e.g. ₹500) to stored cents (50000)
    const amountInCents = Math.round(parsedAmount * 100);

    const splits =
      selectedMemberIds.length > 0
        ? selectedMemberIds.map((userId) => ({
            userId,
            amount: Math.round(amountInCents / selectedMemberIds.length),
          }))
        : undefined;

    await createMutation.mutateAsync({
      title: title.trim(),
      amount: amountInCents,
      currency: (trip.currency as any) || 'INR',
      category,
      paymentMethod,
      paidById: paidById || undefined,
      splitType,
      splits,
      notes: notes.trim() || null,
    });

    setTitle('');
    setDisplayAmount('');
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Log New Expense</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Track road tolls, meals, fuel fill-ups, and split costs fairly with your travel crew.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="exp-title" className="text-xs font-semibold">
              Expense Description *
            </Label>
            <Input
              id="exp-title"
              placeholder="e.g. Seafood Dinner at Curlies, Highway Toll"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="exp-amount" className="text-xs font-semibold">
                Amount ({trip.currency || 'INR'}) *
              </Label>
              <Input
                id="exp-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={displayAmount}
                onChange={(e) => setDisplayAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
                    <SelectItem key={catKey} value={catKey}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Method & Payer */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Payment Mode</Label>
              <Select
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_METHOD_LABELS).map(([pmKey, label]) => (
                    <SelectItem key={pmKey} value={pmKey}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Paid By</Label>
              <Select value={paidById} onValueChange={setPaidById}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payer" />
                </SelectTrigger>
                <SelectContent>
                  {trip.members && trip.members.length > 0 ? (
                    trip.members.map((m: any) => (
                      <SelectItem key={m.userId} value={m.userId}>
                        {m.user?.displayName || 'Crew Member'}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value={trip.ownerId}>
                      {trip.owner?.displayName || 'Lead Traveler'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Split Settings */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Split Strategy</Label>
              <span className="text-[11px] text-muted-foreground">
                {selectedMemberIds.length} member{selectedMemberIds.length !== 1 ? 's' : ''} sharing
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={splitType === ExpenseSplitType.EQUAL ? 'default' : 'outline'}
                onClick={() => setSplitType(ExpenseSplitType.EQUAL)}
                className="text-xs flex-1 rounded-xl"
              >
                Equal Split
              </Button>
            </div>

            {/* Split Members Checkboxes */}
            <div className="flex flex-wrap gap-2 pt-1">
              {(trip.members && trip.members.length > 0
                ? trip.members
                : [
                    {
                      userId: trip.ownerId,
                      user: { displayName: trip.owner?.displayName || 'You' },
                    },
                  ]
              ).map((member: any) => {
                const isSelected = selectedMemberIds.includes(member.userId);
                return (
                  <button
                    key={member.userId}
                    type="button"
                    onClick={() => toggleMember(member.userId)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-primary font-semibold'
                        : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{member.user?.displayName || 'Crew Member'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="exp-notes" className="text-xs font-semibold">
              Notes (optional)
            </Label>
            <Textarea
              id="exp-notes"
              placeholder="e.g. Paid via GooglePay, receipt kept with lead."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              disabled={createMutation.isPending || !title.trim() || !displayAmount}
              className="rounded-xl font-bold"
            >
              {createMutation.isPending ? 'Logging...' : 'Save Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
