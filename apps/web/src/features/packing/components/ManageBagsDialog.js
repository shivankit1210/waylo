import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLuggageBagSchema, LuggageBagType, } from '@waylo/shared';
import { useCreateLuggageBag, useDeleteLuggageBag } from '../hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Luggage, Plus, Trash2 } from 'lucide-react';
const BAG_TYPES = [
    { type: LuggageBagType.TANK_BAG, label: 'Tank Bag' },
    { type: LuggageBagType.SADDLEBAGS, label: 'Saddlebags' },
    { type: LuggageBagType.TOP_BOX, label: 'Top Box' },
    { type: LuggageBagType.BACKPACK, label: 'Backpack / Rucksack' },
    { type: LuggageBagType.DUFFEL, label: 'Duffel Bag' },
    { type: LuggageBagType.SUITCASE, label: 'Suitcase / Trolley' },
    { type: LuggageBagType.DAYPACK, label: 'Daypack' },
    { type: LuggageBagType.OTHER, label: 'Other Bag' },
];
export function ManageBagsDialog({ tripId, bags, open, onOpenChange, }) {
    const [isAdding, setIsAdding] = useState(false);
    const createBagMutation = useCreateLuggageBag(tripId);
    const deleteBagMutation = useDeleteLuggageBag(tripId);
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(createLuggageBagSchema),
        defaultValues: {
            bagType: LuggageBagType.BACKPACK,
            name: '',
        },
    });
    const onSubmit = async (data) => {
        try {
            await createBagMutation.mutateAsync({
                ...data,
                capacityLiters: data.capacityLiters ? Number(data.capacityLiters) : undefined,
                maxWeightKg: data.maxWeightKg ? Number(data.maxWeightKg) : undefined,
            });
            toast.success('Luggage bag added!');
            reset();
            setIsAdding(false);
        }
        catch (err) {
            toast.error(err?.response?.data?.error?.message || 'Failed to add bag');
        }
    };
    const handleDelete = async (bagId) => {
        try {
            await deleteBagMutation.mutateAsync(bagId);
            toast.success('Bag removed');
        }
        catch {
            toast.error('Failed to remove bag');
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-w-md sm:max-w-lg rounded-3xl p-6 max-h-[85vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center", children: _jsx(Luggage, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx(DialogTitle, { className: "text-xl font-bold", children: "Luggage Bags" }), _jsx(DialogDescription, { className: "text-xs", children: "Organize items across tank bags, saddlebags, backpacks, and duffels" })] })] }) }), _jsxs("div", { className: "space-y-4 pt-2", children: [_jsx("div", { className: "space-y-2", children: bags.length === 0 ? (_jsx("p", { className: "text-xs text-muted-foreground text-center py-4 bg-muted/30 rounded-2xl", children: "No luggage bags created yet. Add your tank bag, saddlebags, or backpacks below." })) : (bags.map((bag) => (_jsxs(Card, { className: "p-3.5 rounded-2xl border-border/80 flex items-center justify-between gap-3", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-bold text-xs text-foreground", children: bag.name }), _jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold", children: bag.bagType.replace('_', ' ') })] }), _jsxs("div", { className: "flex items-center gap-3 text-[11px] text-muted-foreground", children: [bag.capacityLiters && _jsxs("span", { children: [bag.capacityLiters, " Liters"] }), bag.maxWeightKg && _jsxs("span", { children: ["Max: ", bag.maxWeightKg, " kg"] }), bag.color && _jsxs("span", { children: ["Color: ", bag.color] })] })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(bag.id), className: "h-8 w-8 p-0 text-muted-foreground hover:text-destructive rounded-xl", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }, bag.id)))) }), !isAdding ? (_jsxs(Button, { type: "button", variant: "outline", onClick: () => setIsAdding(true), className: "w-full gap-2 rounded-2xl text-xs font-semibold h-10", children: [_jsx(Plus, { className: "h-4 w-4" }), _jsx("span", { children: "Add New Luggage Bag" })] })) : (_jsxs(Card, { className: "p-4 rounded-2xl border border-primary/30 bg-primary/5 space-y-3", children: [_jsx("h4", { className: "text-xs font-bold text-foreground", children: "Add Luggage Bag" }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(Label, { htmlFor: "name", className: "text-[11px]", children: "Bag Name *" }), _jsx(Input, { id: "name", placeholder: "e.g. Left Saddlebag / 60L Rucksack", ...register('name'), className: "h-9 text-xs" }), errors.name && (_jsx("p", { className: "text-[10px] text-destructive", children: errors.name.message }))] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(Label, { htmlFor: "bagType", className: "text-[11px]", children: "Bag Type" }), _jsx("select", { id: "bagType", ...register('bagType'), className: "w-full h-9 px-2.5 rounded-xl border border-input bg-background text-xs focus:outline-none", children: BAG_TYPES.map((b) => (_jsx("option", { value: b.type, children: b.label }, b.type))) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { htmlFor: "capacityLiters", className: "text-[11px]", children: "Capacity (Liters)" }), _jsx(Input, { id: "capacityLiters", type: "number", placeholder: "e.g. 30", ...register('capacityLiters', { valueAsNumber: true }), className: "h-9 text-xs" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [_jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setIsAdding(false), className: "rounded-xl text-xs", children: "Cancel" }), _jsx(Button, { type: "submit", variant: "gradient", size: "sm", disabled: createBagMutation.isPending, className: "rounded-xl text-xs font-semibold", children: createBagMutation.isPending ? 'Saving...' : 'Save Bag' })] })] })] }))] })] }) }));
}
//# sourceMappingURL=ManageBagsDialog.js.map