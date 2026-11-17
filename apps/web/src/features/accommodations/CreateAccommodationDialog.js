import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { BookingType, BookingStatus, } from '@waylo/shared';
import { useCreateAccommodation } from './hooks';
export const BOOKING_TYPE_LABELS = {
    [BookingType.HOTEL]: '🏨 Hotel',
    [BookingType.HOMESTAY]: '🏡 Homestay / Villa',
    [BookingType.HOSTEL]: '🎒 Backpacker Hostel',
    [BookingType.CAMPSITE]: '⛺ Campsite / Glamping',
    [BookingType.GUESTHOUSE]: '🏠 Guest House',
    [BookingType.OTHER]: '✨ Other Stay',
};
export function CreateAccommodationDialog({ open, onOpenChange, trip, }) {
    const createMutation = useCreateAccommodation(trip.id);
    const [name, setName] = useState('');
    const [type, setType] = useState(BookingType.HOMESTAY);
    const [location, setLocation] = useState(trip.destination || '');
    const [checkInDate, setCheckInDate] = useState(trip.startDate ? trip.startDate.split('T')[0] : '');
    const [checkOutDate, setCheckOutDate] = useState(trip.endDate ? trip.endDate.split('T')[0] : '');
    const [checkInTime, setCheckInTime] = useState('14:00');
    const [checkOutTime, setCheckOutTime] = useState('11:00');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [displayCost, setDisplayCost] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [notes, setNotes] = useState('');
    const [bookingStatus, setBookingStatus] = useState(BookingStatus.CONFIRMED);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !checkInDate || !checkOutDate)
            return;
        const totalCostCents = displayCost ? Math.round(parseFloat(displayCost) * 100) : null;
        await createMutation.mutateAsync({
            name: name.trim(),
            type,
            location: location.trim() || null,
            checkInDate,
            checkOutDate,
            checkInTime: checkInTime.trim() || null,
            checkOutTime: checkOutTime.trim() || null,
            confirmationCode: confirmationCode.trim().toUpperCase() || null,
            totalCost: totalCostCents,
            currency: (trip.currency || 'INR'),
            contactPhone: contactPhone.trim() || null,
            contactEmail: contactEmail.trim() || null,
            notes: notes.trim() || null,
            bookingStatus,
        });
        setName('');
        setConfirmationCode('');
        setDisplayCost('');
        setContactPhone('');
        setContactEmail('');
        setNotes('');
        onOpenChange(false);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-lg max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "text-xl font-bold", children: "Add Stay & Accommodation" }), _jsx(DialogDescription, { className: "text-xs text-muted-foreground", children: "Save hotel, villa, or campsite booking details, confirmation vouchers, and check-in times." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-2", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "acc-name", className: "text-xs font-semibold", children: "Stay Name *" }), _jsx(Input, { id: "acc-name", placeholder: "e.g. Morjim Beach Villa, Zostel Vagator", value: name, onChange: (e) => setName(e.target.value), required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { className: "text-xs font-semibold", children: "Accommodation Type" }), _jsxs(Select, { value: type, onValueChange: (v) => setType(v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: BookingType.HOMESTAY, children: "\uD83C\uDFE1 Homestay / Villa" }), _jsx(SelectItem, { value: BookingType.HOTEL, children: "\uD83C\uDFE8 Hotel" }), _jsx(SelectItem, { value: BookingType.HOSTEL, children: "\uD83C\uDF92 Hostel" }), _jsx(SelectItem, { value: BookingType.CAMPSITE, children: "\u26FA Campsite" }), _jsx(SelectItem, { value: BookingType.GUESTHOUSE, children: "\uD83C\uDFE0 Guest House" }), _jsx(SelectItem, { value: BookingType.OTHER, children: "\u2728 Other" })] })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { className: "text-xs font-semibold", children: "Booking Status" }), _jsxs(Select, { value: bookingStatus, onValueChange: (v) => setBookingStatus(v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: BookingStatus.CONFIRMED, children: "\uD83D\uDFE2 Confirmed" }), _jsx(SelectItem, { value: BookingStatus.TENTATIVE, children: "\uD83D\uDFE1 Tentative / Holding" }), _jsx(SelectItem, { value: BookingStatus.CANCELLED, children: "\uD83D\uDD34 Cancelled" })] })] })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "acc-loc", className: "text-xs font-semibold", children: "Location / Address" }), _jsx(Input, { id: "acc-loc", placeholder: "e.g. Morjim Beach Road, North Goa", value: location, onChange: (e) => setLocation(e.target.value) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "acc-checkin", className: "text-xs font-semibold", children: "Check-in Date *" }), _jsx(Input, { id: "acc-checkin", type: "date", value: checkInDate, onChange: (e) => setCheckInDate(e.target.value), required: true })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "acc-checkout", className: "text-xs font-semibold", children: "Check-out Date *" }), _jsx(Input, { id: "acc-checkout", type: "date", value: checkOutDate, onChange: (e) => setCheckOutDate(e.target.value), required: true })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "acc-intime", className: "text-xs font-semibold", children: "Check-in Time" }), _jsx(Input, { id: "acc-intime", placeholder: "14:00", value: checkInTime, onChange: (e) => setCheckInTime(e.target.value) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "acc-outtime", className: "text-xs font-semibold", children: "Check-out Time" }), _jsx(Input, { id: "acc-outtime", placeholder: "11:00", value: checkOutTime, onChange: (e) => setCheckOutTime(e.target.value) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "acc-code", className: "text-xs font-semibold", children: "Confirmation / Booking Ref #" }), _jsx(Input, { id: "acc-code", placeholder: "e.g. BKG-883921", value: confirmationCode, onChange: (e) => setConfirmationCode(e.target.value) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs(Label, { htmlFor: "acc-cost", className: "text-xs font-semibold", children: ["Total Cost (", trip.currency || 'INR', ")"] }), _jsx(Input, { id: "acc-cost", type: "number", step: "0.01", placeholder: "e.g. 8500", value: displayCost, onChange: (e) => setDisplayCost(e.target.value) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "acc-phone", className: "text-xs font-semibold", children: "Contact Phone / WhatsApp" }), _jsx(Input, { id: "acc-phone", placeholder: "+91 98221 44556", value: contactPhone, onChange: (e) => setContactPhone(e.target.value) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "acc-email", className: "text-xs font-semibold", children: "Contact Email" }), _jsx(Input, { id: "acc-email", type: "email", placeholder: "stay@host.com", value: contactEmail, onChange: (e) => setContactEmail(e.target.value) })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "acc-notes", className: "text-xs font-semibold", children: "Notes / Amenities" }), _jsx(Textarea, { id: "acc-notes", placeholder: "e.g. Gated parking, WiFi password, pool access, breakfast included.", rows: 2, value: notes, onChange: (e) => setNotes(e.target.value) })] }), _jsxs(DialogFooter, { className: "pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), className: "rounded-xl", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: createMutation.isPending || !name.trim(), className: "rounded-xl font-bold", children: createMutation.isPending ? 'Saving...' : 'Save Stay' })] })] })] }) }));
}
//# sourceMappingURL=CreateAccommodationDialog.js.map