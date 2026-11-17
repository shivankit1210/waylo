import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateItineraryDaySchema, } from '@waylo/shared';
import { useUpdateDay } from '../hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Edit3, MapPin, Navigation, Clock, CheckCircle2 } from 'lucide-react';
export function EditDayDialog({ tripId, day, open, onOpenChange, }) {
    const updateDayMutation = useUpdateDay(tripId);
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(updateItineraryDaySchema),
    });
    useEffect(() => {
        if (day) {
            reset({
                dayNumber: day.dayNumber,
                title: day.title || '',
                startLocation: day.startLocation || '',
                endLocation: day.endLocation || '',
                plannedDeparture: day.plannedDeparture || '08:00',
                plannedArrival: day.plannedArrival || '18:00',
                actualDeparture: day.actualDeparture || '',
                actualArrival: day.actualArrival || '',
                plannedDistanceKm: day.plannedDistanceKm ?? undefined,
                actualDistanceKm: day.actualDistanceKm ?? undefined,
                notes: day.notes || '',
                date: day.date ? new Date(day.date).toISOString().split('T')[0] : undefined,
            });
        }
    }, [day, reset]);
    if (!day)
        return null;
    const onSubmit = async (data) => {
        try {
            await updateDayMutation.mutateAsync({
                dayId: day.id,
                data: {
                    ...data,
                    dayNumber: data.dayNumber ? Number(data.dayNumber) : undefined,
                    date: data.date ? new Date(data.date).toISOString() : null,
                    plannedDistanceKm: data.plannedDistanceKm ? Number(data.plannedDistanceKm) : null,
                    actualDistanceKm: data.actualDistanceKm ? Number(data.actualDistanceKm) : null,
                },
            });
            toast.success(`Day ${day.dayNumber} updated!`);
            onOpenChange(false);
        }
        catch (err) {
            toast.error(err?.response?.data?.error?.message || 'Failed to update day');
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-w-md sm:max-w-lg rounded-3xl p-6 max-h-[90vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center", children: _jsx(Edit3, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsxs(DialogTitle, { className: "text-xl font-bold", children: ["Edit Day ", day.dayNumber] }), _jsx(DialogDescription, { className: "text-xs", children: "Update planned & actual schedules, waypoints, and distance" })] })] }) }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4 pt-2", children: [_jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "dayNumber", className: "text-xs", children: "Day #" }), _jsx(Input, { id: "dayNumber", type: "number", min: "1", ...register('dayNumber', { valueAsNumber: true }), className: "h-10 font-bold" }), errors.dayNumber && (_jsx("p", { className: "text-[11px] text-destructive", children: errors.dayNumber.message }))] }), _jsxs("div", { className: "col-span-2 space-y-1.5", children: [_jsx(Label, { htmlFor: "title", className: "text-xs", children: "Day Title" }), _jsx(Input, { id: "title", placeholder: "Day title", ...register('title'), className: "h-10 font-medium" })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "date", className: "text-xs", children: "Calendar Date" }), _jsx(Input, { id: "date", type: "date", ...register('date'), className: "h-10" })] }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "startLocation", className: "text-xs flex items-center gap-1", children: [_jsx(MapPin, { className: "h-3.5 w-3.5 text-blue-500" }), "Origin / Morning Base"] }), _jsx(Input, { id: "startLocation", placeholder: "Panjim", ...register('startLocation'), className: "h-10" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "endLocation", className: "text-xs flex items-center gap-1", children: [_jsx(Navigation, { className: "h-3.5 w-3.5 text-emerald-500" }), "Target / Overnight Stay"] }), _jsx(Input, { id: "endLocation", placeholder: "Palolem", ...register('endLocation'), className: "h-10" })] })] }), _jsxs("div", { className: "p-3.5 rounded-2xl border border-border/80 bg-muted/20 space-y-2.5", children: [_jsxs("p", { className: "text-xs font-bold text-foreground flex items-center gap-1.5", children: [_jsx(Clock, { className: "h-3.5 w-3.5 text-primary" }), "Planned Schedule & Distance"] }), _jsxs("div", { className: "grid grid-cols-3 gap-2.5", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "plannedDeparture", className: "text-[11px] text-muted-foreground", children: "Departure" }), _jsx(Input, { id: "plannedDeparture", type: "time", ...register('plannedDeparture'), className: "h-9 text-xs" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "plannedArrival", className: "text-[11px] text-muted-foreground", children: "Arrival" }), _jsx(Input, { id: "plannedArrival", type: "time", ...register('plannedArrival'), className: "h-9 text-xs" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "plannedDistanceKm", className: "text-[11px] text-muted-foreground", children: "Planned (km)" }), _jsx(Input, { id: "plannedDistanceKm", type: "number", step: "0.1", ...register('plannedDistanceKm', { valueAsNumber: true }), className: "h-9 text-xs" })] })] })] }), _jsxs("div", { className: "p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2.5", children: [_jsxs("p", { className: "text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5", children: [_jsx(CheckCircle2, { className: "h-3.5 w-3.5" }), "Actual Recorded Progress (En-Route)"] }), _jsxs("div", { className: "grid grid-cols-3 gap-2.5", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "actualDeparture", className: "text-[11px] text-muted-foreground", children: "Actual Dept." }), _jsx(Input, { id: "actualDeparture", type: "time", ...register('actualDeparture'), className: "h-9 text-xs" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "actualArrival", className: "text-[11px] text-muted-foreground", children: "Actual Arriv." }), _jsx(Input, { id: "actualArrival", type: "time", ...register('actualArrival'), className: "h-9 text-xs" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "actualDistanceKm", className: "text-[11px] text-muted-foreground", children: "Actual (km)" }), _jsx(Input, { id: "actualDistanceKm", type: "number", step: "0.1", ...register('actualDistanceKm', { valueAsNumber: true }), className: "h-9 text-xs" })] })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "notes", className: "text-xs", children: "Briefing & Road Condition Notes" }), _jsx(Textarea, { id: "notes", placeholder: "Road warnings, scenic diversions, regroup notes", rows: 2, ...register('notes'), className: "resize-none text-xs" })] }), _jsxs(DialogFooter, { className: "pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), className: "rounded-xl", children: "Cancel" }), _jsx(Button, { type: "submit", variant: "gradient", disabled: updateDayMutation.isPending, className: "rounded-xl font-semibold", children: updateDayMutation.isPending ? 'Updating...' : 'Save Changes' })] })] })] }) }));
}
//# sourceMappingURL=EditDayDialog.js.map