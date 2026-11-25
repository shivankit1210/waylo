import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Calendar,
  MapPin,
  Coins,
  Shield,
  Tag,
  Image as ImageIcon,
  Loader2,
  Bike,
  Car,
  Plane,
  Train,
  Bus,
  Check,
} from 'lucide-react';
import {
  createTripSchema,
  TripType,
  TransportMode,
  TripVisibility,
  SUPPORTED_CURRENCIES,
  type CreateTripInput,
} from '@waylo/shared';
import { useCreateTrip } from './hooks';
import { aiApi } from '../ai/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/common/PageHeader';
import { toast } from 'sonner';

const TRIP_TYPES = [
  { value: TripType.SOLO, label: 'Solo Explorer', desc: 'Indie solo travel' },
  { value: TripType.GROUP, label: 'Friends Group', desc: 'Crew road trips' },
  { value: TripType.MOTORCYCLE, label: 'Motorcycle Tour', desc: 'Rides & scenic passes' },
  { value: TripType.CAR_ROAD_TRIP, label: 'Car Road Trip', desc: 'Highway & long drives' },
  { value: TripType.FAMILY, label: 'Family Vacation', desc: 'Leisure & sightseeing' },
  { value: TripType.WEEKEND, label: 'Weekend Getaway', desc: '2-3 day quick trips' },
];

