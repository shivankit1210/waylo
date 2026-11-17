import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPackingItemSchema, PackingCategory, PackingStatus, } from '@waylo/shared';
import { useCreatePackingItem } from '../hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { PlusCircle, Luggage, Calendar, User, Tag } from 'lucide-react';
const CATEGORIES = [
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
export function CreateItemDialog({ tripId, listId, bags, open, onOpenChange, defaultCategory, }) {
    const createItemMutation = useCreatePackingItem(tripId);
    const { register, handleSubmit, watch, setValue, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(createPackingItemSchema),
        defaultValues: {
            name: '',
            category: defaultCategory || PackingCategory.MISCELLANEOUS,
            quantity: 1,
            status: PackingStatus.NOT_PACKED,
            isRequired: true,
            isShared: false,
        },
    });
    const selectedCategory = watch('category');
    const isRequired = watch('isRequired');
    const isShared = watch('isShared');
    const onSubmit = async (data) => {
        try {
            await createItemMutation.mutateAsync({
                listId,
                data: {
                    ...data,
                    quantity: Number(data.quantity) || 1,
                    weightGrams: data.weightGrams ? Number(data.weightGrams) : undefined,
                    dayNumber: data.dayNumber ? Number(data.dayNumber) : undefined,
                    bagId: data.bagId || undefined,
                },
            });
            toast.success('Item added to packing list!');
            reset();
            onOpenChange(false);
        }
        catch (err) {
            toast.error(err?.response?.data?.error?.message || 'Failed to add item');
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-w-md sm:max-w-lg rounded-3xl p-6 max-h-[90vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center", children: _jsx(PlusCircle, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx(DialogTitle, { className: "text-xl font-bold", children: "Add Packing Item" }), _jsx(DialogDescription, { className: "text-xs", children: "Add gear, apparel, documents, or accessories to your checklist" })] })] }) }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4 pt-2", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { className: "text-xs font-semibold flex items-center gap-1", children: [_jsx(Tag, { className: "h-3.5 w-3.5 text-primary" }), " Category"] }), _jsx("div", { className: "flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1", children: CATEGORIES.map(({ cat, label }) => (_jsx("button", { type: "button", onClick: () => setValue('category', cat), className: `px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${selectedCategory === cat
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'}`, children: label }, cat))) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "name", className: "text-xs", children: "Item Name *" }), _jsx(Input, { id: "name", placeholder: "e.g. Gore-Tex Rain Shell / Power Bank 20k", ...register('name'), className: "h-10 text-sm font-medium" }), errors.name && (_jsx("p", { className: "text-[11px] text-destructive", children: errors.name.message }))] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "quantity", className: "text-xs", children: "Quantity" }), _jsx(Input, { id: "quantity", type: "number", min: "1", ...register('quantity', { valueAsNumber: true }), className: "h-10 text-xs font-bold" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "weightGrams", className: "text-xs", children: "Weight (grams, optional)" }), _jsx(Input, { id: "weightGrams", type: "number", placeholder: "e.g. 450", ...register('weightGrams', { valueAsNumber: true }), className: "h-10 text-xs" })] })] }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "bagId", className: "text-xs flex items-center gap-1", children: [_jsx(Luggage, { className: "h-3.5 w-3.5 text-blue-500" }), "Luggage Bag"] }), _jsxs("select", { id: "bagId", ...register('bagId'), className: "w-full h-10 px-3 rounded-xl border border-input bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "", children: "Unassigned" }), bags.map((b) => (_jsxs("option", { value: b.id, children: [b.name, " (", b.bagType.replace('_', ' '), ")"] }, b.id)))] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "assignedTo", className: "text-xs flex items-center gap-1", children: [_jsx(User, { className: "h-3.5 w-3.5 text-emerald-500" }), "Packer / Assignee"] }), _jsx(Input, { id: "assignedTo", placeholder: "e.g. Self, Alex, Lead Rider", ...register('assignedTo'), className: "h-10 text-xs" })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "dayNumber", className: "text-xs flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3.5 w-3.5 text-purple-500" }), "Day Outfit (Optional)"] }), _jsx(Input, { id: "dayNumber", type: "number", placeholder: "e.g. Day 1 (Leave blank for general trip gear)", min: "1", ...register('dayNumber', { valueAsNumber: true }), className: "h-10 text-xs" })] }), _jsxs("div", { className: "p-3.5 rounded-2xl border border-border/80 bg-muted/20 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-foreground", children: "Required Item" }), _jsx("p", { className: "text-[11px] text-muted-foreground", children: "Essential for departure (cannot be forgotten)" })] }), _jsx(Switch, { checked: isRequired, onCheckedChange: (checked) => setValue('isRequired', checked) })] }), _jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-border/50", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-foreground", children: "Shared Group Item" }), _jsx("p", { className: "text-[11px] text-muted-foreground", children: "Shared amongst riders/passengers (e.g. tool roll, pump, stove)" })] }), _jsx(Switch, { checked: isShared, onCheckedChange: (checked) => setValue('isShared', checked) })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "notes", className: "text-xs", children: "Packing Tips & Notes" }), _jsx(Textarea, { id: "notes", placeholder: "e.g. Keep in top pouch for quick road access", rows: 2, ...register('notes'), className: "resize-none text-xs" })] }), _jsxs(DialogFooter, { className: "pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), className: "rounded-xl", children: "Cancel" }), _jsx(Button, { type: "submit", variant: "gradient", disabled: createItemMutation.isPending, className: "rounded-xl font-semibold", children: createItemMutation.isPending ? 'Adding...' : 'Add to Checklist' })] })] })] }) }));
}
//# sourceMappingURL=CreateItemDialog.js.map