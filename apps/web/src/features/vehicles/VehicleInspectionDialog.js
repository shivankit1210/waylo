import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { InspectionStatus } from '@waylo/shared';
import { useAddInspection } from './hooks';
const CHECKLIST_ITEMS = [
    { key: 'tyreTreadPressure', label: 'Tyre Pressure & Tread Condition' },
    { key: 'brakes', label: 'Brakes & Brake Fluid Level' },
    { key: 'chainLubeTension', label: 'Drive Chain / Belt Lube & Tension' },
    { key: 'engineOilLevel', label: 'Engine Oil & Coolant Levels' },
    { key: 'headlightsHornIndicators', label: 'Headlights, Indicators & Horn' },
    { key: 'cablesClutchThrottle', label: 'Clutch & Throttle Free Play' },
    { key: 'luggageMountsBungees', label: 'Luggage Racks & Straps Security' },
];
export function VehicleInspectionDialog({ open, onOpenChange, trip, vehicle, }) {
    const addInspectionMutation = useAddInspection(trip.id);
    const [status, setStatus] = useState(InspectionStatus.PASSED);
    const [odometer, setOdometer] = useState(vehicle.currentOdometer ? String(vehicle.currentOdometer) : '');
    const [checklist, setChecklist] = useState({
        tyreTreadPressure: true,
        brakes: true,
        chainLubeTension: true,
        engineOilLevel: true,
        headlightsHornIndicators: true,
        cablesClutchThrottle: true,
        luggageMountsBungees: true,
    });
    const [notes, setNotes] = useState('');
    const toggleChecklistItem = (key) => {
        setChecklist((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        await addInspectionMutation.mutateAsync({
            vehicleId: vehicle.id,
            data: {
                vehicleId: vehicle.id,
                status,
                checklist,
                odometer: odometer ? parseFloat(odometer) : null,
                notes: notes.trim() || null,
            },
        });
        setNotes('');
        onOpenChange(false);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-md max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "text-xl font-bold", children: "Vehicle Safety Inspection" }), _jsxs(DialogDescription, { className: "text-xs text-muted-foreground", children: ["Complete pre-trip mechanical and safety checklist for ", vehicle.name, "."] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-2", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { className: "text-xs font-semibold", children: "Inspection Result" }), _jsxs(Select, { value: status, onValueChange: (v) => setStatus(v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: InspectionStatus.PASSED, children: "\uD83D\uDFE2 Passed (Road-Ready)" }), _jsx(SelectItem, { value: InspectionStatus.ATTENTION_NEEDED, children: "\uD83D\uDFE1 Needs Attention" }), _jsx(SelectItem, { value: InspectionStatus.FAILED, children: "\uD83D\uDD34 Critical Failure" })] })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "insp-odo", className: "text-xs font-semibold", children: "Odometer (km)" }), _jsx(Input, { id: "insp-odo", type: "number", placeholder: "e.g. 4200", value: odometer, onChange: (e) => setOdometer(e.target.value) })] })] }), _jsxs("div", { className: "space-y-2 pt-2 border-t border-border/60", children: [_jsx(Label, { className: "text-xs font-semibold", children: "Pre-Trip Checklist Items" }), _jsx("div", { className: "space-y-2", children: CHECKLIST_ITEMS.map((item) => {
                                        const checked = Boolean(checklist[item.key]);
                                        return (_jsxs("button", { type: "button", onClick: () => toggleChecklistItem(item.key), className: `w-full p-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${checked
                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                                                : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted'}`, children: [_jsx("span", { children: item.label }), _jsx("span", { className: "font-bold text-sm", children: checked ? '✓ Checked' : '○ Pending' })] }, item.key));
                                    }) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "insp-notes", className: "text-xs font-semibold", children: "Inspection Notes / Service Remarks" }), _jsx(Textarea, { id: "insp-notes", placeholder: "e.g. Front tyre 32 PSI, chain lubed with Motul, brake pads 80% remaining.", rows: 2, value: notes, onChange: (e) => setNotes(e.target.value) })] }), _jsxs(DialogFooter, { className: "pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), className: "rounded-xl", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: addInspectionMutation.isPending, className: "rounded-xl font-bold", children: addInspectionMutation.isPending ? 'Saving...' : 'Submit Inspection' })] })] })] }) }));
}
//# sourceMappingURL=VehicleInspectionDialog.js.map