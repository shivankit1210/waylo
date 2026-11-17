import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  Compass,
  MapPin,
  Route,
  Users,
  Luggage,
  Calendar,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useTrips } from '@/features/trips/hooks';
import { TripStatus } from '@waylo/shared';
import { Button } from '@/components/ui/button';
import { TripCard } from './TripCard';
import { ActiveTripCard } from './ActiveTripCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function DashboardPage() {
  const { user } = useAuthStore();
  const { data: tripsResponse, isLoading } = useTrips();

  const trips = tripsResponse?.data || [];

  // Determine time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const activeTrip = trips.find((t) => t.status === TripStatus.ONGOING);
  const upcomingTrips = trips.filter(
    (t) => t.status === TripStatus.PLANNED || t.status === TripStatus.DRAFT
  );
  const completedTrips = trips.filter((t) => t.status === TripStatus.COMPLETED);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Top Greeting & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {getGreeting()}, {user?.displayName?.split(' ')[0] || 'Traveler'} ✈️
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Ready to explore? You have {upcomingTrips.length} upcoming trip{upcomingTrips.length === 1 ? '' : 's'}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="rounded-xl font-medium gap-2" asChild>
            <Link to="/trips">
              <Compass className="h-4 w-4" />
              <span>Browse All</span>
            </Link>
          </Button>

          <Button variant="gradient" className="rounded-xl font-semibold gap-2 shadow-md" asChild>
            <Link to="/plan-ai">
              <Sparkles className="h-4 w-4" />
              <span>Plan with AI</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Trips</p>
            <p className="text-2xl font-black text-foreground">{trips.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <Route className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Distance Tracked</p>
            <p className="text-2xl font-black text-foreground">3,420 km</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Destinations</p>
            <p className="text-2xl font-black text-foreground">12 Places</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Travel Pals</p>
            <p className="text-2xl font-black text-foreground">8 Friends</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading your trips..." />
      ) : trips.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No trips created yet"
          description="Plan your next road trip, solo escape, or group getaway with our AI trip planner."
          actionLabel="Start Planning Your First Trip"
          onAction={() => (window.location.href = '/trips/new')}
        />
      ) : (
        <div className="space-y-10">
          {/* Active Trip Hero Banner if ongoing */}
          {activeTrip && (
            <div className="space-y-3">
              <ActiveTripCard trip={activeTrip} />
            </div>
          )}

          {/* Upcoming Trips */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Upcoming Adventures
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Trips planned and ready to roll
                </p>
              </div>

              {upcomingTrips.length > 0 && (
                <Link
                  to="/trips"
                  className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View all ({upcomingTrips.length})
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            {upcomingTrips.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card/40">
                <p className="text-sm text-muted-foreground mb-3">No upcoming trips scheduled right now.</p>
                <Button size="sm" asChild variant="outline">
                  <Link to="/trips/new">
                    <Plus className="h-3.5 w-3.5 mr-1" /> Plan Next Trip
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </div>

          {/* Past / Completed Trips */}
          {completedTrips.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Memories & Completed Journeys
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Relive past itineraries and logged expenses
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
