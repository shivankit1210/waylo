import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  Save,
  MapPin,
  Coins,
  Bike,
  Car,
  Plane,
  Train,
  Bus,
  Check,
} from 'lucide-react';
import {
  updateTripSchema,
  TripType,
  TransportMode,
  TripStatus,
  TripVisibility,
  SUPPORTED_CURRENCIES,
  type UpdateTripInput,
} from '@waylo/shared';
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

const TRANSPORT_MODES: { value: TransportMode; label: string; icon: any }[] = [
  { value: TransportMode.CAR, label: 'Car', icon: Car },
  { value: TransportMode.MOTORCYCLE, label: 'Motorcycle', icon: Bike },
  { value: TransportMode.FLIGHT, label: 'Flight', icon: Plane },
  { value: TransportMode.TRAIN, label: 'Train', icon: Train },
  { value: TransportMode.BUS, label: 'Bus', icon: Bus },
];

export function EditTripPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  const { data: trip, isLoading } = useTrip(tripId);
  const updateMutation = useUpdateTrip();
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateTripInput>({
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
    setValue('transportModes', current);
  };

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

  const onSubmit = async (data: UpdateTripInput) => {
    if (!tripId) return;
    try {
      await updateMutation.mutateAsync({ tripId, data });
      navigate(`/trips/${tripId}`);
    } catch {
      // Toast handled by mutation
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading trip details..." />;
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Trip not found.</p>
        <Button variant="outline" onClick={() => navigate('/trips')} className="mt-4">
          Back to My Trips
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in-50 duration-300 pb-12">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/trips/${tripId}`)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Edit &quot;{trip.name}&quot;
          </h1>
          <p className="text-sm text-muted-foreground">
            Update your journey parameters and status
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="rounded-3xl border-border/80 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-foreground border-b border-border/60 pb-3">
            Trip Basics
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Trip Name *</Label>
              <Input
                id="name"
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
                {...register('description')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trip Lifecycle Status</Label>
              <select
                id="status"
                {...register('status')}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={TripStatus.DRAFT}>Draft (Planning phase)</option>
                <option value={TripStatus.PLANNED}>Planned (Ready to go)</option>
                <option value={TripStatus.ONGOING}>Ongoing (Currently happening)</option>
                <option value={TripStatus.COMPLETED}>Completed</option>
                <option value={TripStatus.CANCELLED}>Cancelled</option>
                <option value={TripStatus.ARCHIVED}>Archived</option>
              </select>
            </div>
          </div>

          {/* Trip Type */}
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
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transport Mode Chips */}
          <div className="space-y-3 pt-2">
            <Label>Transport Modes</Label>
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

        {/* Location & Dates */}
        <Card className="rounded-3xl border-border/80 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Locations & Dates</span>
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startLocation">Starting Point</Label>
              <Input id="startLocation" {...register('startLocation')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Primary Destination</Label>
              <Input id="destination" {...register('destination')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnLocation">Return / End Location</Label>
              <Input id="returnLocation" {...register('returnLocation')} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" {...register('startDate')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" {...register('endDate')} />
            </div>
          </div>
        </Card>

        {/* Budget & Preferences */}
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
              <Label htmlFor="estimatedBudget">Estimated Budget</Label>
              <Input
                id="estimatedBudget"
                type="number"
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

          <div className="space-y-2 pt-2">
            <Label htmlFor="coverImageUrl">Cover Photo URL</Label>
            <Input id="coverImageUrl" {...register('coverImageUrl')} />
          </div>

          {/* Tags */}
          <div className="space-y-2 pt-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag"
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
            onClick={() => navigate(`/trips/${tripId}`)}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-8 h-12 text-base font-semibold shadow-lg rounded-xl gap-2"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
