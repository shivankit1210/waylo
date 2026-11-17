import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Compass, MapPin, Clock, CheckCircle2, Bike, Car, RefreshCw, Sliders, Flame, } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGenerateItinerary, useApplyItinerary, useGeneratePacking, useApplyPacking } from './hooks';
import { createTrip } from '../trips/api';
import { TripType, TransportMode, TripVisibility } from '@waylo/shared';
import { toast } from 'sonner';
const QUICK_DESTINATIONS = [
    { name: 'Goa Coastal Loop', dest: 'Goa', origin: 'Mumbai', type: TripType.MOTORCYCLE, days: 4 },
    { name: 'Ladakh High Passes', dest: 'Leh, Ladakh', origin: 'Manali', type: TripType.MOTORCYCLE, days: 7 },
    { name: 'Western Ghats & Coorg', dest: 'Coorg', origin: 'Bengaluru', type: TripType.CAR_ROAD_TRIP, days: 3 },
    { name: 'Rajasthan Forts & Dunes', dest: 'Jaisalmer', origin: 'Jaipur', type: TripType.CAR_ROAD_TRIP, days: 5 },
];
const INTEREST_TAGS = [
    'Scenic Twisties & Curves',
    'Heritage Forts & Palaces',
    'Authentic Regional Dining',
    'Golden Hour Sunsets',
    'High Altitude Passes',
    'Beach Shacks & Ocean Breeze',
    'Coffee & Spice Plantations',
    'Night Sky Stargazing',
    'Off-road & 4x4 Trails',
    'Photography & Architecture',
];
export function AITripPlannerPage() {
    const navigate = useNavigate();
    const generateItineraryMutation = useGenerateItinerary();
    const applyItineraryMutation = useApplyItinerary();
    const generatePackingMutation = useGeneratePacking();
    const applyPackingMutation = useApplyPacking();
    const [destination, setDestination] = useState('Goa');
    const [origin, setOrigin] = useState('Mumbai');
    const [daysCount, setDaysCount] = useState(4);
    const [startDate, setStartDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
    const [tripType, setTripType] = useState(TripType.MOTORCYCLE);
    const [travelPace, setTravelPace] = useState('MODERATE');
    const [budget, setBudget] = useState('MODERATE');
    const [selectedInterests, setSelectedInterests] = useState([
        'Scenic Twisties & Curves',
        'Golden Hour Sunsets',
        'Authentic Regional Dining',
    ]);
    const [preferences, setPreferences] = useState('');
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [isSavingTrip, setIsSavingTrip] = useState(false);
    const [selectedDayNumber, setSelectedDayNumber] = useState(1);
    const toggleInterest = (tag) => {
        if (selectedInterests.includes(tag)) {
            setSelectedInterests(selectedInterests.filter((t) => t !== tag));
        }
        else {
            setSelectedInterests([...selectedInterests, tag]);
        }
    };
    const handleGenerate = async () => {
        if (!destination.trim()) {
            toast.error('Please enter a destination');
            return;
        }
        try {
            const plan = await generateItineraryMutation.mutateAsync({
                destination: destination.trim(),
                origin: origin.trim() || undefined,
                daysCount,
                startDate: startDate || undefined,
                tripType,
                travelPace,
                budget,
                interests: selectedInterests,
                preferences: preferences.trim() || undefined,
            });
            setGeneratedPlan(plan);
            setSelectedDayNumber(1);
            toast.success('AI plan crafted! Review day stops below.');
        }
        catch {
            // Error handled by mutation
        }
    };
    const handleApplyAndCreateTrip = async () => {
        if (!generatedPlan)
            return;
        setIsSavingTrip(true);
        try {
            // 1. Calculate dates
            const start = startDate ? new Date(startDate) : new Date();
            const end = new Date(start);
            end.setDate(end.getDate() + (daysCount - 1));
            // 2. Map budget target estimate
            const budgetAmount = budget === 'BUDGET' ? 15000 : budget === 'LUXURY' ? 65000 : 35000;
            // 3. Create the Trip in PostgreSQL
            const createdTrip = await createTrip({
                name: generatedPlan.tripTitle || `${destination} Expedition`,
                description: generatedPlan.summary,
                tripType,
                destination,
                startLocation: origin || destination,
                returnLocation: origin || destination,
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                currency: 'INR',
                estimatedBudget: budgetAmount,
                transportModes: [
                    tripType === TripType.MOTORCYCLE ? TransportMode.MOTORCYCLE : TransportMode.CAR,
                ],
                visibility: TripVisibility.PRIVATE,
                tags: [destination, tripType, ...selectedInterests.slice(0, 2)],
            });
            // 4. Apply the generated itinerary days & stops
            await applyItineraryMutation.mutateAsync({
                tripId: createdTrip.id,
                itinerary: generatedPlan,
            });
            // 5. Automatically craft and link matching packing checklist
            try {
                const packingList = await generatePackingMutation.mutateAsync({
                    destination,
                    tripType,
                    daysCount,
                    includeRidingGear: tripType === TripType.MOTORCYCLE,
                    tripId: createdTrip.id,
                });
                if (packingList && packingList.items.length > 0) {
                    await applyPackingMutation.mutateAsync({
                        tripId: createdTrip.id,
                        items: packingList.items,
                    });
                }
            }
            catch (packingErr) {
                console.warn('Auto-packing checklist generation skipped:', packingErr);
            }
            toast.success('Trip created and populated with AI itinerary & gear list!');
            navigate(`/trips/${createdTrip.id}`);
        }
        catch (err) {
            toast.error(err.message || 'Failed to save expedition');
        }
        finally {
            setIsSavingTrip(false);
        }
    };
    return (_jsxs("div", { className: "space-y-8 animate-in fade-in-50 duration-300 pb-16 max-w-6xl mx-auto", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate('/trips'), className: "gap-2 w-fit -ml-2 text-muted-foreground hover:text-foreground mb-1", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), _jsx("span", { children: "Back to Trips" })] }), _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold", children: _jsx(Sparkles, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground", children: "AI Travel Architect" }), _jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Intelligently generate route stops, scenic twisties, and gear checklists in seconds." })] })] })] }), generatedPlan && (_jsxs(Button, { onClick: handleApplyAndCreateTrip, disabled: isSavingTrip, className: "rounded-xl font-bold gap-2 shadow-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:opacity-95 text-white", children: [isSavingTrip ? (_jsx(RefreshCw, { className: "h-4 w-4 animate-spin" })) : (_jsx(CheckCircle2, { className: "h-4 w-4" })), _jsx("span", { children: "Save & Launch Trip" })] }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Quick Inspo Routes" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: QUICK_DESTINATIONS.map((q) => (_jsxs("button", { onClick: () => {
                                setDestination(q.dest);
                                setOrigin(q.origin);
                                setTripType(q.type);
                                setDaysCount(q.days);
                            }, className: "p-3 text-left rounded-2xl border border-border/70 bg-card/60 hover:bg-accent/40 hover:border-primary/50 transition-all group", children: [_jsx("p", { className: "text-xs font-bold text-foreground group-hover:text-primary transition-colors", children: q.name }), _jsxs("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: [q.origin, " \u2192 ", q.dest, " \u2022 ", q.days, " Days"] })] }, q.name))) })] }), _jsxs("div", { className: "grid lg:grid-cols-12 gap-8", children: [_jsx("div", { className: "lg:col-span-5 space-y-6", children: _jsxs(Card, { className: "p-6 rounded-3xl border-border/80 space-y-5 bg-card/90 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-2 pb-2 border-b border-border/60", children: [_jsx(Sliders, { className: "h-4 w-4 text-primary" }), _jsx("h3", { className: "font-bold text-base text-foreground", children: "Expedition Parameters" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "text-xs font-semibold text-muted-foreground block mb-1", children: ["Primary Destination ", _jsx("span", { className: "text-destructive", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx(MapPin, { className: "h-4 w-4 absolute left-3 top-3 text-muted-foreground" }), _jsx(Input, { value: destination, onChange: (e) => setDestination(e.target.value), placeholder: "e.g. Goa, Leh, Coorg, Manali", className: "pl-9 rounded-xl font-medium" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground block mb-1", children: "Starting Point (Origin)" }), _jsxs("div", { className: "relative", children: [_jsx(Compass, { className: "h-4 w-4 absolute left-3 top-3 text-muted-foreground" }), _jsx(Input, { value: origin, onChange: (e) => setOrigin(e.target.value), placeholder: "e.g. Mumbai, Delhi, Bengaluru", className: "pl-9 rounded-xl font-medium" })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground block mb-1", children: "Duration (Days)" }), _jsx("div", { className: "flex items-center gap-2", children: _jsx(Input, { type: "number", min: 1, max: 21, value: daysCount, onChange: (e) => setDaysCount(Math.max(1, parseInt(e.target.value) || 1)), className: "rounded-xl font-bold text-center" }) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground block mb-1", children: "Start Date" }), _jsx("div", { className: "relative", children: _jsx(Input, { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), className: "rounded-xl font-medium text-xs" }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground block", children: "Travel Style" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: [
                                                { type: TripType.MOTORCYCLE, label: 'Motorcycle', icon: Bike },
                                                { type: TripType.CAR_ROAD_TRIP, label: 'Road Trip', icon: Car },
                                                { type: TripType.SOLO, label: 'Solo Flight', icon: Compass },
                                            ].map((item) => {
                                                const Icon = item.icon;
                                                const isSelected = tripType === item.type;
                                                return (_jsxs("button", { type: "button", onClick: () => setTripType(item.type), className: `p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold ${isSelected
                                                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                                        : 'border-border/70 hover:bg-accent/40 text-muted-foreground'}`, children: [_jsx(Icon, { className: "h-4 w-4" }), _jsx("span", { children: item.label })] }, item.label));
                                            }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground block", children: "Expedition Pace" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: ['RELAXED', 'MODERATE', 'PACKED'].map((p) => (_jsx("button", { type: "button", onClick: () => setTravelPace(p), className: `py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${travelPace === p
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border/70 hover:bg-accent/40 text-muted-foreground'}`, children: p.charAt(0) + p.slice(1).toLowerCase() }, p))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground block", children: "Budget Target" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: ['BUDGET', 'MODERATE', 'LUXURY'].map((b) => (_jsx("button", { type: "button", onClick: () => setBudget(b), className: `py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${budget === b
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border/70 hover:bg-accent/40 text-muted-foreground'}`, children: b.charAt(0) + b.slice(1).toLowerCase() }, b))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground block", children: "Interests & Focus" }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: INTEREST_TAGS.map((tag) => {
                                                const isSelected = selectedInterests.includes(tag);
                                                return (_jsx("button", { type: "button", onClick: () => toggleInterest(tag), className: `px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${isSelected
                                                        ? 'border-primary bg-primary text-white shadow-xs'
                                                        : 'border-border/70 bg-card hover:bg-accent/40 text-muted-foreground'}`, children: tag }, tag));
                                            }) })] }), _jsx(Button, { onClick: handleGenerate, disabled: generateItineraryMutation.isPending, className: "w-full rounded-xl font-bold py-6 gap-2 bg-primary hover:bg-primary/90 text-white shadow-md text-sm mt-4", children: generateItineraryMutation.isPending ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }), _jsx("span", { children: "Synthesizing Waypoints & Routes..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "h-4 w-4" }), _jsx("span", { children: "Generate AI Itinerary" })] })) })] }) }), _jsx("div", { className: "lg:col-span-7 space-y-6", children: !generatedPlan ? (_jsxs(Card, { className: "p-12 rounded-3xl border-dashed border-2 border-border/80 flex flex-col items-center justify-center text-center space-y-4 min-h-[460px] bg-muted/10", children: [_jsx("div", { className: "h-16 w-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-inner", children: _jsx(Sparkles, { className: "h-8 w-8 animate-pulse" }) }), _jsxs("div", { className: "space-y-1.5 max-w-sm", children: [_jsx("h3", { className: "text-lg font-bold text-foreground", children: "Your Smart Itinerary Will Appear Here" }), _jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: ["Select your destination, pace, and interests on the left and tap", ' ', _jsx("span", { className: "font-semibold text-foreground", children: "\"Generate AI Itinerary\"" }), "."] })] })] })) : (_jsxs("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: [_jsxs(Card, { className: "p-6 rounded-3xl border-border/80 bg-gradient-to-br from-card via-card to-primary/5 space-y-4 shadow-sm", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [_jsxs(Badge, { variant: "outline", className: "border-primary/40 text-primary text-xs px-3 py-1 font-semibold", children: [_jsx(Sparkles, { className: "h-3 w-3 mr-1 inline" }), " AI Generated Blueprint"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: handleGenerate, disabled: generateItineraryMutation.isPending, className: "gap-1.5 rounded-xl text-xs font-semibold", children: [_jsx(RefreshCw, { className: "h-3 w-3" }), _jsx("span", { children: "Re-roll Plan" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-2xl font-black tracking-tight text-foreground", children: generatedPlan.tripTitle }), _jsx("p", { className: "text-xs sm:text-sm text-muted-foreground leading-relaxed", children: generatedPlan.summary })] }), generatedPlan.highlights && generatedPlan.highlights.length > 0 && (_jsxs("div", { className: "pt-3 border-t border-border/60", children: [_jsxs("p", { className: "text-xs font-bold text-foreground mb-2 flex items-center gap-1.5", children: [_jsx(Flame, { className: "h-3.5 w-3.5 text-amber-500" }), "Key Highlights"] }), _jsx("div", { className: "grid sm:grid-cols-2 gap-2 text-xs", children: generatedPlan.highlights.map((h, i) => (_jsxs("div", { className: "flex items-start gap-2 p-2 rounded-xl bg-muted/40 border border-border/40 text-muted-foreground", children: [_jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-primary shrink-0 mt-0.5" }), _jsx("span", { className: "font-medium text-foreground", children: h })] }, i))) })] }))] }), _jsx("div", { className: "flex items-center gap-2 overflow-x-auto pb-1", children: generatedPlan.days.map((d) => (_jsxs("button", { onClick: () => setSelectedDayNumber(d.dayNumber), className: `px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${selectedDayNumber === d.dayNumber
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-card border border-border/70 text-muted-foreground hover:text-foreground'}`, children: ["Day ", d.dayNumber] }, d.dayNumber))) }), (() => {
                                    const day = generatedPlan.days.find((d) => d.dayNumber === selectedDayNumber);
                                    if (!day)
                                        return null;
                                    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "font-bold text-base text-foreground", children: day.title }), _jsxs("span", { className: "text-xs text-muted-foreground", children: [day.stops.length, " Stops"] })] }), _jsx("div", { className: "space-y-3", children: day.stops.map((stop, sIdx) => (_jsxs(Card, { className: "p-4 rounded-2xl border-border/70 hover:border-primary/40 transition-colors bg-card/90 space-y-2", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "h-7 w-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5", children: sIdx + 1 }), _jsxs("div", { children: [_jsx("h5", { className: "font-bold text-sm text-foreground", children: stop.title }), _jsxs("div", { className: "flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1", children: [stop.plannedStartTime && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "h-3 w-3 text-primary" }), stop.plannedStartTime, " ", stop.plannedEndTime ? `- ${stop.plannedEndTime}` : ''] })), stop.location && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "h-3 w-3 text-muted-foreground" }), stop.location] })), stop.plannedDistanceKm && (_jsxs("span", { className: "font-medium text-foreground", children: ["~", stop.plannedDistanceKm, " km"] }))] })] })] }), _jsx(Badge, { variant: "outline", className: "text-[10px] uppercase font-semibold", children: stop.itemType })] }), stop.notes && (_jsxs("p", { className: "text-xs text-muted-foreground pl-10 border-l-2 border-primary/20 ml-3 italic", children: ["\"", stop.notes, "\""] }))] }, sIdx))) })] }));
                                })(), _jsxs("div", { className: "p-4 rounded-2xl bg-card border border-border/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-foreground", children: "Ready to take this on the road?" }), _jsx("p", { className: "text-[11px] text-muted-foreground", children: "Saves this itinerary, route waypoints, and smart gear checklist to your active trips." })] }), _jsx(Button, { onClick: handleApplyAndCreateTrip, disabled: isSavingTrip, className: "w-full sm:w-auto rounded-xl font-bold py-2.5 px-6 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md text-xs sm:text-sm shrink-0", children: isSavingTrip ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }), _jsx("span", { children: "Saving to Trip OS..." })] })) : (_jsxs(_Fragment, { children: [_jsx(CheckCircle2, { className: "h-4 w-4" }), _jsx("span", { children: "Save & Launch Trip" })] })) })] })] })) })] })] }));
}
//# sourceMappingURL=AITripPlannerPage.js.map