import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { ExpenseCategory, PaymentMethod, ExpenseSplitType, } from '@waylo/shared';
import { useCreateExpense } from './hooks';
export const CATEGORY_LABELS = {
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
export const PAYMENT_METHOD_LABELS = {
    [PaymentMethod.UPI]: '⚡ Instant UPI',
    [PaymentMethod.CARD]: '💳 Credit / Debit Card',
    [PaymentMethod.CASH]: '💵 Cash',
    [PaymentMethod.BANK_TRANSFER]: '🏦 Bank Transfer / NEFT',
    [PaymentMethod.OTHER]: '✨ Other',
};
export function CreateExpenseDialog({ open, onOpenChange, trip, }) {
    const createMutation = useCreateExpense(trip.id);
    const [title, setTitle] = useState('');
    const [displayAmount, setDisplayAmount] = useState('');
    const [category, setCategory] = useState(ExpenseCategory.FOOD);
    const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.UPI);
    const [paidById, setPaidById] = useState(trip.ownerId || '');
    const [splitType, setSplitType] = useState(ExpenseSplitType.EQUAL);
    const [notes, setNotes] = useState('');
    // Selected members to split with (defaults to all members)
    const initialSelected = trip.members?.map((m) => m.userId) || [trip.ownerId];
    const [selectedMemberIds, setSelectedMemberIds] = useState(initialSelected);
    const toggleMember = (userId) => {
        setSelectedMemberIds((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const parsedAmount = parseFloat(displayAmount);
        if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0)
            return;
        // Convert standard units (e.g. ₹500) to stored cents (50000)
        const amountInCents = Math.round(parsedAmount * 100);
        const splits = selectedMemberIds.length > 0
            ? selectedMemberIds.map((userId) => ({
                userId,
                amount: Math.round(amountInCents / selectedMemberIds.length),
            }))
            : undefined;
        await createMutation.mutateAsync({
            title: title.trim(),
            amount: amountInCents,
            currency: trip.currency || 'INR',
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
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-md max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "text-xl font-bold", children: "Log New Expense" }), _jsx(DialogDescription, { className: "text-xs text-muted-foreground", children: "Track road tolls, meals, fuel fill-ups, and split costs fairly with your travel crew." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-2", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "exp-title", className: "text-xs font-semibold", children: "Expense Description *" }), _jsx(Input, { id: "exp-title", placeholder: "e.g. Seafood Dinner at Curlies, Highway Toll", value: title, onChange: (e) => setTitle(e.target.value), required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "exp-amount", className: "text-xs font-semibold", children: ["Amount (", trip.currency || 'INR', ") *"] }), _jsx(Input, { id: "exp-amount", type: "number", step: "0.01", min: "0.01", placeholder: "0.00", value: displayAmount, onChange: (e) => setDisplayAmount(e.target.value), required: true })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { className: "text-xs font-semibold", children: "Category" }), _jsxs(Select, { value: category, onValueChange: (v) => setCategory(v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (_jsx(SelectItem, { value: catKey, children: label }, catKey))) })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { className: "text-xs font-semibold", children: "Payment Mode" }), _jsxs(Select, { value: paymentMethod, onValueChange: (v) => setPaymentMethod(v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: Object.entries(PAYMENT_METHOD_LABELS).map(([pmKey, label]) => (_jsx(SelectItem, { value: pmKey, children: label }, pmKey))) })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { className: "text-xs font-semibold", children: "Paid By" }), _jsxs(Select, { value: paidById, onValueChange: setPaidById, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select payer" }) }), _jsx(SelectContent, { children: trip.members && trip.members.length > 0 ? (trip.members.map((m) => (_jsx(SelectItem, { value: m.userId, children: m.user?.displayName || 'Crew Member' }, m.userId)))) : (_jsx(SelectItem, { value: trip.ownerId, children: trip.owner?.displayName || 'Lead Traveler' })) })] })] })] }), _jsxs("div", { className: "space-y-2 pt-2 border-t border-border/60", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { className: "text-xs font-semibold", children: "Split Strategy" }), _jsxs("span", { className: "text-[11px] text-muted-foreground", children: [selectedMemberIds.length, " member", selectedMemberIds.length !== 1 ? 's' : '', " sharing"] })] }), _jsx("div", { className: "flex gap-2", children: _jsx(Button, { type: "button", size: "sm", variant: splitType === ExpenseSplitType.EQUAL ? 'default' : 'outline', onClick: () => setSplitType(ExpenseSplitType.EQUAL), className: "text-xs flex-1 rounded-xl", children: "Equal Split" }) }), _jsx("div", { className: "flex flex-wrap gap-2 pt-1", children: (trip.members && trip.members.length > 0
                                        ? trip.members
                                        : [
                                            {
                                                userId: trip.ownerId,
                                                user: { displayName: trip.owner?.displayName || 'You' },
                                            },
                                        ]).map((member) => {
                                        const isSelected = selectedMemberIds.includes(member.userId);
                                        return (_jsxs("button", { type: "button", onClick: () => toggleMember(member.userId), className: `px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${isSelected
                                                ? 'bg-primary/10 border-primary text-primary font-semibold'
                                                : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted'}`, children: [_jsx("span", { children: isSelected ? '✓' : '+' }), _jsx("span", { children: member.user?.displayName || 'Crew Member' })] }, member.userId));
                                    }) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "exp-notes", className: "text-xs font-semibold", children: "Notes (optional)" }), _jsx(Textarea, { id: "exp-notes", placeholder: "e.g. Paid via GooglePay, receipt kept with lead.", rows: 2, value: notes, onChange: (e) => setNotes(e.target.value) })] }), _jsxs(DialogFooter, { className: "pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), className: "rounded-xl", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: createMutation.isPending || !title.trim() || !displayAmount, className: "rounded-xl font-bold", children: createMutation.isPending ? 'Logging...' : 'Save Expense' })] })] })] }) }));
}
//# sourceMappingURL=CreateExpenseDialog.js.map