import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAddFuelLog } from './hooks';
export function AddFuelLogDialog({ open, onOpenChange, trip, vehicle, }) {
    const addLogMutation = useAddFuelLog(trip.id);
    const [odometer, setOdometer] = useState(vehicle.currentOdometer ? String(vehicle.currentOdometer) : '');
    const [litersOrKwh, setLitersOrKwh] = useState('');
    const [displayCost, setDisplayCost] = useState('');
    const [isFullTank, setIsFullTank] = useState(true);
    const [stationLocation, setStationLocation] = useState('');
    const [notes, setNotes] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const odoNum = parseFloat(odometer);
        const volNum = parseFloat(litersOrKwh);
        const costNum = parseFloat(displayCost);
        if (isNaN(odoNum) || isNaN(volNum) || isNaN(costNum) || volNum <= 0 || costNum <= 0) {
            return;
        }
        const costInCents = Math.round(costNum * 100);
        const pricePerUnit = Number((costNum / volNum).toFixed(2));
        await addLogMutation.mutateAsync({
            vehicleId: vehicle.id,
            data: {
                vehicleId: vehicle.id,
                odometer: odoNum,
                litersOrKwh: volNum,
                cost: costInCents,
                currency: (trip.currency || 'INR'),
                isFullTank,
                fuelPricePerUnit: pricePerUnit,
                stationLocation: stationLocation.trim() || null,
                notes: notes.trim() || null,
            },
        });
        setLitersOrKwh('');
        setDisplayCost('');
        setStationLocation('');
        setNotes('');
        onOpenChange(false);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-md max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "text-xl font-bold", children: "Log Fuel Refill" }), _jsxs(DialogDescription, { className: "text-xs text-muted-foreground", children: ["Record fuel volume and odometer for ", vehicle.name, " to track mileage and fuel efficiency."] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-2", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "fuel-odo", className: "text-xs font-semibold", children: "Current Odometer (km) *" }), _jsx(Input, { id: "fuel-odo", type: "number", step: "0.1", placeholder: "e.g. 4620", value: odometer, onChange: (e) => setOdometer(e.target.value), required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "fuel-vol", className: "text-xs font-semibold", children: "Volume (Liters / kWh) *" }), _jsx(Input, { id: "fuel-vol", type: "number", step: "0.01", min: "0.01", placeholder: "e.g. 14.5", value: litersOrKwh, onChange: (e) => setLitersOrKwh(e.target.value), required: true })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "fuel-cost", className: "text-xs font-semibold", children: ["Total Cost (", trip.currency || 'INR', ") *"] }), _jsx(Input, { id: "fuel-cost", type: "number", step: "0.01", min: "0.01", placeholder: "e.g. 1530", value: displayCost, onChange: (e) => setDisplayCost(e.target.value), required: true })] })] }), _jsxs("div", { className: "flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/80", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "fuel-full", className: "text-xs font-bold text-foreground cursor-pointer", children: "Full Tank Fill-up (Auto-Cutoff)" }), _jsx("p", { className: "text-[11px] text-muted-foreground", children: "Required to accurately compute km/L fuel efficiency." })] }), _jsx(Switch, { id: "fuel-full", checked: isFullTank, onCheckedChange: setIsFullTank })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "fuel-station", className: "text-xs font-semibold", children: "Gas Station / Highway Outlet" }), _jsx(Input, { id: "fuel-station", placeholder: "e.g. HPCL Express Highway, IOCL Chiplun", value: stationLocation, onChange: (e) => setStationLocation(e.target.value) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "fuel-notes", className: "text-xs font-semibold", children: "Notes (optional)" }), _jsx(Textarea, { id: "fuel-notes", placeholder: "e.g. Tyre pressure 32 PSI, windscreen cleaned.", rows: 2, value: notes, onChange: (e) => setNotes(e.target.value) })] }), _jsxs(DialogFooter, { className: "pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), className: "rounded-xl", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: addLogMutation.isPending || !odometer || !litersOrKwh || !displayCost, className: "rounded-xl font-bold", children: addLogMutation.isPending ? 'Logging...' : 'Save Fuel Log' })] })] })] }) }));
}
//# sourceMappingURL=AddFuelLogDialog.js.map