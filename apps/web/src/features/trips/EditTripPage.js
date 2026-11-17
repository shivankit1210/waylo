import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, MapPin, Coins, Bike, Car, Plane, Train, Bus, Check, } from 'lucide-react';
import { updateTripSchema, TripType, TransportMode, TripStatus, TripVisibility, SUPPORTED_CURRENCIES, } from '@waylo/shared';
import { useTrip, useUpdateTrip } from './hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';
const TRIP_TYPES = [
    { value: TripType.SOLO, label: 'Solo Explorer' },
    { value: TripType.GROUP, label: 'Friends Group' },
    { value: TripType.MOTORCYCLE, label: 'Motorcycle Tour' },
    { value: TripType.CAR_ROAD_TRIP, label: 'Car Road Trip' },
    { value: TripType.FAMILY, label: 'Family Vacation' },
    { value: TripType.WEEKEND, label: 'Weekend Getaway' },
];
const TRANSPORT_MODES = [
    { value: TransportMode.CAR, label: 'Car', icon: Car },
    { value: TransportMode.MOTORCYCLE, label: 'Motorcycle', icon: Bike },
    { value: TransportMode.FLIGHT, label: 'Flight', icon: Plane },
    { value: TransportMode.TRAIN, label: 'Train', icon: Train },
    { value: TransportMode.BUS, label: 'Bus', icon: Bus },
];
export function EditTripPage() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { data: trip, isLoading } = useTrip(tripId);
    const updateMutation = useUpdateTrip();
    const [tagInput, setTagInput] = useState('');
    const { register, handleSubmit, setValue, watch, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(updateTripSchema),
    });
    const selectedType = watch('tripType');
    const selectedModes = watch('transportModes') || [];
    const tags = watch('tags') || [];
    useEffect(() => {
        if (trip) {
            reset({
                name: trip.name,
                description: trip.description ?? '',
                tripType: trip.tripType,
                transportModes: trip.transportModes,
                startDate: trip.startDate ? trip.startDate.split('T')[0] : '',
                endDate: trip.endDate ? trip.endDate.split('T')[0] : '',
                startLocation: trip.startLocation ?? '',
                destination: trip.destination ?? '',
                returnLocation: trip.returnLocation ?? '',
                currency: trip.currency,
                estimatedBudget: trip.estimatedBudget ?? undefined,
                visibility: trip.visibility,
                tags: trip.tags ?? [],
                coverImageUrl: trip.coverImageUrl ?? '',
                status: trip.status,
            });
        }
    }, [trip, reset]);
    const toggleTransportMode = (mode) => {
        const current = [...selectedModes];
        const idx = current.indexOf(mode);
        if (idx !== -1) {
            if (current.length > 1) {
                current.splice(idx, 1);
            }
            else {
                toast.error('Select at least one transport mode');
                return;
            }
        }
        else {
            current.push(mode);
        }
        setValue('transportModes', current);
    };
    const handleAddTag = () => {
        if (!tagInput.trim())
            return;
        const clean = tagInput.trim().replace(/^#/, '');
        if (!tags.includes(clean)) {
            setValue('tags', [...tags, clean]);
        }
        setTagInput('');
    };
    const handleRemoveTag = (tagToRemove) => {
        setValue('tags', tags.filter((t) => t !== tagToRemove));
    };
    const onSubmit = async (data) => {
        if (!tripId)
            return;
        try {
            await updateMutation.mutateAsync({ tripId, data });
            navigate(`/trips/${tripId}`);
        }
        catch {
            // Toast handled by mutation
        }
    };
    if (isLoading) {
        return _jsx(LoadingSpinner, { text: "Loading trip details..." });
    }
    if (!trip) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-muted-foreground", children: "Trip not found." }), _jsx(Button, { variant: "outline", onClick: () => navigate('/trips'), className: "mt-4", children: "Back to My Trips" })] }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-8 animate-in fade-in-50 duration-300 pb-12", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate(`/trips/${tripId}`), className: "rounded-full", children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsxs("h1", { className: "text-2xl sm:text-3xl font-extrabold text-foreground", children: ["Edit \"", trip.name, "\""] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Update your journey parameters and status" })] })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8", children: [_jsxs(Card, { className: "rounded-3xl border-border/80 shadow-sm p-6 sm:p-8 space-y-6", children: [_jsx("h3", { className: "text-lg font-bold text-foreground border-b border-border/60 pb-3", children: "Trip Basics" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "name", children: "Trip Name *" }), _jsx(Input, { id: "name", ...register('name'), className: errors.name ? 'border-destructive' : '' }), errors.name && (_jsx("p", { className: "text-xs text-destructive font-medium", children: errors.name.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Trip Overview & Vision" }), _jsx(Textarea, { id: "description", rows: 3, ...register('description') })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "status", children: "Trip Lifecycle Status" }), _jsxs("select", { id: "status", ...register('status'), className: "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: TripStatus.DRAFT, children: "Draft (Planning phase)" }), _jsx("option", { value: TripStatus.PLANNED, children: "Planned (Ready to go)" }), _jsx("option", { value: TripStatus.ONGOING, children: "Ongoing (Currently happening)" }), _jsx("option", { value: TripStatus.COMPLETED, children: "Completed" }), _jsx("option", { value: TripStatus.CANCELLED, children: "Cancelled" }), _jsx("option", { value: TripStatus.ARCHIVED, children: "Archived" })] })] })] }), _jsxs("div", { className: "space-y-3 pt-2", children: [_jsx(Label, { children: "Trip Type" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: TRIP_TYPES.map((type) => {
                                            const isSelected = selectedType === type.value;
                                            return (_jsx("button", { type: "button", onClick: () => setValue('tripType', type.value), className: `flex flex-col text-left p-3.5 rounded-2xl border transition-all ${isSelected
                                                    ? 'border-primary bg-primary/10 shadow-sm'
                                                    : 'border-border bg-card hover:bg-muted/60'}`, children: _jsxs("div", { className: "flex items-center justify-between w-full", children: [_jsx("span", { className: "font-semibold text-xs sm:text-sm text-foreground", children: type.label }), isSelected && _jsx(Check, { className: "h-4 w-4 text-primary" })] }) }, type.value));
                                        }) })] }), _jsxs("div", { className: "space-y-3 pt-2", children: [_jsx(Label, { children: "Transport Modes" }), _jsx("div", { className: "flex flex-wrap gap-2.5", children: TRANSPORT_MODES.map((mode) => {
                                            const Icon = mode.icon;
                                            const isSelected = selectedModes.includes(mode.value);
                                            return (_jsxs("button", { type: "button", onClick: () => toggleTransportMode(mode.value), className: `flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${isSelected
                                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                    : 'border-border bg-background hover:bg-muted text-foreground'}`, children: [_jsx(Icon, { className: "h-4 w-4" }), _jsx("span", { children: mode.label })] }, mode.value));
                                        }) })] })] }), _jsxs(Card, { className: "rounded-3xl border-border/80 shadow-sm p-6 sm:p-8 space-y-6", children: [_jsxs("h3", { className: "text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3", children: [_jsx(MapPin, { className: "h-5 w-5 text-primary" }), _jsx("span", { children: "Locations & Dates" })] }), _jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "startLocation", children: "Starting Point" }), _jsx(Input, { id: "startLocation", ...register('startLocation') })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "destination", children: "Primary Destination" }), _jsx(Input, { id: "destination", ...register('destination') })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "returnLocation", children: "Return / End Location" }), _jsx(Input, { id: "returnLocation", ...register('returnLocation') })] })] }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-4 pt-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "startDate", children: "Start Date" }), _jsx(Input, { id: "startDate", type: "date", ...register('startDate') })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "endDate", children: "End Date" }), _jsx(Input, { id: "endDate", type: "date", ...register('endDate') })] })] })] }), _jsxs(Card, { className: "rounded-3xl border-border/80 shadow-sm p-6 sm:p-8 space-y-6", children: [_jsxs("h3", { className: "text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3", children: [_jsx(Coins, { className: "h-5 w-5 text-secondary" }), _jsx("span", { children: "Budget & Preferences" })] }), _jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "currency", children: "Currency" }), _jsx("select", { id: "currency", ...register('currency'), className: "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary", children: SUPPORTED_CURRENCIES.map((c) => (_jsx("option", { value: c, children: c }, c))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "estimatedBudget", children: "Estimated Budget" }), _jsx(Input, { id: "estimatedBudget", type: "number", ...register('estimatedBudget', { valueAsNumber: true }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "visibility", children: "Visibility" }), _jsxs("select", { id: "visibility", ...register('visibility'), className: "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: TripVisibility.PRIVATE, children: "Private (Invite Only)" }), _jsx("option", { value: TripVisibility.MEMBERS_ONLY, children: "Members Only" }), _jsx("option", { value: TripVisibility.INVITE_LINK, children: "Anyone with Invite Link" })] })] })] }), _jsxs("div", { className: "space-y-2 pt-2", children: [_jsx(Label, { htmlFor: "coverImageUrl", children: "Cover Photo URL" }), _jsx(Input, { id: "coverImageUrl", ...register('coverImageUrl') })] }), _jsxs("div", { className: "space-y-2 pt-2", children: [_jsx(Label, { children: "Tags" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { value: tagInput, onChange: (e) => setTagInput(e.target.value), placeholder: "Add tag", onKeyDown: (e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddTag();
                                                    }
                                                } }), _jsx(Button, { type: "button", variant: "outline", onClick: handleAddTag, children: "Add Tag" })] }), tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 pt-2", children: tags.map((tag) => (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold", children: ["#", tag, _jsx("button", { type: "button", onClick: () => handleRemoveTag(tag), className: "hover:text-destructive", children: "\u00D7" })] }, tag))) }))] })] }), _jsxs("div", { className: "flex items-center justify-end gap-4 pt-4", children: [_jsx(Button, { type: "button", variant: "ghost", onClick: () => navigate(`/trips/${tripId}`), disabled: updateMutation.isPending, children: "Cancel" }), _jsx(Button, { type: "submit", disabled: updateMutation.isPending, className: "px-8 h-12 text-base font-semibold shadow-lg rounded-xl gap-2", children: updateMutation.isPending ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-5 w-5 animate-spin" }), "Saving..."] })) : (_jsxs(_Fragment, { children: [_jsx(Save, { className: "h-5 w-5" }), "Save Changes"] })) })] })] })] }));
}
//# sourceMappingURL=EditTripPage.js.map