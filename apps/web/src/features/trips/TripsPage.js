import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Compass, Plus, Search, Sparkles, X, } from 'lucide-react';
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
    const handleTabChange = (val) => {
        if (val === 'ALL') {
            searchParams.delete('status');
        }
        else {
            searchParams.set('status', val);
        }
        setSearchParams(searchParams);
    };
    // Filtered trips
    const filteredTrips = useMemo(() => {
        return allTrips.filter((trip) => {
            // Tab filter
            if (activeTab === TripStatus.PLANNED) {
                if (trip.status !== TripStatus.PLANNED && trip.status !== TripStatus.DRAFT)
                    return false;
            }
            else if (activeTab !== 'ALL' && trip.status !== activeTab) {
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
    return (_jsxs("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: [_jsxs(PageHeader, { title: "My Trips", description: "Organize, manage and explore your upcoming and past travel itineraries.", children: [_jsx(Button, { variant: "outline", className: "gap-2 rounded-xl", asChild: true, children: _jsxs(Link, { to: "/trips/new?mode=manual", children: [_jsx(Plus, { className: "h-4 w-4" }), _jsx("span", { children: "Create Trip" })] }) }), _jsx(Button, { variant: "gradient", className: "gap-2 rounded-xl shadow-md", asChild: true, children: _jsxs(Link, { to: "/trips/new", children: [_jsx(Sparkles, { className: "h-4 w-4" }), _jsx("span", { children: "Plan with AI" })] }) })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between", children: [_jsx("div", { className: "flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none", children: TABS.map((tab) => {
                            const isSelected = activeTab === tab.value;
                            return (_jsx("button", { onClick: () => handleTabChange(tab.value), className: `whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${isSelected
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}`, children: tab.label }, tab.value));
                        }) }), _jsxs("div", { className: "relative w-full sm:w-72 shrink-0", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), _jsx(Input, { value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search trips, places, tags...", className: "pl-9 pr-8 h-10 text-xs sm:text-sm" }), searchQuery && (_jsx("button", { onClick: () => setSearchQuery(''), className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", children: _jsx(X, { className: "h-3.5 w-3.5" }) }))] })] }), isLoading ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2", children: Array.from({ length: 6 }).map((_, i) => (_jsxs("div", { className: "rounded-2xl border border-border p-4 space-y-4", children: [_jsx(Skeleton, { className: "h-40 w-full rounded-xl" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-5 w-3/4" }), _jsx(Skeleton, { className: "h-4 w-1/2" })] }), _jsx(Skeleton, { className: "h-8 w-full rounded-lg" })] }, i))) })) : filteredTrips.length === 0 ? (_jsx(EmptyState, { icon: Compass, title: searchQuery ? 'No matching trips found' : `No ${activeTab.toLowerCase()} trips`, description: searchQuery
                    ? `We couldn't find any trips matching "${searchQuery}". Try different keywords or clear your search.`
                    : 'Create a new trip to start planning routes, booking stays, and packing gear.', actionLabel: searchQuery ? 'Clear Search' : 'Plan a New Trip', onAction: searchQuery ? () => setSearchQuery('') : () => (window.location.href = '/trips/new') })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2", children: filteredTrips.map((trip) => (_jsx(TripCard, { trip: trip }, trip.id))) }))] }));
}
//# sourceMappingURL=TripsPage.js.map