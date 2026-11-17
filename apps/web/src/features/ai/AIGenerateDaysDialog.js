import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Sparkles, Calendar, CheckCircle2, RefreshCw, } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGenerateItinerary, useApplyItinerary } from './hooks';
import { toast } from 'sonner';
export function AIGenerateDaysDialog({ open, onOpenChange, trip, }) {
    const generateMutation = useGenerateItinerary();
    const applyMutation = useApplyItinerary(trip?.id);
    const [daysCount, setDaysCount] = useState(trip?.startDate && trip?.endDate
        ? Math.max(1, Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
            86400000) + 1)
        : 3);
    const [travelPace, setTravelPace] = useState('MODERATE');
    const [preferences, setPreferences] = useState('');
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const handleGenerate = async () => {
        try {
            const plan = await generateMutation.mutateAsync({
                destination: trip?.destination || 'Destination',
                origin: trip?.startLocation || undefined,
                daysCount,
                tripType: trip?.tripType || 'MOTORCYCLE',
                travelPace,
                budget: 'MODERATE',
                preferences: preferences.trim() || undefined,
            });
            setGeneratedPlan(plan);
            toast.success('Generated AI itinerary preview!');
        }
        catch {
            // Handled
        }
    };
    const handleApply = async () => {
        if (!generatedPlan)
            return;
        try {
            await applyMutation.mutateAsync({
                tripId: trip.id,
                itinerary: generatedPlan,
            });
            onOpenChange(false);
        }
        catch {
            // Handled
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-w-3xl max-h-[85vh] flex flex-col p-6 rounded-3xl", children: [_jsxs(DialogHeader, { className: "shrink-0 space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider", children: [_jsx(Sparkles, { className: "h-4 w-4" }), _jsx("span", { children: "AI Itinerary Generator" })] }), _jsxs(DialogTitle, { className: "text-xl font-bold", children: ["Plan ", daysCount, "-Day Itinerary for ", trip?.destination || trip?.name] }), _jsx(DialogDescription, { className: "text-xs text-muted-foreground", children: "Crafts daily waypoints, scenic stops, meal breaks, and sunset vistas customized to your pace." })] }), _jsx("div", { className: "p-4 rounded-2xl bg-muted/40 border border-border/60 shrink-0 space-y-3", children: _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs", children: [_jsxs("div", { children: [_jsx("label", { className: "font-semibold text-muted-foreground block mb-1", children: "Number of Days:" }), _jsx(Input, { type: "number", min: 1, max: 14, value: daysCount, onChange: (e) => setDaysCount(Math.max(1, parseInt(e.target.value) || 1)), className: "rounded-xl h-8 text-xs font-bold" })] }), _jsxs("div", { children: [_jsx("label", { className: "font-semibold text-muted-foreground block mb-1", children: "Travel Pace:" }), _jsxs("select", { value: travelPace, onChange: (e) => setTravelPace(e.target.value), className: "w-full bg-card border border-border/80 rounded-xl px-2.5 h-8 text-xs font-semibold focus:outline-none", children: [_jsx("option", { value: "RELAXED", children: "Relaxed (Late starts & chill)" }), _jsx("option", { value: "MODERATE", children: "Moderate (Balanced)" }), _jsx("option", { value: "PACKED", children: "Packed (Early starts & max stops)" })] })] }), _jsx("div", { className: "flex items-end", children: _jsxs(Button, { size: "sm", onClick: handleGenerate, disabled: generateMutation.isPending, className: "w-full rounded-xl font-bold text-xs gap-1.5 h-8 bg-primary text-white hover:bg-primary/90", children: [generateMutation.isPending ? (_jsx(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" })) : (_jsx(Sparkles, { className: "h-3.5 w-3.5" })), _jsx("span", { children: generatedPlan ? 'Re-generate' : 'Generate Itinerary' })] }) })] }) }), _jsx("div", { className: "flex-1 overflow-y-auto space-y-4 py-2 pr-1", children: !generatedPlan ? (_jsxs("div", { className: "text-center py-12 space-y-2 text-muted-foreground", children: [_jsx(Calendar, { className: "h-10 w-10 mx-auto text-muted-foreground/50" }), _jsx("p", { className: "text-sm font-semibold", children: "No itinerary generated yet" }), _jsx("p", { className: "text-xs", children: "Adjust your pace above and tap \"Generate Itinerary\"." })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1", children: [_jsx("h4", { className: "font-bold text-sm text-foreground", children: generatedPlan.tripTitle }), _jsx("p", { className: "text-xs text-muted-foreground", children: generatedPlan.summary })] }), generatedPlan.days.map((day) => (_jsxs("div", { className: "space-y-2 p-3 rounded-2xl border border-border/70 bg-card", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-bold text-xs text-foreground", children: day.title }), _jsxs("span", { className: "text-[11px] text-muted-foreground", children: [day.stops.length, " stops"] })] }), _jsx("div", { className: "space-y-1.5 pl-2 border-l-2 border-primary/30 ml-2", children: day.stops.map((stop, sIdx) => (_jsxs("div", { className: "text-xs flex items-center justify-between gap-2 py-0.5", children: [_jsx("span", { className: "font-medium text-foreground", children: stop.title }), _jsx(Badge, { variant: "outline", className: "text-[10px] uppercase font-semibold shrink-0", children: stop.plannedStartTime || stop.itemType })] }, sIdx))) })] }, day.dayNumber)))] })) }), _jsxs(DialogFooter, { className: "shrink-0 pt-4 border-t border-border/60 flex items-center justify-between", children: [_jsx(Button, { type: "button", variant: "ghost", onClick: () => onOpenChange(false), className: "rounded-xl text-xs", children: "Cancel" }), _jsxs(Button, { type: "button", onClick: handleApply, disabled: !generatedPlan || applyMutation.isPending, className: "rounded-xl font-bold text-xs gap-1.5 bg-primary text-white hover:bg-primary/90", children: [applyMutation.isPending ? (_jsx(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" })) : (_jsx(CheckCircle2, { className: "h-3.5 w-3.5" })), _jsx("span", { children: "Apply Plan to Trip" })] })] })] }) }));
}
//# sourceMappingURL=AIGenerateDaysDialog.js.map