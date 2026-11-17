import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useApplyPackingTemplate } from '../hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Sparkles, Bike, Car, Tent, Waves, Briefcase } from 'lucide-react';
const TEMPLATES = [
    {
        key: 'MOTORCYCLE_EXPEDITION',
        name: 'Motorcycle Touring Expedition',
        description: 'ECE full-face helmets, armored layers, rain suits, tyre puncture kits, chain lube & tools.',
        icon: Bike,
        color: 'from-blue-600 to-indigo-600',
        itemCount: '17 essential items',
    },
    {
        key: 'ROAD_TRIP',
        name: 'Road Trip Essentials',
        description: 'Vehicle paperwork, fast-chargers, dashboard mounts, emergency cash, travel pillows & snacks.',
        icon: Car,
        color: 'from-emerald-600 to-teal-600',
        itemCount: '11 items',
    },
    {
        key: 'HIKING_CAMPING',
        name: 'High-Altitude Trek & Camping',
        description: 'Sub-zero sleeping bags, dome tent, hiking boots, trekking poles, camp stove & filtration.',
        icon: Tent,
        color: 'from-amber-600 to-orange-600',
        itemCount: '10 items',
    },
    {
        key: 'BEACH_HOLIDAY',
        name: 'Beach & Coastal Holiday',
        description: 'Broad spectrum SPF 50+, swimwear, beach towels, linen shirts, dry-bags & water shoes.',
        icon: Waves,
        color: 'from-cyan-600 to-blue-600',
        itemCount: '8 items',
    },
    {
        key: 'WEEKEND_GETAWAY',
        name: 'Weekend Getaway Capsule',
        description: 'Lightweight 48-hour duffel with clean essentials, chargers, casual layers & toiletries.',
        icon: Briefcase,
        color: 'from-purple-600 to-pink-600',
        itemCount: '7 items',
    },
];
export function TemplatePickerModal({ tripId, open, onOpenChange, onSuccess, }) {
    const applyTemplateMutation = useApplyPackingTemplate(tripId);
    const handleApply = async (templateKey) => {
        try {
            await applyTemplateMutation.mutateAsync({ templateKey });
            toast.success('Packing template added to your trip!');
            onOpenChange(false);
            onSuccess?.();
        }
        catch {
            toast.error('Failed to apply packing template');
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-w-md sm:max-w-xl rounded-3xl p-6 max-h-[85vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center", children: _jsx(Sparkles, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx(DialogTitle, { className: "text-xl font-bold", children: "Reusable Packing Templates" }), _jsx(DialogDescription, { className: "text-xs", children: "Select a curated packing checklist tailored for your travel style" })] })] }) }), _jsx("div", { className: "grid gap-3 pt-2", children: TEMPLATES.map((tmpl) => {
                        const Icon = tmpl.icon;
                        return (_jsxs(Card, { className: "p-4 rounded-2xl border-border/80 hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `h-11 w-11 rounded-2xl bg-gradient-to-tr ${tmpl.color} text-white flex items-center justify-center shrink-0 shadow-sm`, children: _jsx(Icon, { className: "h-5 w-5" }) }), _jsxs("div", { className: "space-y-0.5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-bold text-sm text-foreground", children: tmpl.name }), _jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold", children: tmpl.itemCount })] }), _jsx("p", { className: "text-xs text-muted-foreground leading-relaxed line-clamp-2", children: tmpl.description })] })] }), _jsx(Button, { size: "sm", variant: "gradient", disabled: applyTemplateMutation.isPending, onClick: () => handleApply(tmpl.key), className: "rounded-xl text-xs font-semibold shrink-0 self-end sm:self-center", children: "Use Template" })] }, tmpl.key));
                    }) })] }) }));
}
//# sourceMappingURL=TemplatePickerModal.js.map