import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createItineraryItemSchema, ItineraryItemType, ActivityFlexibility, } from '@waylo/shared';
import { useCreateItem } from '../hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { PlusCircle, MapPin, Clock, Compass, UtensilsCrossed, Fuel, Coffee, Camera, Hotel, Navigation, } from 'lucide-react';
const ITEM_TYPES = [
    { type: ItineraryItemType.SIGHTSEEING, label: 'Sightseeing', icon: Camera },
    { type: ItineraryItemType.MEAL, label: 'Food / Meal', icon: UtensilsCrossed },
    { type: ItineraryItemType.FUEL_STOP, label: 'Fuel / Charging', icon: Fuel },
    { type: ItineraryItemType.REST, label: 'Rest / Break', icon: Coffee },
    { type: ItineraryItemType.ACTIVITY, label: 'Activity / Tour', icon: Compass },
    { type: ItineraryItemType.CHECK_IN, label: 'Hotel Check-in', icon: Hotel },
    { type: ItineraryItemType.TRAVEL, label: 'Scenic Route / Ride', icon: Navigation },
];
export function CreateItemDialog({ tripId, dayId, dayNumber, open, onOpenChange, nextOrderIndex, }) {
    const createItemMutation = useCreateItem(tripId);
    const { register, handleSubmit, watch, setValue, reset, formState: { errors }, } = useForm({
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
    const onSubmit = async (data) => {
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
        }
        catch (err) {
            toast.error(err?.response?.data?.error?.message || 'Failed to add activity');
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-w-md sm:max-w-lg rounded-3xl p-6 max-h-[90vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center", children: _jsx(PlusCircle, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx(DialogTitle, { className: "text-xl font-bold", children: "Add Stop or Activity" }), _jsxs(DialogDescription, { className: "text-xs", children: ["Add to Day ", dayNumber, " schedule and timeline"] })] })] }) }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4 pt-2", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { className: "text-xs font-semibold", children: "Activity Type" }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: ITEM_TYPES.map(({ type, label, icon: Icon }) => (_jsxs("button", { type: "button", onClick: () => setValue('itemType', type), className: `flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${selectedType === type
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'}`, children: [_jsx(Icon, { className: "h-3.5 w-3.5" }), _jsx("span", { children: label })] }, type))) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "title", className: "text-xs", children: "Activity / Stop Title *" }), _jsx(Input, { id: "title", placeholder: "e.g. Aguada Fort Sunset Viewpoint", ...register('title'), className: "h-10 text-sm font-medium" }), errors.title && (_jsx("p", { className: "text-[11px] text-destructive", children: errors.title.message }))] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "location", className: "text-xs flex items-center gap-1", children: [_jsx(MapPin, { className: "h-3.5 w-3.5 text-blue-500" }), "Location / Waypoint Name"] }), _jsx(Input, { id: "location", placeholder: "e.g. Candolim, North Goa", ...register('location'), className: "h-10 text-xs" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "startTime", className: "text-xs flex items-center gap-1", children: [_jsx(Clock, { className: "h-3.5 w-3.5 text-amber-500" }), "Start Time"] }), _jsx(Input, { id: "startTime", type: "time", ...register('startTime'), className: "h-10 text-xs" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "endTime", className: "text-xs flex items-center gap-1", children: [_jsx(Clock, { className: "h-3.5 w-3.5 text-purple-500" }), "End Time"] }), _jsx(Input, { id: "endTime", type: "time", ...register('endTime'), className: "h-10 text-xs" })] })] }), _jsxs("div", { className: "p-3.5 rounded-2xl border border-border/80 bg-muted/20 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-foreground", children: "Fixed Schedule" }), _jsx("p", { className: "text-[11px] text-muted-foreground", children: "Check if timing is rigid (e.g. ticketed slot or hotel check-in)" })] }), _jsx(Switch, { checked: flexibility === ActivityFlexibility.FIXED, onCheckedChange: (checked) => setValue('flexibility', checked ? ActivityFlexibility.FIXED : ActivityFlexibility.FLEXIBLE) })] }), _jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-border/50", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-foreground", children: "Optional Stop" }), _jsx("p", { className: "text-[11px] text-muted-foreground", children: "Can be dropped/skipped if the group runs late" })] }), _jsx(Switch, { checked: isOptional, onCheckedChange: (checked) => setValue('isOptional', checked) })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "cost", className: "text-xs", children: "Estimated Cost (\u20B9)" }), _jsx(Input, { id: "cost", type: "number", placeholder: "0", min: "0", ...register('cost', { valueAsNumber: true }), className: "h-10 text-xs" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "notes", className: "text-xs", children: "Details & Instructions" }), _jsx(Textarea, { id: "notes", placeholder: "e.g. Entry ticket \u20B950 per person. Wear comfortable shoes.", rows: 2, ...register('notes'), className: "resize-none text-xs" })] }), _jsxs(DialogFooter, { className: "pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), className: "rounded-xl", children: "Cancel" }), _jsx(Button, { type: "submit", variant: "gradient", disabled: createItemMutation.isPending, className: "rounded-xl font-semibold", children: createItemMutation.isPending ? 'Saving...' : 'Add Stop to Timeline' })] })] })] }) }));
}
//# sourceMappingURL=CreateItemDialog.js.map