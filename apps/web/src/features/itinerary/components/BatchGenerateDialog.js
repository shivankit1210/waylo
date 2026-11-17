import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { batchGenerateDaysSchema, } from '@waylo/shared';
import { useBatchGenerateDays } from '../hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Sparkles, Calendar, MapPin, Navigation } from 'lucide-react';
export function BatchGenerateDialog({ trip, open, onOpenChange, onSuccess, }) {
    const batchGenerateMutation = useBatchGenerateDays(trip.id);
    // Default day count calculation
    const calculateDefaultDays = () => {
        if (trip.startDate && trip.endDate) {
            const diff = Math.abs(new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime());
            return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1, 1);
        }
        return 4;
    };
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(batchGenerateDaysSchema),
        defaultValues: {
            dayCount: calculateDefaultDays(),
            startLocation: trip.startLocation || '',
            destination: trip.destination || '',
            startDate: trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : '',
            endDate: trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : '',
        },
    });
    const onSubmit = async (data) => {
        try {
            await batchGenerateMutation.mutateAsync({
                ...data,
                dayCount: data.dayCount ? Number(data.dayCount) : undefined,
                startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
                endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
            });
            toast.success('Itinerary days and initial activities generated!');
            onOpenChange(false);
            onSuccess?.();
        }
        catch (err) {
            toast.error(err?.response?.data?.error?.message || 'Failed to generate days');
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-w-md sm:max-w-lg rounded-3xl p-6", children: [_jsx(DialogHeader, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center", children: _jsx(Sparkles, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx(DialogTitle, { className: "text-xl font-bold", children: "Auto-Generate Itinerary" }), _jsx(DialogDescription, { className: "text-xs", children: "Create structured daily schedules based on your trip duration & route" })] })] }) }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4 pt-2", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "dayCount", className: "text-xs", children: "Number of Days" }), _jsx(Input, { id: "dayCount", type: "number", min: "1", max: "60", ...register('dayCount', { valueAsNumber: true }), className: "h-10 font-bold" }), errors.dayCount && (_jsx("p", { className: "text-[11px] text-destructive", children: errors.dayCount.message }))] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "startDate", className: "text-xs flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3.5 w-3.5 text-blue-500" }), "Start Date"] }), _jsx(Input, { id: "startDate", type: "date", ...register('startDate'), className: "h-10 text-xs" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "endDate", className: "text-xs flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3.5 w-3.5 text-purple-500" }), "End Date"] }), _jsx(Input, { id: "endDate", type: "date", ...register('endDate'), className: "h-10 text-xs" })] })] }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "startLocation", className: "text-xs flex items-center gap-1", children: [_jsx(MapPin, { className: "h-3.5 w-3.5 text-blue-500" }), "Origin / Start City"] }), _jsx(Input, { id: "startLocation", placeholder: "e.g. Manali", ...register('startLocation'), className: "h-10" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "destination", className: "text-xs flex items-center gap-1", children: [_jsx(Navigation, { className: "h-3.5 w-3.5 text-emerald-500" }), "Primary Destination"] }), _jsx(Input, { id: "destination", placeholder: "e.g. Leh", ...register('destination'), className: "h-10" })] })] }), _jsxs(DialogFooter, { className: "pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), className: "rounded-xl", children: "Cancel" }), _jsxs(Button, { type: "submit", variant: "gradient", disabled: batchGenerateMutation.isPending, className: "rounded-xl font-semibold gap-1.5", children: [_jsx(Sparkles, { className: "h-4 w-4" }), batchGenerateMutation.isPending ? 'Generating...' : 'Generate Daily Itinerary'] })] })] })] }) }));
}
//# sourceMappingURL=BatchGenerateDialog.js.map