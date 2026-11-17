import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createItineraryDaySchema, } from '@waylo/shared';
import { useCreateDay } from '../hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CalendarPlus, MapPin, Navigation, Clock } from 'lucide-react';
export function CreateDayDialog({ tripId, nextDayNumber, tripStartDate, open, onOpenChange, onSuccess, }) {
    const createDayMutation = useCreateDay(tripId);
    // Default date calculated from start date if available
    const calculateDefaultDate = () => {
        if (!tripStartDate)
            return '';
        const d = new Date(tripStartDate);
        d.setDate(d.getDate() + (nextDayNumber - 1));
        return d.toISOString().split('T')[0];
    };
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(createItineraryDaySchema),
        defaultValues: {
            dayNumber: nextDayNumber,
            title: `Day ${nextDayNumber} Expedition`,
            plannedDeparture: '08:00',
            plannedArrival: '18:00',
            plannedDistanceKm: 120,
        },
    });
    const onSubmit = async (data) => {
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
        }
        catch (err) {
            toast.error(err?.response?.data?.error?.message || 'Failed to create day');
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-w-md sm:max-w-lg rounded-3xl p-6", children: [_jsx(DialogHeader, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center", children: _jsx(CalendarPlus, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx(DialogTitle, { className: "text-xl font-bold", children: "Add Itinerary Day" }), _jsx(DialogDescription, { className: "text-xs", children: "Plan a new day of exploration, routing, and waypoints" })] })] }) }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4 pt-2", children: [_jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "dayNumber", className: "text-xs", children: "Day #" }), _jsx(Input, { id: "dayNumber", type: "number", min: "1", ...register('dayNumber', { valueAsNumber: true }), className: "h-10 font-bold" }), errors.dayNumber && (_jsx("p", { className: "text-[11px] text-destructive", children: errors.dayNumber.message }))] }), _jsxs("div", { className: "col-span-2 space-y-1.5", children: [_jsx(Label, { htmlFor: "title", className: "text-xs", children: "Day Title" }), _jsx(Input, { id: "title", placeholder: "e.g. Coastal Route to Vagator", ...register('title'), className: "h-10" })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "date", className: "text-xs", children: "Calendar Date (Optional)" }), _jsx(Input, { id: "date", type: "date", defaultValue: calculateDefaultDate(), ...register('date'), className: "h-10" })] }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "startLocation", className: "text-xs flex items-center gap-1", children: [_jsx(MapPin, { className: "h-3.5 w-3.5 text-blue-500" }), "Start Origin"] }), _jsx(Input, { id: "startLocation", placeholder: "e.g. Panjim / Hotel Base", ...register('startLocation'), className: "h-10" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "endLocation", className: "text-xs flex items-center gap-1", children: [_jsx(Navigation, { className: "h-3.5 w-3.5 text-emerald-500" }), "Target Destination"] }), _jsx(Input, { id: "endLocation", placeholder: "e.g. Palolem Beach", ...register('endLocation'), className: "h-10" })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "plannedDeparture", className: "text-xs flex items-center gap-1", children: [_jsx(Clock, { className: "h-3.5 w-3.5 text-amber-500" }), "Departure"] }), _jsx(Input, { id: "plannedDeparture", type: "time", ...register('plannedDeparture'), className: "h-10 text-xs" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "plannedArrival", className: "text-xs flex items-center gap-1", children: [_jsx(Clock, { className: "h-3.5 w-3.5 text-purple-500" }), "Arrival"] }), _jsx(Input, { id: "plannedArrival", type: "time", ...register('plannedArrival'), className: "h-10 text-xs" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "plannedDistanceKm", className: "text-xs", children: "Distance (km)" }), _jsx(Input, { id: "plannedDistanceKm", type: "number", step: "0.1", placeholder: "120", ...register('plannedDistanceKm', { valueAsNumber: true }), className: "h-10 text-xs" })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "notes", className: "text-xs", children: "Day Briefing & Road Notes" }), _jsx(Textarea, { id: "notes", placeholder: "e.g. Early fuel top-up recommended before mountain ghats. Carry rain shell.", rows: 2, ...register('notes'), className: "resize-none text-xs" })] }), _jsxs(DialogFooter, { className: "pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), className: "rounded-xl", children: "Cancel" }), _jsx(Button, { type: "submit", variant: "gradient", disabled: createDayMutation.isPending, className: "rounded-xl font-semibold", children: createDayMutation.isPending ? 'Adding Day...' : 'Add Day to Plan' })] })] })] }) }));
}
//# sourceMappingURL=CreateDayDialog.js.map