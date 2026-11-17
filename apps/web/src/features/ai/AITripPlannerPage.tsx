import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Calendar,
  Compass,
  MapPin,
  Clock,
  Coins,
  CheckCircle2,
  Bike,
  Car,
  Users,
  Backpack,
  ArrowRight,
  RefreshCw,
  Sliders,
  Utensils,
  Camera,
  Layers,
  Flame,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useGenerateItinerary, useApplyItinerary, useGeneratePacking, useApplyPacking } from './hooks';
import { createTrip } from '../trips/api';
import { TripType, TransportMode, TripVisibility, type AIGeneratedItinerary } from '@waylo/shared';
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
  const [daysCount, setDaysCount] = useState<number>(4);
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [tripType, setTripType] = useState<TripType>(TripType.MOTORCYCLE);
  const [travelPace, setTravelPace] = useState<'RELAXED' | 'MODERATE' | 'PACKED'>('MODERATE');
  const [budget, setBudget] = useState<'BUDGET' | 'MODERATE' | 'LUXURY'>('MODERATE');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Scenic Twisties & Curves',
    'Golden Hour Sunsets',
    'Authentic Regional Dining',
  ]);
  const [preferences, setPreferences] = useState('');

  const [generatedPlan, setGeneratedPlan] = useState<AIGeneratedItinerary | null>(null);
  const [isSavingTrip, setIsSavingTrip] = useState(false);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter((t) => t !== tag));
    } else {
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
    } catch {
      // Error handled by mutation
    }
  };

  const handleApplyAndCreateTrip = async () => {
    if (!generatedPlan) return;
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
      } catch (packingErr) {
        console.warn('Auto-packing checklist generation skipped:', packingErr);
      }

      toast.success('Trip created and populated with AI itinerary & gear list!');
      navigate(`/trips/${createdTrip.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save expedition');
    } finally {
      setIsSavingTrip(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 pb-16 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/trips')}
            className="gap-2 w-fit -ml-2 text-muted-foreground hover:text-foreground mb-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Trips</span>
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                AI Travel Architect
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Intelligently generate route stops, scenic twisties, and gear checklists in seconds.
              </p>
            </div>
          </div>
        </div>

        {generatedPlan && (
          <Button
            onClick={handleApplyAndCreateTrip}
            disabled={isSavingTrip}
            className="rounded-xl font-bold gap-2 shadow-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:opacity-95 text-white"
          >
            {isSavingTrip ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <span>Save & Launch Trip</span>
          </Button>
        )}
      </div>

      {/* Quick Inspo Templates */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Inspo Routes
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_DESTINATIONS.map((q) => (
            <button
              key={q.name}
              onClick={() => {
                setDestination(q.dest);
                setOrigin(q.origin);
                setTripType(q.type);
                setDaysCount(q.days);
              }}
              className="p-3 text-left rounded-2xl border border-border/70 bg-card/60 hover:bg-accent/40 hover:border-primary/50 transition-all group"
            >
              <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                {q.name}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {q.origin} → {q.dest} • {q.days} Days
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Output on Right */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Form: Parameters (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 rounded-3xl border-border/80 space-y-5 bg-card/90 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <Sliders className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-base text-foreground">Expedition Parameters</h3>
            </div>

            {/* Destination & Origin */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Primary Destination <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <MapPin className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Goa, Leh, Coorg, Manali"
                    className="pl-9 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Starting Point (Origin)
                </label>
                <div className="relative">
                  <Compass className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. Mumbai, Delhi, Bengaluru"
                    className="pl-9 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Duration & Start Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Duration (Days)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={21}
                    value={daysCount}
                    onChange={(e) => setDaysCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="rounded-xl font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-xl font-medium text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Trip Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground block">
                Travel Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: TripType.MOTORCYCLE, label: 'Motorcycle', icon: Bike },
                  { type: TripType.CAR_ROAD_TRIP, label: 'Road Trip', icon: Car },
                  { type: TripType.SOLO, label: 'Solo Flight', icon: Compass },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = tripType === item.type;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setTripType(item.type)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border/70 hover:bg-accent/40 text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pace Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground block">
                Expedition Pace
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['RELAXED', 'MODERATE', 'PACKED'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTravelPace(p)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      travelPace === p
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/70 hover:bg-accent/40 text-muted-foreground'
                    }`}
                  >
                    {p.charAt(0) + p.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground block">
                Budget Target
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['BUDGET', 'MODERATE', 'LUXURY'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudget(b)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      budget === b
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/70 hover:bg-accent/40 text-muted-foreground'
                    }`}
                  >
                    {b.charAt(0) + b.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Tags */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground block">
                Interests & Focus
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INTEREST_TAGS.map((tag) => {
                  const isSelected = selectedInterests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        isSelected
                          ? 'border-primary bg-primary text-white shadow-xs'
                          : 'border-border/70 bg-card hover:bg-accent/40 text-muted-foreground'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={generateItineraryMutation.isPending}
              className="w-full rounded-xl font-bold py-6 gap-2 bg-primary hover:bg-primary/90 text-white shadow-md text-sm mt-4"
            >
              {generateItineraryMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Waypoints & Routes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate AI Itinerary</span>
                </>
              )}
            </Button>
          </Card>
        </div>

        {/* Right Area: Generated Plan Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!generatedPlan ? (
            <Card className="p-12 rounded-3xl border-dashed border-2 border-border/80 flex flex-col items-center justify-center text-center space-y-4 min-h-[460px] bg-muted/10">
              <div className="h-16 w-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <Sparkles className="h-8 w-8 animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-lg font-bold text-foreground">
                  Your Smart Itinerary Will Appear Here
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Select your destination, pace, and interests on the left and tap{' '}
                  <span className="font-semibold text-foreground">"Generate AI Itinerary"</span>.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              {/* Plan Header Card */}
              <Card className="p-6 rounded-3xl border-border/80 bg-gradient-to-br from-card via-card to-primary/5 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="outline" className="border-primary/40 text-primary text-xs px-3 py-1 font-semibold">
                    <Sparkles className="h-3 w-3 mr-1 inline" /> AI Generated Blueprint
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={generateItineraryMutation.isPending}
                    className="gap-1.5 rounded-xl text-xs font-semibold"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Re-roll Plan</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black tracking-tight text-foreground">
                    {generatedPlan.tripTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {generatedPlan.summary}
                  </p>
                </div>

                {/* Highlights Strip */}
                {generatedPlan.highlights && generatedPlan.highlights.length > 0 && (
                  <div className="pt-3 border-t border-border/60">
                    <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-amber-500" />
                      Key Highlights
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                      {generatedPlan.highlights.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-2 rounded-xl bg-muted/40 border border-border/40 text-muted-foreground"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="font-medium text-foreground">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Day Selector Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {generatedPlan.days.map((d) => (
                  <button
                    key={d.dayNumber}
                    onClick={() => setSelectedDayNumber(d.dayNumber)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      selectedDayNumber === d.dayNumber
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-card border border-border/70 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Day {d.dayNumber}
                  </button>
                ))}
              </div>

              {/* Selected Day Stops Timeline */}
              {(() => {
                const day = generatedPlan.days.find((d) => d.dayNumber === selectedDayNumber);
                if (!day) return null;

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base text-foreground">{day.title}</h4>
                      <span className="text-xs text-muted-foreground">{day.stops.length} Stops</span>
                    </div>

                    <div className="space-y-3">
                      {day.stops.map((stop, sIdx) => (
                        <Card
                          key={sIdx}
                          className="p-4 rounded-2xl border-border/70 hover:border-primary/40 transition-colors bg-card/90 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="h-7 w-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                {sIdx + 1}
                              </div>
                              <div>
                                <h5 className="font-bold text-sm text-foreground">{stop.title}</h5>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                                  {stop.plannedStartTime && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3 text-primary" />
                                      {stop.plannedStartTime} {stop.plannedEndTime ? `- ${stop.plannedEndTime}` : ''}
                                    </span>
                                  )}
                                  {stop.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3 text-muted-foreground" />
                                      {stop.location}
                                    </span>
                                  )}
                                  {stop.plannedDistanceKm && (
                                    <span className="font-medium text-foreground">
                                      ~{stop.plannedDistanceKm} km
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                              {stop.itemType}
                            </Badge>
                          </div>

                          {stop.notes && (
                            <p className="text-xs text-muted-foreground pl-10 border-l-2 border-primary/20 ml-3 italic">
                              "{stop.notes}"
                            </p>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Bottom Sticky Action Bar */}
              <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-foreground">Ready to take this on the road?</p>
                  <p className="text-[11px] text-muted-foreground">
                    Saves this itinerary, route waypoints, and smart gear checklist to your active trips.
                  </p>
                </div>
                <Button
                  onClick={handleApplyAndCreateTrip}
                  disabled={isSavingTrip}
                  className="w-full sm:w-auto rounded-xl font-bold py-2.5 px-6 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md text-xs sm:text-sm shrink-0"
                >
                  {isSavingTrip ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Saving to Trip OS...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Save & Launch Trip</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
