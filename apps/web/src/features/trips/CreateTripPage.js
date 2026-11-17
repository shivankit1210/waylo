import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, ArrowLeft, MapPin, Coins, Loader2, Bike, Car, Plane, Train, Bus, Check, } from 'lucide-react';
import { createTripSchema, TripType, TransportMode, TripVisibility, SUPPORTED_CURRENCIES, } from '@waylo/shared';
import { useCreateTrip } from './hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
const TRIP_TYPES = [
    { value: TripType.SOLO, label: 'Solo Explorer', desc: 'Indie solo travel' },
    { value: TripType.GROUP, label: 'Friends Group', desc: 'Crew road trips' },
    { value: TripType.MOTORCYCLE, label: 'Motorcycle Tour', desc: 'Rides & scenic passes' },
    { value: TripType.CAR_ROAD_TRIP, label: 'Car Road Trip', desc: 'Highway & long drives' },
    { value: TripType.FAMILY, label: 'Family Vacation', desc: 'Leisure & sightseeing' },
    { value: TripType.WEEKEND, label: 'Weekend Getaway', desc: '2-3 day quick trips' },
];
const TRANSPORT_MODES = [
    { value: TransportMode.CAR, label: 'Car', icon: Car },
    { value: TransportMode.MOTORCYCLE, label: 'Motorcycle', icon: Bike },
    { value: TransportMode.FLIGHT, label: 'Flight', icon: Plane },
    { value: TransportMode.TRAIN, label: 'Train', icon: Train },
    { value: TransportMode.BUS, label: 'Bus', icon: Bus },
];
export function CreateTripPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isAIMode = searchParams.get('mode') !== 'manual';
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const createTripMutation = useCreateTrip();
    const { register, handleSubmit, control, setValue, watch, formState: { errors }, } = useForm({
        resolver: zodResolver(createTripSchema),
        defaultValues: {
            name: '',
            description: '',
            tripType: TripType.CAR_ROAD_TRIP,
            transportModes: [TransportMode.CAR],
            startDate: null,
            endDate: null,
            startLocation: '',
            destination: '',
            returnLocation: '',
            currency: 'INR',
            estimatedBudget: 25000,
            visibility: TripVisibility.PRIVATE,
            tags: ['Adventure'],
            coverImageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
        },
    });
    const selectedType = watch('tripType');
    const selectedModes = watch('transportModes') || [];
    const tags = watch('tags') || [];
    // Toggle transport mode
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
        setValue('transportModes', current, { shouldValidate: true });
    };
    // Add tag
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
    // Simulated AI generator
    const handleGenerateAI = () => {
        if (!aiPrompt.trim()) {
            toast.error('Please enter a trip idea or destination');
            return;
        }
        setIsGeneratingAI(true);
        setTimeout(() => {
            setIsGeneratingAI(false);
            setValue('name', `Spiti Valley High Altitude Circuit`);
            setValue('destination', 'Kaza, Spiti Valley, Himachal Pradesh');
            setValue('startLocation', 'Shimla');
            setValue('returnLocation', 'Manali');
            setValue('tripType', TripType.MOTORCYCLE);
            setValue('transportModes', [TransportMode.MOTORCYCLE, TransportMode.CAR]);
            setValue('description', `A breathtaking high-altitude expedition passing through Kinnaur, Nako Lake, Tabo Monastery, Kaza, Key Gompa, and crossing Kunzum Pass into Chandratal.`);
            setValue('estimatedBudget', 35000);
            setValue('tags', ['Spiti', 'Himalayas', 'HighAltitude', 'Monasteries']);
            setValue('coverImageUrl', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80');
            const d1 = new Date();
            d1.setDate(d1.getDate() + 20);
            const d2 = new Date();
            d2.setDate(d2.getDate() + 29);
            setValue('startDate', d1.toISOString());
            setValue('endDate', d2.toISOString());
            toast.success('AI plan drafted! Review and customize the details below.');
        }, 1200);
    };
    const onSubmit = async (data) => {
        try {
            const created = await createTripMutation.mutateAsync(data);
            navigate(`/trips/${created.id}`);
        }
        catch {
            // Toast handled by hook
        }
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-8 animate-in fade-in-50 duration-300 pb-12", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate(-1), className: "rounded-full", children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-extrabold text-foreground", children: isAIMode ? 'Plan Trip with Waylo AI' : 'Create New Trip' }), _jsx("p", { className: "text-sm text-muted-foreground", children: isAIMode
                                    ? 'Tell our AI assistant your dream destination or vibe, and we will build the route.'
                                    : 'Fill in the trip parameters to initialize your itinerary and group board.' })] })] }), isAIMode && (_jsxs(Card, { className: "border-primary/40 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-sky-500/5 shadow-lg rounded-3xl p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx("div", { className: "h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center", children: _jsx(Sparkles, { className: "h-4 w-4" }) }), _jsx("h3", { className: "font-bold text-foreground", children: "AI Trip Generator Assistant" })] }), _jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Example: \"10-day motorcycle road trip to Spiti Valley starting from Shimla in June with budget around \u20B935,000\"" }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsx(Input, { value: aiPrompt, onChange: (e) => setAiPrompt(e.target.value), placeholder: "Where do you want to explore?", className: "h-12 bg-background/90 text-sm", onKeyDown: (e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleGenerateAI();
                                    }
                                } }), _jsx(Button, { type: "button", variant: "gradient", onClick: handleGenerateAI, disabled: isGeneratingAI, className: "h-12 px-6 shrink-0 font-semibold gap-2 rounded-xl", children: isGeneratingAI ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), "Generating..."] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Generate Plan"] })) })] })] })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8", children: [_jsxs(Card, { className: "rounded-3xl border-border/80 shadow-sm p-6 sm:p-8 space-y-6", children: [_jsx("h3", { className: "text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3", children: _jsx("span", { children: "Trip Basics" }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "name", children: "Trip Name *" }), _jsx(Input, { id: "name", placeholder: "e.g. Goa Monsoon Coastline Trail", ...register('name'), className: errors.name ? 'border-destructive' : '' }), errors.name && (_jsx("p", { className: "text-xs text-destructive font-medium", children: errors.name.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Trip Overview & Vision" }), _jsx(Textarea, { id: "description", rows: 3, placeholder: "Describe the adventure, intended stops, special gears, or highlights...", ...register('description') })] })] }), _jsxs("div", { className: "space-y-3 pt-2", children: [_jsx(Label, { children: "Trip Type" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: TRIP_TYPES.map((type) => {
                                            const isSelected = selectedType === type.value;
                                            return (_jsxs("button", { type: "button", onClick: () => setValue('tripType', type.value), className: `flex flex-col text-left p-3.5 rounded-2xl border transition-all ${isSelected
                                                    ? 'border-primary bg-primary/10 shadow-sm'
                                                    : 'border-border bg-card hover:bg-muted/60'}`, children: [_jsxs("div", { className: "flex items-center justify-between w-full", children: [_jsx("span", { className: "font-semibold text-xs sm:text-sm text-foreground", children: type.label }), isSelected && _jsx(Check, { className: "h-4 w-4 text-primary" })] }), _jsx("span", { className: "text-[11px] text-muted-foreground mt-1", children: type.desc })] }, type.value));
                                        }) })] }), _jsxs("div", { className: "space-y-3 pt-2", children: [_jsx(Label, { children: "Transport Modes (Select all that apply)" }), _jsx("div", { className: "flex flex-wrap gap-2.5", children: TRANSPORT_MODES.map((mode) => {
                                            const Icon = mode.icon;
                                            const isSelected = selectedModes.includes(mode.value);
                                            return (_jsxs("button", { type: "button", onClick: () => toggleTransportMode(mode.value), className: `flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${isSelected
                                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                    : 'border-border bg-background hover:bg-muted text-foreground'}`, children: [_jsx(Icon, { className: "h-4 w-4" }), _jsx("span", { children: mode.label })] }, mode.value));
                                        }) })] })] }), _jsxs(Card, { className: "rounded-3xl border-border/80 shadow-sm p-6 sm:p-8 space-y-6", children: [_jsxs("h3", { className: "text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3", children: [_jsx(MapPin, { className: "h-5 w-5 text-primary" }), _jsx("span", { children: "Locations & Dates" })] }), _jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "startLocation", children: "Starting Point" }), _jsx(Input, { id: "startLocation", placeholder: "e.g. Mumbai, Maharashtra", ...register('startLocation') })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "destination", children: "Primary Destination" }), _jsx(Input, { id: "destination", placeholder: "e.g. Leh, Ladakh", ...register('destination') })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "returnLocation", children: "Return / End Location" }), _jsx(Input, { id: "returnLocation", placeholder: "e.g. Srinagar or Mumbai", ...register('returnLocation') })] })] }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-4 pt-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "startDate", children: "Start Date" }), _jsx(Input, { id: "startDate", type: "date", ...register('startDate') })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "endDate", children: "End Date" }), _jsx(Input, { id: "endDate", type: "date", ...register('endDate') })] })] })] }), _jsxs(Card, { className: "rounded-3xl border-border/80 shadow-sm p-6 sm:p-8 space-y-6", children: [_jsxs("h3", { className: "text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3", children: [_jsx(Coins, { className: "h-5 w-5 text-secondary" }), _jsx("span", { children: "Budget & Preferences" })] }), _jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "currency", children: "Currency" }), _jsx("select", { id: "currency", ...register('currency'), className: "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary", children: SUPPORTED_CURRENCIES.map((c) => (_jsx("option", { value: c, children: c }, c))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "estimatedBudget", children: "Estimated Budget Total" }), _jsx(Input, { id: "estimatedBudget", type: "number", placeholder: "30000", ...register('estimatedBudget', { valueAsNumber: true }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "visibility", children: "Visibility" }), _jsxs("select", { id: "visibility", ...register('visibility'), className: "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: TripVisibility.PRIVATE, children: "Private (Invite Only)" }), _jsx("option", { value: TripVisibility.MEMBERS_ONLY, children: "Members Only" }), _jsx("option", { value: TripVisibility.INVITE_LINK, children: "Anyone with Invite Link" })] })] })] }), _jsxs("div", { className: "space-y-2 pt-2", children: [_jsx(Label, { htmlFor: "coverImageUrl", children: "Cover Photo URL" }), _jsx(Input, { id: "coverImageUrl", placeholder: "https://images.unsplash.com/...", ...register('coverImageUrl') })] }), _jsxs("div", { className: "space-y-2 pt-2", children: [_jsx(Label, { children: "Tags" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { value: tagInput, onChange: (e) => setTagInput(e.target.value), placeholder: "Add tag (e.g. Himalayas, Camping)", onKeyDown: (e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddTag();
                                                    }
                                                } }), _jsx(Button, { type: "button", variant: "outline", onClick: handleAddTag, children: "Add Tag" })] }), tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 pt-2", children: tags.map((tag) => (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold", children: ["#", tag, _jsx("button", { type: "button", onClick: () => handleRemoveTag(tag), className: "hover:text-destructive", children: "\u00D7" })] }, tag))) }))] })] }), _jsxs("div", { className: "flex items-center justify-end gap-4 pt-4", children: [_jsx(Button, { type: "button", variant: "ghost", onClick: () => navigate('/trips'), disabled: createTripMutation.isPending, children: "Cancel" }), _jsx(Button, { type: "submit", variant: "gradient", disabled: createTripMutation.isPending, className: "px-8 h-12 text-base font-semibold shadow-lg rounded-xl gap-2", children: createTripMutation.isPending ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-5 w-5 animate-spin" }), "Creating Trip..."] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "h-5 w-5" }), "Launch Trip"] })) })] })] })] }));
}
//# sourceMappingURL=CreateTripPage.js.map