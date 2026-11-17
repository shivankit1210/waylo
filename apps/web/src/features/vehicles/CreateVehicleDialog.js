import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { VehicleType, FuelType } from '@waylo/shared';
import { useCreateVehicle } from './hooks';
export function CreateVehicleDialog({ open, onOpenChange, trip, }) {
    const createMutation = useCreateVehicle(trip.id);
    const [name, setName] = useState('');
    const [type, setType] = useState(VehicleType.MOTORCYCLE);
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [fuelType, setFuelType] = useState(FuelType.PETROL);
    const [tankCapacityLiters, setTankCapacityLiters] = useState('');
    const [odometer, setOdometer] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim())
            return;
        await createMutation.mutateAsync({
            name: name.trim(),
            type,
            make: make.trim() || null,
            model: model.trim() || null,
            registrationNumber: registrationNumber.trim().toUpperCase() || null,
            fuelType,
            tankCapacityLiters: tankCapacityLiters ? parseFloat(tankCapacityLiters) : null,
            initialOdometer: odometer ? parseFloat(odometer) : null,
            currentOdometer: odometer ? parseFloat(odometer) : null,
            tripId: trip.id,
        });
        setName('');
        setMake('');
        setModel('');
        setRegistrationNumber('');
        setTankCapacityLiters('');
        setOdometer('');
        onOpenChange(false);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-md max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "text-xl font-bold", children: "Register Vehicle" }), _jsx(DialogDescription, { className: "text-xs text-muted-foreground", children: "Add a motorcycle, car, or campervan to track fuel efficiency and pre-trip checklists." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-2", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "v-name", className: "text-xs font-semibold", children: "Vehicle Nickname *" }), _jsx(Input, { id: "v-name", placeholder: "e.g. Royal Enfield Himalayan 450, Road King", value: name, onChange: (e) => setName(e.target.value), required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { className: "text-xs font-semibold", children: "Vehicle Type" }), _jsxs(Select, { value: type, onValueChange: (v) => setType(v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: VehicleType.MOTORCYCLE, children: "\uD83C\uDFCD\uFE0F Motorcycle" }), _jsx(SelectItem, { value: VehicleType.CAR, children: "\uD83D\uDE97 Car" }), _jsx(SelectItem, { value: VehicleType.SUV, children: "\uD83D\uDE99 SUV" }), _jsx(SelectItem, { value: VehicleType.VAN, children: "\uD83D\uDE90 Van / Camper" }), _jsx(SelectItem, { value: VehicleType.BICYCLE, children: "\uD83D\uDEB2 Bicycle" }), _jsx(SelectItem, { value: VehicleType.RENTAL, children: "\uD83D\uDE95 Rental" }), _jsx(SelectItem, { value: VehicleType.OTHER, children: "\u26A1 Other" })] })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { className: "text-xs font-semibold", children: "Fuel Type" }), _jsxs(Select, { value: fuelType, onValueChange: (v) => setFuelType(v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: FuelType.PETROL, children: "\u26FD Petrol" }), _jsx(SelectItem, { value: FuelType.DIESEL, children: "\uD83D\uDEE2\uFE0F Diesel" }), _jsx(SelectItem, { value: FuelType.ELECTRIC, children: "\u26A1 Electric (EV)" }), _jsx(SelectItem, { value: FuelType.HYBRID, children: "\uD83C\uDF3F Hybrid" }), _jsx(SelectItem, { value: FuelType.CNG, children: "\uD83D\uDCA8 CNG" }), _jsx(SelectItem, { value: FuelType.OTHER, children: "\u2728 Other / None" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "v-make", className: "text-xs font-semibold", children: "Make / Manufacturer" }), _jsx(Input, { id: "v-make", placeholder: "e.g. Royal Enfield, Toyota", value: make, onChange: (e) => setMake(e.target.value) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "v-model", className: "text-xs font-semibold", children: "Model" }), _jsx(Input, { id: "v-model", placeholder: "e.g. Himalayan, Fortuner", value: model, onChange: (e) => setModel(e.target.value) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "v-reg", className: "text-xs font-semibold", children: "Registration Plate #" }), _jsx(Input, { id: "v-reg", placeholder: "e.g. MH 02 EE 7788", value: registrationNumber, onChange: (e) => setRegistrationNumber(e.target.value) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "v-tank", className: "text-xs font-semibold", children: "Tank Capacity (Liters)" }), _jsx(Input, { id: "v-tank", type: "number", step: "0.1", placeholder: "e.g. 17", value: tankCapacityLiters, onChange: (e) => setTankCapacityLiters(e.target.value) })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "v-odo", className: "text-xs font-semibold", children: "Current Odometer Reading (km)" }), _jsx(Input, { id: "v-odo", type: "number", step: "1", placeholder: "e.g. 4200", value: odometer, onChange: (e) => setOdometer(e.target.value) })] }), _jsxs(DialogFooter, { className: "pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), className: "rounded-xl", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: createMutation.isPending || !name.trim(), className: "rounded-xl font-bold", children: createMutation.isPending ? 'Registering...' : 'Register Vehicle' })] })] })] }) }));
}
//# sourceMappingURL=CreateVehicleDialog.js.map