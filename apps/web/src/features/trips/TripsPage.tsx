import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Compass,
  Plus,
  Search,
  Sparkles,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { TripStatus } from '@waylo/shared';
import { useTrips } from './hooks';
import { TripCard } from '../dashboard/TripCard';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TABS = [
  { label: 'All Trips', value: 'ALL' },
  { label: 'Upcoming', value: TripStatus.PLANNED },
  { label: 'Ongoing', value: TripStatus.ONGOING },
  { label: 'Completed', value: TripStatus.COMPLETED },
  { label: 'Drafts', value: TripStatus.DRAFT },
  { label: 'Archived', value: TripStatus.ARCHIVED },
];

export function TripsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('status') || 'ALL';
  const [searchQuery, setSearchQuery] = useState('');

  const { data: response, isLoading } = useTrips();
  const allTrips = response?.data || [];

  const handleTabChange = (val: string) => {
    if (val === 'ALL') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', val);
    }
    setSearchParams(searchParams);
  };

  // Filtered trips
  const filteredTrips = useMemo(() => {
    return allTrips.filter((trip) => {
      // Tab filter
      if (activeTab === TripStatus.PLANNED) {
        if (trip.status !== TripStatus.PLANNED && trip.status !== TripStatus.DRAFT) return false;
      } else if (activeTab !== 'ALL' && trip.status !== activeTab) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = trip.name.toLowerCase().includes(query);
        const matchesDest = trip.destination?.toLowerCase().includes(query);
        const matchesTags = trip.tags?.some((t) => t.toLowerCase().includes(query));
        return matchesName || matchesDest || matchesTags;
      }

      return true;
    });
  }, [allTrips, activeTab, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <PageHeader
        title="My Trips"
        description="Organize, manage and explore your upcoming and past travel itineraries."
      >
        <Button variant="outline" className="gap-2 rounded-xl" asChild>
          <Link to="/trips/new?mode=manual">
            <Plus className="h-4 w-4" />
            <span>Create Trip</span>
          </Link>
        </Button>

        <Button variant="gradient" className="gap-2 rounded-xl shadow-md" asChild>
          <Link to="/trips/new">
            <Sparkles className="h-4 w-4" />
            <span>Plan with AI</span>
          </Link>
        </Button>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Horizontal scrollable tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {TABS.map((tab) => {
            const isSelected = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trips, places, tags..."
            className="pl-9 pr-8 h-10 text-xs sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of trips */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border p-4 space-y-4">
              <Skeleton className="h-40 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <EmptyState
          icon={Compass}
          title={searchQuery ? 'No matching trips found' : `No ${activeTab.toLowerCase()} trips`}
          description={
            searchQuery
              ? `We couldn't find any trips matching "${searchQuery}". Try different keywords or clear your search.`
              : 'Create a new trip to start planning routes, booking stays, and packing gear.'
          }
          actionLabel={searchQuery ? 'Clear Search' : 'Plan a New Trip'}
          onAction={searchQuery ? () => setSearchQuery('') : () => (window.location.href = '/trips/new')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
