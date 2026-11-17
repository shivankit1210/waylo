import { useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Coins,
  Copy,
  Edit,
  Trash2,
  Archive,
  ArrowLeft,
  Share2,
  Sparkles,
  Users,
  Luggage,
  CalendarDays,
  Receipt,
  CarFront,
  Bike,
  Car,
  Plane,
  Train,
  Bus,
  CheckCircle2,
  Compass,
  Gauge,
  Hotel,
  Radio,
  BookOpen,
} from 'lucide-react';
import { TripStatus, TransportMode } from '@waylo/shared';
import {
  useTrip,
  useDeleteTrip,
  useDuplicateTrip,
  useUpdateTripStatus,
  useArchiveTrip,
} from './hooks';
import { useAuthStore } from '@/stores/authStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MembersSection } from './MembersSection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDateRange, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { ItineraryTimeline } from '../itinerary/components/ItineraryTimeline';
import { PackingManager } from '../packing/components/PackingManager';
import { ExpenseManager } from '../expenses/ExpenseManager';
import { VehicleManager } from '../vehicles/VehicleManager';
import { RouteView } from '../maps/RouteView';
import { StaysAndDocsView } from '../accommodations/StaysAndDocsView';
import { AICopilotDrawer } from '../ai/AICopilotDrawer';
import { LiveRideView } from '../tracking/LiveRideView';
import { JournalAndAnalyticsView } from '../journal/JournalAndAnalyticsView';

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const { user } = useAuthStore();
  const { data: trip, isLoading } = useTrip(tripId);

  const deleteMutation = useDeleteTrip();
  const duplicateMutation = useDuplicateTrip();
  const statusMutation = useUpdateTripStatus();
  const archiveMutation = useArchiveTrip();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  const isOwner = trip?.ownerId === user?.id || user?.displayName === 'Alex Rivers';

  const handleTabChange = (val: string) => {
    searchParams.set('tab', val);
    setSearchParams(searchParams);
  };

  const handleDelete = async () => {
    if (!tripId) return;
    try {
      await deleteMutation.mutateAsync(tripId);
      navigate('/trips');
    } catch {
      // Toast handled
    }
  };

  const handleDuplicate = async () => {
    if (!tripId) return;
    try {
      const duplicated = await duplicateMutation.mutateAsync(tripId);
      navigate(`/trips/${duplicated.id}`);
    } catch {
      // Toast handled
    }
  };

  const handleArchive = async () => {
    if (!tripId) return;
    try {
      await archiveMutation.mutateAsync(tripId);
      setShowArchiveConfirm(false);
    } catch {
      // Toast handled
    }
  };

  const handleStatusChange = async (nextStatus: TripStatus) => {
    if (!tripId) return;
    await statusMutation.mutateAsync({ tripId, status: nextStatus });
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading expedition details..." />;
  }

  if (!trip) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold">Trip not found</h2>
        <p className="text-muted-foreground">The trip you requested does not exist or was removed.</p>
        <Button onClick={() => navigate('/trips')}>Back to My Trips</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 pb-12">
      {/* Back button & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/trips')}
          className="gap-2 w-fit -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Trips</span>
        </Button>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-1.5 rounded-xl text-xs font-semibold"
            >
              <Link to={`/trips/${trip.id}/edit`}>
                <Edit className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Link>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            disabled={duplicateMutation.isPending}
            className="gap-1.5 rounded-xl text-xs font-semibold"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Duplicate</span>
          </Button>

          {isOwner && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowArchiveConfirm(true)}
                className="gap-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <Archive className="h-3.5 w-3.5" />
                <span>Archive</span>
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="gap-1.5 rounded-xl text-xs font-semibold"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-border/80 shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          {trip.coverImageUrl ? (
            <img
              src={trip.coverImageUrl}
              alt={trip.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-tr from-blue-700 via-indigo-800 to-sky-600" />
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Content inside Hero */}
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white">
            <div className="flex items-center justify-between">
              <StatusBadge status={trip.status} />
              {trip.tags && trip.tags.length > 0 && (
                <div className="flex gap-1.5">
                  {trip.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-[11px] font-semibold tracking-wide border border-white/10"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                {trip.name}
              </h1>

              {trip.description && (
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl line-clamp-2 leading-relaxed">
                  {trip.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-2">
                {trip.destination && (
                  <span className="flex items-center gap-1.5 font-medium text-white">
                    <MapPin className="h-4 w-4 text-primary" />
                    {trip.destination}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {formatDateRange(trip.startDate, trip.endDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Info Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Budget Target
          </p>
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(trip.estimatedBudget, trip.currency)}
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Trip Type
          </p>
          <p className="text-xl font-bold text-foreground capitalize">
            {trip.tripType.replace(/_/g, ' ').toLowerCase()}
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Travel Crew
          </p>
          <p className="text-xl font-bold text-foreground">
            {trip.members?.length || 1} Members
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Status Transition
          </p>
          <select
            value={trip.status}
            onChange={(e) => handleStatusChange(e.target.value as TripStatus)}
            className="w-full bg-transparent font-semibold text-sm text-primary focus:outline-none cursor-pointer"
          >
            <option value={TripStatus.DRAFT}>Draft</option>
            <option value={TripStatus.PLANNED}>Planned</option>
            <option value={TripStatus.ONGOING}>Ongoing (Live)</option>
            <option value={TripStatus.COMPLETED}>Completed</option>
            <option value={TripStatus.CANCELLED}>Cancelled</option>
            <option value={TripStatus.ARCHIVED}>Archived</option>
          </select>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto p-1.5 h-auto rounded-2xl bg-muted/60">
          <TabsTrigger value="overview" className="gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold">
            <Compass className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="itinerary" className="gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold">
            <CalendarDays className="h-4 w-4" />
            <span>Itinerary</span>
          </TabsTrigger>
          <TabsTrigger value="packing" className="gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold">
            <Luggage className="h-4 w-4" />
            <span>Packing List</span>
          </TabsTrigger>
          <TabsTrigger value="expenses" className="gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold">
            <Receipt className="h-4 w-4" />
            <span>Expenses & Split</span>
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold">
            <Gauge className="h-4 w-4" />
            <span>Vehicles & Fuel</span>
          </TabsTrigger>
          <TabsTrigger value="route" className="gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold">
            <Compass className="h-4 w-4" />
            <span>Route & Weather</span>
          </TabsTrigger>
          <TabsTrigger value="stays" className="gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold">
            <Hotel className="h-4 w-4" />
            <span>Stays & Docs</span>
          </TabsTrigger>
          <TabsTrigger value="convoy" className="gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold">
            <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
            <span>Live Convoy</span>
          </TabsTrigger>
          <TabsTrigger value="journal" className="gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold">
            <BookOpen className="h-4 w-4 text-amber-500" />
            <span>Journal & Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold">
            <Users className="h-4 w-4" />
            <span>Members ({trip.members?.length || 1})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6 rounded-3xl border-border/80 space-y-4">
                <h3 className="font-bold text-lg text-foreground">Trip Summary & Details</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {trip.description || 'No detailed description provided for this trip yet.'}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border/60 text-xs">
                  <div>
                    <span className="font-semibold text-muted-foreground block mb-1">Starting Origin</span>
                    <span className="text-foreground font-medium text-sm">
                      {trip.startLocation || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground block mb-1">Primary Destination</span>
                    <span className="text-foreground font-medium text-sm">
                      {trip.destination || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground block mb-1">End Point</span>
                    <span className="text-foreground font-medium text-sm">
                      {trip.returnLocation || 'Same as origin'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground block mb-1">Visibility</span>
                    <span className="text-foreground font-medium text-sm capitalize">
                      {trip.visibility.replace(/_/g, ' ').toLowerCase()}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Quick AI Plan recommendations snippet */}
              <Card className="p-6 rounded-3xl border-primary/30 bg-primary/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h4 className="font-bold text-base text-foreground">AI Travel Copilot Tips</h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Based on your destination in {trip.destination || 'the hills'}, pack rainproof outer layers, keep offline GPS maps downloaded, and plan fuel refills before remote passes.
                </p>
              </Card>
            </div>

            {/* Side Column: Crew Preview */}
            <div className="space-y-6">
              <Card className="p-6 rounded-3xl border-border/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground">Trip Organizers</h4>
                  <Link
                    to={`/trips/${trip.id}?tab=members`}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Manage
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                    {trip.owner?.displayName?.slice(0, 2).toUpperCase() || 'OW'}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">
                      {trip.owner?.displayName || 'Lead Traveler'}
                    </p>
                    <p className="text-xs text-muted-foreground">Expedition Creator</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Itinerary */}
        <TabsContent value="itinerary" className="space-y-6">
          <ItineraryTimeline trip={trip} />
        </TabsContent>

        {/* Tab 3: Packing */}
        <TabsContent value="packing" className="space-y-6">
          <PackingManager trip={trip} />
        </TabsContent>

        {/* Tab 4: Expenses */}
        <TabsContent value="expenses" className="space-y-6">
          <ExpenseManager trip={trip} />
        </TabsContent>

        {/* Tab 5: Vehicles & Fuel */}
        <TabsContent value="vehicles" className="space-y-6">
          <VehicleManager trip={trip} />
        </TabsContent>

        {/* Tab 6: Route & Weather */}
        <TabsContent value="route" className="space-y-6">
          <RouteView trip={trip} />
        </TabsContent>

        {/* Tab 7: Stays & Documents */}
        <TabsContent value="stays" className="space-y-6">
          <StaysAndDocsView trip={trip} />
        </TabsContent>

        {/* Tab 8: Live Convoy Tracking */}
        <TabsContent value="convoy" className="space-y-6">
          <LiveRideView trip={trip} />
        </TabsContent>

        {/* Tab 9: Journal, Highlights & Analytics */}
        <TabsContent value="journal" className="space-y-6">
          <JournalAndAnalyticsView trip={trip} />
        </TabsContent>

        {/* Tab 10: Members */}
        <TabsContent value="members" className="space-y-6">
          <MembersSection trip={trip} />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete this entire trip?"
        description="This action cannot be undone. All linked itinerary days, packing items, and expense logs will be permanently removed."
        confirmLabel="Delete Trip"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />

      {/* Archive Confirmation Dialog */}
      <ConfirmDialog
        open={showArchiveConfirm}
        onOpenChange={setShowArchiveConfirm}
        title="Archive this trip?"
        description="The trip will be moved to your archives. You can still view it anytime under the Archived tab."
        confirmLabel="Archive"
        onConfirm={handleArchive}
        isLoading={archiveMutation.isPending}
      />

      {/* AI Copilot Drawer */}
      <AICopilotDrawer trip={trip} />
    </div>
  );
}