const TRANSPORT_MODES: { value: TransportMode; label: string; icon: any }[] = [
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

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTripInput>({
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
  const toggleTransportMode = (mode: TransportMode) => {
    const current = [...selectedModes];
    const idx = current.indexOf(mode);
    if (idx !== -1) {
      if (current.length > 1) {
        current.splice(idx, 1);
      } else {
        toast.error('Select at least one transport mode');
        return;
      }
    } else {
      current.push(mode);
    }
    setValue('transportModes', current, { shouldValidate: true });
  };

  // Add tag
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim().replace(/^#/, '');
    if (!tags.includes(clean)) {
      setValue('tags', [...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter((t) => t !== tagToRemove)
    );
  };

  // Real AI trip planner & prompt parser
  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a trip idea or destination');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const text = aiPrompt.trim();
      const daysMatch = text.match(/(\d+)\s*(?:day|days)/i);
      const daysCount = daysMatch ? parseInt(daysMatch[1], 10) : 4;

      const toMatch = text.match(/(?:to|visit|in)\s+([a-zA-Z\s]+?)(?:\s+(?:from|for|with|in|\d)|$)/i);
      const fromMatch = text.match(/(?:from|starting from|starting at)\s+([a-zA-Z\s]+?)(?:\s+(?:to|for|with|in|\d)|$)/i);

      let dest = toMatch ? toMatch[1].trim() : '';
      let orig = fromMatch ? fromMatch[1].trim() : '';

      if (!dest) {
        // Fallback: strip "plan a trip" and use text
        dest = text.replace(/^(?:plan|create|make)\s+(?:a\s+)?(?:\d+\s+days?\s+)?(?:trip|tour)\s+(?:to\s+)?/i, '').trim();
      }

      // Try AI generation
      const plan = await aiApi.generateItinerary({
        destination: dest || 'Scenic Getaway',
        origin: orig || undefined,
        daysCount,
        tripType: TripType.CAR_ROAD_TRIP,
        travelPace: 'MODERATE',
        budget: 'MODERATE',
        interests: ['Scenic Routes', 'Sightseeing', 'Local Dining'],
        preferences: text,
      });

      setValue('name', plan.tripTitle || `${dest} Road Trip`);
      setValue('destination', dest);
      if (orig) setValue('startLocation', orig);
      setValue('description', plan.summary);
      if (plan.highlights && plan.highlights.length > 0) {
        setValue('tags', plan.highlights.slice(0, 4));
      }
      setValue('tripType', TripType.CAR_ROAD_TRIP);
      setValue('transportModes', [TransportMode.CAR]);

      const d1 = new Date();
      d1.setDate(d1.getDate() + 7);
      const d2 = new Date();
      d2.setDate(d2.getDate() + 7 + daysCount);
      setValue('startDate', d1.toISOString().split('T')[0]);
      setValue('endDate', d2.toISOString().split('T')[0]);

      toast.success(`AI generated plan for ${dest}! Review details below.`);
    } catch (err) {
      console.warn('AI generation fallback:', err);
      // Fallback: smart text extraction
      const text = aiPrompt.trim();
      const daysMatch = text.match(/(\d+)\s*(?:day|days)/i);
      const days = daysMatch ? parseInt(daysMatch[1], 10) : 4;
      const toMatch = text.match(/(?:to|visit|in)\s+([a-zA-Z\s]+?)(?:\s+(?:from|for|with|in|\d)|$)/i);
      const fromMatch = text.match(/(?:from|starting from)\s+([a-zA-Z\s]+?)(?:\s+(?:to|for|with|in|\d)|$)/i);

      const dest = toMatch ? toMatch[1].trim() : text;
      const orig = fromMatch ? fromMatch[1].trim() : '';

      setValue('name', `${dest} Exploration`);
      setValue('destination', dest);
      if (orig) setValue('startLocation', orig);
      setValue(
        'description',
        `A custom ${days}-day journey to ${dest}${orig ? ` starting from ${orig}` : ''}. Includes sightseeing, local culinary stops, and scenic drives.`
      );

      toast.success(`Drafted plan for ${dest}!`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const onSubmit = async (data: CreateTripInput) => {
    try {
      const created = await createTripMutation.mutateAsync(data);
      navigate(`/trips/${created.id}`);
    } catch {
      // Toast handled by hook
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in-50 duration-300 pb-12">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {isAIMode ? 'Plan Trip with Waylo AI' : 'Create New Trip'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAIMode
              ? 'Tell our AI assistant your dream destination or vibe, and we will build the route.'
              : 'Fill in the trip parameters to initialize your itinerary and group board.'}
          </p>
        </div>
      </div>

      {/* AI Prompt Box if in AI mode */}
      {isAIMode && (
        <Card className="border-primary/40 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-sky-500/5 shadow-lg rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-foreground">AI Trip Generator Assistant</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Example: &quot;10-day motorcycle road trip to Spiti Valley starting from Shimla in June with budget around ₹35,000&quot;
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Where do you want to explore?"
              className="h-12 bg-background/90 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleGenerateAI();
                }
              }}
            />
            <Button
              type="button"
              variant="gradient"
              onClick={handleGenerateAI}
              disabled={isGeneratingAI}
              className="h-12 px-6 shrink-0 font-semibold gap-2 rounded-xl"
            >
              {isGeneratingAI ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Plan
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <Card className="rounded-3xl border-border/80 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
            <span>Trip Basics</span>
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Trip Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Goa Monsoon Coastline Trail"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Trip Overview & Vision</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Describe the adventure, intended stops, special gears, or highlights..."
                {...register('description')}
              />
            </div>
          </div>

          {/* Trip Type Selector (Visual Cards) */}
          <div className="space-y-3 pt-2">
            <Label>Trip Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TRIP_TYPES.map((type) => {
                const isSelected = selectedType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setValue('tripType', type.value)}
                    className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-card hover:bg-muted/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold text-xs sm:text-sm text-foreground">
                        {type.label}
                      </span>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-1">{type.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transport Mode Chips */}
          <div className="space-y-3 pt-2">
            <Label>Transport Modes (Select all that apply)</Label>
            <div className="flex flex-wrap gap-2.5">
              {TRANSPORT_MODES.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedModes.includes(mode.value);
                return (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => toggleTransportMode(mode.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'border-border bg-background hover:bg-muted text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Route & Dates */}
        <Card className="rounded-3xl border-border/80 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Locations & Dates</span>
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startLocation">Starting Point</Label>
              <Input
                id="startLocation"
                placeholder="e.g. Mumbai, Maharashtra"
                {...register('startLocation')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Primary Destination</Label>
              <Input
                id="destination"
                placeholder="e.g. Leh, Ladakh"
                {...register('destination')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnLocation">Return / End Location</Label>
              <Input
                id="returnLocation"
                placeholder="e.g. Srinagar or Mumbai"
                {...register('returnLocation')}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
              />
            </div>
          </div>
        </Card>

        {/* Budget & Extras */}
        <Card className="rounded-3xl border-border/80 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
            <Coins className="h-5 w-5 text-secondary" />
            <span>Budget & Preferences</span>
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                {...register('currency')}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedBudget">Estimated Budget Total</Label>
              <Input
                id="estimatedBudget"
                type="number"
                placeholder="30000"
                {...register('estimatedBudget', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <select
                id="visibility"
                {...register('visibility')}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={TripVisibility.PRIVATE}>Private (Invite Only)</option>
                <option value={TripVisibility.MEMBERS_ONLY}>Members Only</option>
                <option value={TripVisibility.INVITE_LINK}>Anyone with Invite Link</option>
              </select>
            </div>
          </div>

          {/* Cover image URL */}
          <div className="space-y-2 pt-2">
            <Label htmlFor="coverImageUrl">Cover Photo URL</Label>
            <Input
              id="coverImageUrl"
              placeholder="https://images.unsplash.com/..."
              {...register('coverImageUrl')}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2 pt-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag (e.g. Himalayas, Camping)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add Tag
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/trips')}
            disabled={createTripMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="gradient"
            disabled={createTripMutation.isPending}
            className="px-8 h-12 text-base font-semibold shadow-lg rounded-xl gap-2"
          >
            {createTripMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Trip...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Launch Trip
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
