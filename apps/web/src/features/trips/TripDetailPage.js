import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Copy, Edit, Trash2, Archive, ArrowLeft, Sparkles, Users, Luggage, CalendarDays, Receipt, Compass, Gauge, Hotel, Radio, BookOpen, } from 'lucide-react';
import { TripStatus } from '@waylo/shared';
import { useTrip, useDeleteTrip, useDuplicateTrip, useUpdateTripStatus, useArchiveTrip, } from './hooks';
import { useAuthStore } from '@/stores/authStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MembersSection } from './MembersSection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDateRange, formatCurrency } from '@/lib/utils';
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
    const { tripId } = useParams();
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
    const handleTabChange = (val) => {
        searchParams.set('tab', val);
        setSearchParams(searchParams);
    };
    const handleDelete = async () => {
        if (!tripId)
            return;
        try {
            await deleteMutation.mutateAsync(tripId);
            navigate('/trips');
        }
        catch {
            // Toast handled
        }
    };
    const handleDuplicate = async () => {
        if (!tripId)
            return;
        try {
            const duplicated = await duplicateMutation.mutateAsync(tripId);
            navigate(`/trips/${duplicated.id}`);
        }
        catch {
            // Toast handled
        }
    };
    const handleArchive = async () => {
        if (!tripId)
            return;
        try {
            await archiveMutation.mutateAsync(tripId);
            setShowArchiveConfirm(false);
        }
        catch {
            // Toast handled
        }
    };
    const handleStatusChange = async (nextStatus) => {
        if (!tripId)
            return;
        await statusMutation.mutateAsync({ tripId, status: nextStatus });
    };
    if (isLoading) {
        return _jsx(LoadingSpinner, { text: "Loading expedition details..." });
    }
    if (!trip) {
        return (_jsxs("div", { className: "text-center py-16 space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Trip not found" }), _jsx("p", { className: "text-muted-foreground", children: "The trip you requested does not exist or was removed." }), _jsx(Button, { onClick: () => navigate('/trips'), children: "Back to My Trips" })] }));
    }
    return (_jsxs("div", { className: "space-y-8 animate-in fade-in-50 duration-300 pb-12", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate('/trips'), className: "gap-2 w-fit -ml-2 text-muted-foreground hover:text-foreground", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), _jsx("span", { children: "Back to Trips" })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [isOwner && (_jsx(Button, { variant: "outline", size: "sm", asChild: true, className: "gap-1.5 rounded-xl text-xs font-semibold", children: _jsxs(Link, { to: `/trips/${trip.id}/edit`, children: [_jsx(Edit, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Edit" })] }) })), _jsxs(Button, { variant: "outline", size: "sm", onClick: handleDuplicate, disabled: duplicateMutation.isPending, className: "gap-1.5 rounded-xl text-xs font-semibold", children: [_jsx(Copy, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Duplicate" })] }), isOwner && (_jsxs(_Fragment, { children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => setShowArchiveConfirm(true), className: "gap-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground", children: [_jsx(Archive, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Archive" })] }), _jsxs(Button, { variant: "destructive", size: "sm", onClick: () => setShowDeleteConfirm(true), className: "gap-1.5 rounded-xl text-xs font-semibold", children: [_jsx(Trash2, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Delete" })] })] }))] })] }), _jsx("div", { className: "relative overflow-hidden rounded-3xl bg-slate-900 border border-border/80 shadow-2xl", children: _jsxs("div", { className: "relative h-64 sm:h-80 w-full overflow-hidden", children: [trip.coverImageUrl ? (_jsx("img", { src: trip.coverImageUrl, alt: trip.name, className: "h-full w-full object-cover" })) : (_jsx("div", { className: "h-full w-full bg-gradient-to-tr from-blue-700 via-indigo-800 to-sky-600" })), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" }), _jsxs("div", { className: "absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(StatusBadge, { status: trip.status }), trip.tags && trip.tags.length > 0 && (_jsx("div", { className: "flex gap-1.5", children: trip.tags.map((t) => (_jsxs("span", { className: "px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-[11px] font-semibold tracking-wide border border-white/10", children: ["#", t] }, t))) }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h1", { className: "text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight", children: trip.name }), trip.description && (_jsx("p", { className: "text-xs sm:text-sm text-slate-300 max-w-2xl line-clamp-2 leading-relaxed", children: trip.description })), _jsxs("div", { className: "flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-2", children: [trip.destination && (_jsxs("span", { className: "flex items-center gap-1.5 font-medium text-white", children: [_jsx(MapPin, { className: "h-4 w-4 text-primary" }), trip.destination] })), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { className: "h-4 w-4 text-slate-400" }), formatDateRange(trip.startDate, trip.endDate)] })] })] })] })] }) }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-4 rounded-2xl border border-border/80 bg-card shadow-sm", children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: "Budget Target" }), _jsx("p", { className: "text-xl font-bold text-foreground", children: formatCurrency(trip.estimatedBudget, trip.currency) })] }), _jsxs("div", { className: "p-4 rounded-2xl border border-border/80 bg-card shadow-sm", children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: "Trip Type" }), _jsx("p", { className: "text-xl font-bold text-foreground capitalize", children: trip.tripType.replace(/_/g, ' ').toLowerCase() })] }), _jsxs("div", { className: "p-4 rounded-2xl border border-border/80 bg-card shadow-sm", children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: "Travel Crew" }), _jsxs("p", { className: "text-xl font-bold text-foreground", children: [trip.members?.length || 1, " Members"] })] }), _jsxs("div", { className: "p-4 rounded-2xl border border-border/80 bg-card shadow-sm", children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: "Status Transition" }), _jsxs("select", { value: trip.status, onChange: (e) => handleStatusChange(e.target.value), className: "w-full bg-transparent font-semibold text-sm text-primary focus:outline-none cursor-pointer", children: [_jsx("option", { value: TripStatus.DRAFT, children: "Draft" }), _jsx("option", { value: TripStatus.PLANNED, children: "Planned" }), _jsx("option", { value: TripStatus.ONGOING, children: "Ongoing (Live)" }), _jsx("option", { value: TripStatus.COMPLETED, children: "Completed" }), _jsx("option", { value: TripStatus.CANCELLED, children: "Cancelled" }), _jsx("option", { value: TripStatus.ARCHIVED, children: "Archived" })] })] })] }), _jsxs(Tabs, { value: activeTab, onValueChange: handleTabChange, className: "space-y-6", children: [_jsxs(TabsList, { className: "w-full justify-start overflow-x-auto p-1.5 h-auto rounded-2xl bg-muted/60", children: [_jsxs(TabsTrigger, { value: "overview", className: "gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold", children: [_jsx(Compass, { className: "h-4 w-4" }), _jsx("span", { children: "Overview" })] }), _jsxs(TabsTrigger, { value: "itinerary", className: "gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold", children: [_jsx(CalendarDays, { className: "h-4 w-4" }), _jsx("span", { children: "Itinerary" })] }), _jsxs(TabsTrigger, { value: "packing", className: "gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold", children: [_jsx(Luggage, { className: "h-4 w-4" }), _jsx("span", { children: "Packing List" })] }), _jsxs(TabsTrigger, { value: "expenses", className: "gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold", children: [_jsx(Receipt, { className: "h-4 w-4" }), _jsx("span", { children: "Expenses & Split" })] }), _jsxs(TabsTrigger, { value: "vehicles", className: "gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold", children: [_jsx(Gauge, { className: "h-4 w-4" }), _jsx("span", { children: "Vehicles & Fuel" })] }), _jsxs(TabsTrigger, { value: "route", className: "gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold", children: [_jsx(Compass, { className: "h-4 w-4" }), _jsx("span", { children: "Route & Weather" })] }), _jsxs(TabsTrigger, { value: "stays", className: "gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold", children: [_jsx(Hotel, { className: "h-4 w-4" }), _jsx("span", { children: "Stays & Docs" })] }), _jsxs(TabsTrigger, { value: "convoy", className: "gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold", children: [_jsx(Radio, { className: "h-4 w-4 text-emerald-500 animate-pulse" }), _jsx("span", { children: "Live Convoy" })] }), _jsxs(TabsTrigger, { value: "journal", className: "gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold", children: [_jsx(BookOpen, { className: "h-4 w-4 text-amber-500" }), _jsx("span", { children: "Journal & Analytics" })] }), _jsxs(TabsTrigger, { value: "members", className: "gap-2 rounded-xl py-2 px-4 text-xs sm:text-sm font-semibold", children: [_jsx(Users, { className: "h-4 w-4" }), _jsxs("span", { children: ["Members (", trip.members?.length || 1, ")"] })] })] }), _jsx(TabsContent, { value: "overview", className: "space-y-6", children: _jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "md:col-span-2 space-y-6", children: [_jsxs(Card, { className: "p-6 rounded-3xl border-border/80 space-y-4", children: [_jsx("h3", { className: "font-bold text-lg text-foreground", children: "Trip Summary & Details" }), _jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: trip.description || 'No detailed description provided for this trip yet.' }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-4 pt-4 border-t border-border/60 text-xs", children: [_jsxs("div", { children: [_jsx("span", { className: "font-semibold text-muted-foreground block mb-1", children: "Starting Origin" }), _jsx("span", { className: "text-foreground font-medium text-sm", children: trip.startLocation || 'Not specified' })] }), _jsxs("div", { children: [_jsx("span", { className: "font-semibold text-muted-foreground block mb-1", children: "Primary Destination" }), _jsx("span", { className: "text-foreground font-medium text-sm", children: trip.destination || 'Not specified' })] }), _jsxs("div", { children: [_jsx("span", { className: "font-semibold text-muted-foreground block mb-1", children: "End Point" }), _jsx("span", { className: "text-foreground font-medium text-sm", children: trip.returnLocation || 'Same as origin' })] }), _jsxs("div", { children: [_jsx("span", { className: "font-semibold text-muted-foreground block mb-1", children: "Visibility" }), _jsx("span", { className: "text-foreground font-medium text-sm capitalize", children: trip.visibility.replace(/_/g, ' ').toLowerCase() })] })] })] }), _jsxs(Card, { className: "p-6 rounded-3xl border-primary/30 bg-primary/5 space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Sparkles, { className: "h-5 w-5 text-primary" }), _jsx("h4", { className: "font-bold text-base text-foreground", children: "AI Travel Copilot Tips" })] }), _jsxs("p", { className: "text-xs sm:text-sm text-muted-foreground leading-relaxed", children: ["Based on your destination in ", trip.destination || 'the hills', ", pack rainproof outer layers, keep offline GPS maps downloaded, and plan fuel refills before remote passes."] })] })] }), _jsx("div", { className: "space-y-6", children: _jsxs(Card, { className: "p-6 rounded-3xl border-border/80 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "font-bold text-sm text-foreground", children: "Trip Organizers" }), _jsx(Link, { to: `/trips/${trip.id}?tab=members`, className: "text-xs font-semibold text-primary hover:underline", children: "Manage" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs", children: trip.owner?.displayName?.slice(0, 2).toUpperCase() || 'OW' }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-sm text-foreground", children: trip.owner?.displayName || 'Lead Traveler' }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Expedition Creator" })] })] })] }) })] }) }), _jsx(TabsContent, { value: "itinerary", className: "space-y-6", children: _jsx(ItineraryTimeline, { trip: trip }) }), _jsx(TabsContent, { value: "packing", className: "space-y-6", children: _jsx(PackingManager, { trip: trip }) }), _jsx(TabsContent, { value: "expenses", className: "space-y-6", children: _jsx(ExpenseManager, { trip: trip }) }), _jsx(TabsContent, { value: "vehicles", className: "space-y-6", children: _jsx(VehicleManager, { trip: trip }) }), _jsx(TabsContent, { value: "route", className: "space-y-6", children: _jsx(RouteView, { trip: trip }) }), _jsx(TabsContent, { value: "stays", className: "space-y-6", children: _jsx(StaysAndDocsView, { trip: trip }) }), _jsx(TabsContent, { value: "convoy", className: "space-y-6", children: _jsx(LiveRideView, { trip: trip }) }), _jsx(TabsContent, { value: "journal", className: "space-y-6", children: _jsx(JournalAndAnalyticsView, { trip: trip }) }), _jsx(TabsContent, { value: "members", className: "space-y-6", children: _jsx(MembersSection, { trip: trip }) })] }), _jsx(ConfirmDialog, { open: showDeleteConfirm, onOpenChange: setShowDeleteConfirm, title: "Delete this entire trip?", description: "This action cannot be undone. All linked itinerary days, packing items, and expense logs will be permanently removed.", confirmLabel: "Delete Trip", variant: "destructive", onConfirm: handleDelete, isLoading: deleteMutation.isPending }), _jsx(ConfirmDialog, { open: showArchiveConfirm, onOpenChange: setShowArchiveConfirm, title: "Archive this trip?", description: "The trip will be moved to your archives. You can still view it anytime under the Archived tab.", confirmLabel: "Archive", onConfirm: handleArchive, isLoading: archiveMutation.isPending }), _jsx(AICopilotDrawer, { trip: trip })] }));
}
//# sourceMappingURL=TripDetailPage.js.map