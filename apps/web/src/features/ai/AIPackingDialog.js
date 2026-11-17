import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Sparkles, Luggage, Check, RefreshCw, Plus, } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGeneratePacking, useApplyPacking } from './hooks';
import { toast } from 'sonner';
export function AIPackingDialog({ open, onOpenChange, trip }) {
    const generateMutation = useGeneratePacking();
    const applyMutation = useApplyPacking(trip?.id);
    const [climate, setClimate] = useState('Moderate / Coastal');
    const [includeRidingGear, setIncludeRidingGear] = useState(trip?.tripType === 'MOTORCYCLE' || trip?.transportModes?.includes('MOTORCYCLE'));
    const [suggestedItems, setSuggestedItems] = useState([]);
    const [selectedNames, setSelectedNames] = useState([]);
    const handleGenerate = async () => {
        try {
            const days = trip?.startDate && trip?.endDate
                ? Math.max(1, Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86400000) + 1)
                : 3;
            const res = await generateMutation.mutateAsync({
                destination: trip?.destination || 'Destination',
                tripType: trip?.tripType || 'ROAD_TRIP',
                daysCount: days,
                climate,
                includeRidingGear,
                tripId: trip?.id,
            });
            setSuggestedItems(res.items);
            setSelectedNames(res.items.map((i) => i.name)); // Select all by default
            toast.success(`Generated ${res.items.length} gear & clothing recommendations!`);
        }
        catch {
            // Handled
        }
    };
    const toggleSelect = (name) => {
        if (selectedNames.includes(name)) {
            setSelectedNames(selectedNames.filter((n) => n !== name));
        }
        else {
            setSelectedNames([...selectedNames, name]);
        }
    };
    const handleApply = async () => {
        const itemsToApply = suggestedItems.filter((i) => selectedNames.includes(i.name));
        if (itemsToApply.length === 0) {
            toast.error('Please select at least one item to add');
            return;
        }
        try {
            await applyMutation.mutateAsync({
                tripId: trip.id,
                items: itemsToApply,
            });
            onOpenChange(false);
        }
        catch {
            // Handled
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-w-2xl max-h-[85vh] flex flex-col p-6 rounded-3xl", children: [_jsxs(DialogHeader, { className: "shrink-0 space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider", children: [_jsx(Sparkles, { className: "h-4 w-4" }), _jsx("span", { children: "AI Packing Assistant" })] }), _jsxs(DialogTitle, { className: "text-xl font-bold", children: ["Smart Gear Suggestions for ", trip?.destination || 'Your Trip'] }), _jsx(DialogDescription, { className: "text-xs text-muted-foreground", children: "Our travel AI analyzes your climate, duration, and riding transport to propose an optimal packing list." })] }), _jsx("div", { className: "p-4 rounded-2xl bg-muted/40 border border-border/60 shrink-0 space-y-3", children: _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 text-xs", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-semibold text-muted-foreground", children: "Climate:" }), _jsxs("select", { value: climate, onChange: (e) => setClimate(e.target.value), className: "bg-card border border-border/80 rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none", children: [_jsx("option", { value: "Moderate / Pleasant", children: "Moderate / Pleasant" }), _jsx("option", { value: "Cold / Sub-zero Mountain Passes", children: "Cold / High Mountain Passes" }), _jsx("option", { value: "Hot / Sunny Desert", children: "Hot / Desert" }), _jsx("option", { value: "Monsoon / Rainy", children: "Monsoon / Rainy" }), _jsx("option", { value: "Tropical Beach", children: "Tropical Beach" })] })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer font-medium text-xs", children: [_jsx("input", { type: "checkbox", checked: includeRidingGear, onChange: (e) => setIncludeRidingGear(e.target.checked), className: "rounded accent-primary h-4 w-4" }), _jsx("span", { children: "Include Motorcycle Armor & Spares" })] }), _jsxs(Button, { size: "sm", onClick: handleGenerate, disabled: generateMutation.isPending, className: "rounded-xl font-bold gap-1.5 text-xs bg-primary text-white hover:bg-primary/90", children: [generateMutation.isPending ? (_jsx(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" })) : (_jsx(Sparkles, { className: "h-3.5 w-3.5" })), _jsx("span", { children: suggestedItems.length > 0 ? 'Re-generate' : 'Generate Checklist' })] })] }) }), _jsx("div", { className: "flex-1 overflow-y-auto space-y-2 py-2 pr-1", children: suggestedItems.length === 0 ? (_jsxs("div", { className: "text-center py-12 space-y-2 text-muted-foreground", children: [_jsx(Luggage, { className: "h-10 w-10 mx-auto text-muted-foreground/50" }), _jsx("p", { className: "text-sm font-semibold", children: "No suggestions generated yet" }), _jsx("p", { className: "text-xs", children: "Tap \"Generate Checklist\" above to synthesize items." })] })) : (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground px-1 pb-1", children: [_jsxs("span", { children: [selectedNames.length, " of ", suggestedItems.length, " items selected"] }), _jsx("button", { type: "button", onClick: () => setSelectedNames(selectedNames.length === suggestedItems.length
                                            ? []
                                            : suggestedItems.map((i) => i.name)), className: "font-semibold text-primary hover:underline", children: selectedNames.length === suggestedItems.length ? 'Deselect All' : 'Select All' })] }), suggestedItems.map((item, idx) => {
                                const isSelected = selectedNames.includes(item.name);
                                return (_jsxs("div", { onClick: () => toggleSelect(item.name), className: `p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${isSelected
                                        ? 'border-primary/50 bg-primary/5 text-foreground'
                                        : 'border-border/60 bg-card/60 opacity-60 text-muted-foreground'}`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `h-5 w-5 rounded-lg border flex items-center justify-center shrink-0 ${isSelected
                                                        ? 'bg-primary border-primary text-white'
                                                        : 'border-muted-foreground/40'}`, children: isSelected && _jsx(Check, { className: "h-3.5 w-3.5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold leading-snug", children: item.name }), _jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [_jsxs("span", { className: "text-[10px] text-muted-foreground font-medium", children: ["Qty: ", item.quantity] }), item.notes && (_jsxs("span", { className: "text-[10px] text-muted-foreground italic", children: ["\u2022 ", item.notes] }))] })] })] }), _jsx(Badge, { variant: "outline", className: "text-[10px] uppercase font-semibold", children: item.category.replace(/_/g, ' ') })] }, idx));
                            })] })) }), _jsxs(DialogFooter, { className: "shrink-0 pt-4 border-t border-border/60 flex items-center justify-between", children: [_jsx(Button, { type: "button", variant: "ghost", onClick: () => onOpenChange(false), className: "rounded-xl text-xs", children: "Cancel" }), _jsxs(Button, { type: "button", onClick: handleApply, disabled: suggestedItems.length === 0 || applyMutation.isPending, className: "rounded-xl font-bold text-xs gap-1.5 bg-primary text-white hover:bg-primary/90", children: [applyMutation.isPending ? (_jsx(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" })) : (_jsx(Plus, { className: "h-3.5 w-3.5" })), _jsxs("span", { children: ["Add ", selectedNames.length, " Items to Checklist"] })] })] })] }) }));
}
//# sourceMappingURL=AIPackingDialog.js.map