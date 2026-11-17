import { useState, useMemo } from 'react';
import type { TripWithDetails, ItineraryItem, ItineraryItemType } from '@waylo/shared';
import {
  useItinerary,
  useToggleItemComplete,
  useDeleteItem,
  useDeleteDay,
  useReorderItems,
} from '../hooks';
import { CreateDayDialog } from './CreateDayDialog';
import { EditDayDialog } from './EditDayDialog';
import { CreateItemDialog } from './CreateItemDialog';
import { EditItemDialog } from './EditItemDialog';
import { BatchGenerateDialog } from './BatchGenerateDialog';
import { AIGenerateDaysDialog } from '../../ai/AIGenerateDaysDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  CalendarDays,
  Clock,
  MapPin,
  Navigation,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Circle,
  Camera,
  UtensilsCrossed,
  Fuel,
  Coffee,
  Hotel,
  Compass,
  AlertCircle,
  HelpCircle,
  Layers,
  Calendar,
} from 'lucide-react';

interface ItineraryTimelineProps {
  trip: TripWithDetails;
}

// Map itemType to icon & style
const getItemTypeMeta = (type: ItineraryItemType) => {
  switch (type) {
    case 'MEAL':
      return {
        icon: UtensilsCrossed,
        label: 'Food / Meal',
        bgColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        dotColor: 'bg-amber-500',
      };
    case 'FUEL_STOP':
      return {
        icon: Fuel,
        label: 'Fuel / Charging',
        bgColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        dotColor: 'bg-rose-500',
      };
    case 'REST':
      return {
        icon: Coffee,
        label: 'Rest Break',
        bgColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
        dotColor: 'bg-orange-500',
      };
    case 'SIGHTSEEING':
      return {
        icon: Camera,
        label: 'Sightseeing',
        bgColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
        dotColor: 'bg-sky-500',
      };
    case 'CHECK_IN':
    case 'CHECK_OUT':
      return {
        icon: Hotel,
        label: 'Accommodation',
        bgColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        dotColor: 'bg-indigo-500',
      };
    case 'TRAVEL':
      return {
        icon: Navigation,
        label: 'Scenic Ride / Route',
        bgColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
        dotColor: 'bg-teal-500',
      };
    default:
      return {
        icon: Compass,
        label: 'Activity',
        bgColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        dotColor: 'bg-blue-500',
      };
  }
};

export function ItineraryTimeline({ trip }: ItineraryTimelineProps) {
  const { data: days = [], isLoading } = useItinerary(trip.id);
  const toggleCompleteMutation = useToggleItemComplete(trip.id);
  const deleteItemMutation = useDeleteItem(trip.id);
  const deleteDayMutation = useDeleteDay(trip.id);
  const reorderMutation = useReorderItems(trip.id);

  // Active day selection
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'TIMELINE' | 'LIST'>('TIMELINE');

  // Dialog states
  const [isCreateDayOpen, setIsCreateDayOpen] = useState(false);
  const [isEditDayOpen, setIsEditDayOpen] = useState(false);
  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);

  // Active day object
  const activeDay = useMemo(() => {
    if (!days || days.length === 0) return null;
    return days.find((d) => d.dayNumber === selectedDayNumber) || days[0];
  }, [days, selectedDayNumber]);

  // Filtered items
  const activeItems = useMemo(() => {
    if (!activeDay || !activeDay.items) return [];
    if (filterType === 'ALL') return activeDay.items;
    return activeDay.items.filter((item) => item.itemType === filterType);
  }, [activeDay, filterType]);

  // Reorder Item Up/Down handler
  const handleMoveItem = async (index: number, direction: 'UP' | 'DOWN') => {
    if (!activeDay || !activeDay.items) return;
    const items = [...activeDay.items];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= items.length) return;

    // Swap
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    const payload = items.map((it, idx) => ({ id: it.id, orderIndex: idx }));
    try {
      await reorderMutation.mutateAsync({ dayId: activeDay.id, items: payload });
    } catch {
      toast.error('Failed to reorder items');
    }
  };

  const handleDeleteDay = async () => {
    if (!activeDay) return;
    if (!window.confirm(`Delete Day ${activeDay.dayNumber}? All stops inside will be removed.`)) {
      return;
    }

    try {
      await deleteDayMutation.mutateAsync(activeDay.id);
      toast.success(`Day ${activeDay.dayNumber} deleted`);
      setSelectedDayNumber(1);
    } catch {
      toast.error('Failed to delete day');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!activeDay) return;
    try {
      await deleteItemMutation.mutateAsync({ dayId: activeDay.id, itemId });
      toast.success('Stop removed from itinerary');
    } catch {
      toast.error('Failed to remove stop');
    }
  };

  const handleToggleComplete = async (itemId: string) => {
    if (!activeDay) return;
    try {
      await toggleCompleteMutation.mutateAsync({ dayId: activeDay.id, itemId });
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <Card className="p-12 text-center rounded-3xl border-border/80">
        <div className="animate-spin h-8 w-8 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-muted-foreground font-medium">Loading itinerary days & stops...</p>
      </Card>
    );
  }

  // Empty state when trip has 0 days
  if (!days || days.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="p-8 sm:p-12 rounded-3xl border-border/80 text-center space-y-5 bg-card/60 backdrop-blur-sm">
          <div className="h-16 w-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-inner">
            <CalendarDays className="h-8 w-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-2xl font-black text-foreground tracking-tight">
              No Itinerary Planned Yet
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Build your route day-by-day with planned departure times, scenic rest stops, fuel stops, and attractions.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="gradient"
              onClick={() => setIsAIOpen(true)}
              className="gap-2 rounded-2xl shadow-lg shadow-primary/20 font-semibold"
            >
              <Sparkles className="h-4 w-4" />
              Craft Itinerary with AI
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsBatchOpen(true)}
              className="gap-2 rounded-2xl font-semibold"
            >
              <Layers className="h-4 w-4" />
              Auto-Generate Days from Dates
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsCreateDayOpen(true)}
              className="gap-2 rounded-2xl font-semibold"
            >
              <Plus className="h-4 w-4" />
              Add Day 1 Manually
            </Button>
          </div>
        </Card>

        <CreateDayDialog
          tripId={trip.id}
          nextDayNumber={1}
          tripStartDate={trip.startDate}
          open={isCreateDayOpen}
          onOpenChange={setIsCreateDayOpen}
          onSuccess={(num) => setSelectedDayNumber(num)}
        />

        <BatchGenerateDialog
          trip={trip}
          open={isBatchOpen}
          onOpenChange={setIsBatchOpen}
          onSuccess={() => setSelectedDayNumber(1)}
        />

        <AIGenerateDaysDialog
          trip={trip}
          open={isAIOpen}
          onOpenChange={setIsAIOpen}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Day Selector Pills & Top Action Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {days.map((day) => {
            const isSelected = activeDay?.id === day.id;
            const completedCount = day.items?.filter((i) => i.isCompleted).length || 0;
            const totalCount = day.items?.length || 0;

            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayNumber(day.dayNumber)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]'
                    : 'bg-card border border-border/80 text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                <span>Day {day.dayNumber}</span>
                {totalCount > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {completedCount}/{totalCount}
                  </span>
                )}
              </button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateDayOpen(true)}
            className="rounded-2xl gap-1.5 text-xs font-semibold h-9 px-3 shrink-0"
          >
            <Plus className="h-3.5 w-3.5 text-primary" />
            <span>Add Day</span>
          </Button>
        </div>

        {/* View Mode & Auto-generate button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex bg-muted/60 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setViewMode('TIMELINE')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'TIMELINE' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'LIST' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              List View
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAIOpen(true)}
            className="rounded-xl text-xs gap-1.5 text-primary hover:bg-primary/10 font-semibold"
            title="Craft itinerary with AI"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI Plan</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsBatchOpen(true)}
            className="rounded-xl text-xs gap-1.5 text-muted-foreground hover:text-primary"
            title="Auto-generate or extend days"
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Batch Days</span>
          </Button>
        </div>
      </div>

      {activeDay && (
        <div className="space-y-6">
          {/* ─── Active Day Header & Route Summary Card ─── */}
          <Card className="p-6 rounded-3xl border-border/80 bg-gradient-to-br from-card via-card to-primary/5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <Badge variant="secondary" className="font-bold text-xs">
                    Day {activeDay.dayNumber}
                  </Badge>
                  {activeDay.date && (
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(activeDay.date).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-1">
                  {activeDay.title || `Day ${activeDay.dayNumber} Expedition`}
                </h3>
              </div>

              {/* Day Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditDayOpen(true)}
                  className="rounded-xl text-xs gap-1.5 h-9 font-medium"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit Day</span>
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => setIsCreateItemOpen(true)}
                  className="rounded-xl text-xs gap-1.5 h-9 font-semibold shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Stop / Activity</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteDay}
                  className="rounded-xl h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                  title="Delete Day"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Route & Timings Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/60 text-xs">
              {/* Waypoints */}
              <div className="col-span-2 sm:col-span-1">
                <span className="text-muted-foreground font-medium block text-[11px]">
                  Daily Route
                </span>
                <span className="font-bold text-foreground text-sm flex items-center gap-1.5 truncate mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  {activeDay.startLocation || 'Start'} ➔ {activeDay.endLocation || 'End'}
                </span>
              </div>

              {/* Timings (Planned vs Actual) */}
              <div>
                <span className="text-muted-foreground font-medium block text-[11px]">
                  Planned Schedule
                </span>
                <span className="font-bold text-foreground text-sm flex items-center gap-1 mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  {activeDay.plannedDeparture || '08:00'} - {activeDay.plannedArrival || '18:00'}
                </span>
              </div>

              {/* Actual Timing Status */}
              <div>
                <span className="text-muted-foreground font-medium block text-[11px]">
                  Actual Logged
                </span>
                <span
                  className={`font-bold text-sm mt-0.5 block ${
                    activeDay.actualDeparture
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-muted-foreground font-normal'
                  }`}
                >
                  {activeDay.actualDeparture
                    ? `${activeDay.actualDeparture} - ${activeDay.actualArrival || 'En-route'}`
                    : 'Not departed yet'}
                </span>
              </div>

              {/* Distance */}
              <div>
                <span className="text-muted-foreground font-medium block text-[11px]">
                  Distance (km)
                </span>
                <span className="font-bold text-foreground text-sm mt-0.5 block">
                  {activeDay.actualDistanceKm
                    ? `${activeDay.actualDistanceKm} km actual`
                    : activeDay.plannedDistanceKm
                    ? `${activeDay.plannedDistanceKm} km planned`
                    : 'Unmeasured'}
                </span>
              </div>
            </div>

            {/* Briefing notes if any */}
            {activeDay.notes && (
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{activeDay.notes}</span>
              </div>
            )}
          </Card>

          {/* ─── Category Filter Pills ─── */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-muted-foreground font-semibold mr-1 flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" /> Filter:
            </span>
            {['ALL', 'SIGHTSEEING', 'MEAL', 'FUEL_STOP', 'ACTIVITY', 'CHECK_IN', 'TRAVEL'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterType(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    filterType === cat
                      ? 'bg-foreground text-background shadow-sm'
                      : 'bg-card border border-border/70 text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat === 'ALL'
                    ? 'All Stops'
                    : cat === 'FUEL_STOP'
                    ? 'Fuel'
                    : cat === 'CHECK_IN'
                    ? 'Stays'
                    : cat.charAt(0) + cat.slice(1).toLowerCase()}
                </button>
              )
            )}
          </div>

          {/* ─── Stops & Activities Timeline View ─── */}
          {activeItems.length === 0 ? (
            <Card className="p-8 rounded-3xl border-dashed border-2 border-border/80 text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-muted text-muted-foreground mx-auto flex items-center justify-center">
                <HelpCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                No stops added to Day {activeDay.dayNumber} yet
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Add morning breakfast, scenic mountain passes, fuel refills, or hotel check-ins.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreateItemOpen(true)}
                className="rounded-xl gap-1.5 text-xs font-semibold mt-2"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                Add First Stop
              </Button>
            </Card>
          ) : (
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border/80">
              {activeItems.map((item, index) => {
                const meta = getItemTypeMeta(item.itemType);
                const Icon = meta.icon;

                return (
                  <div key={item.id} className="relative group">
                    {/* Timeline Node Point */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-4 h-6 w-6 rounded-full border-2 border-background flex items-center justify-center transition-all ${
                        item.isCompleted
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : `${meta.dotColor} text-white shadow-sm group-hover:scale-110`
                      }`}
                    >
                      {item.isCompleted ? (
                        <CheckCircle className="h-3.5 w-3.5" />
                      ) : (
                        <span className="text-[10px] font-bold">{index + 1}</span>
                      )}
                    </div>

                    {/* Card */}
                    <Card
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                        item.isCompleted
                          ? 'bg-muted/30 border-border/60 opacity-80'
                          : 'bg-card border-border/80 hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        {/* Main Content */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Type Pill */}
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${meta.bgColor}`}
                            >
                              <Icon className="h-3 w-3" />
                              {meta.label}
                            </span>

                            {/* Time Window */}
                            {(item.startTime || item.endTime) && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-foreground/80 bg-muted px-2 py-0.5 rounded-md">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                {item.startTime || '--:--'}
                                {item.endTime ? ` - ${item.endTime}` : ''}
                              </span>
                            )}

                            {/* Fixed vs Flexible Badge */}
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                item.flexibility === 'FIXED'
                                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                                  : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {item.flexibility}
                            </span>

                            {/* Optional Stop Tag */}
                            {item.isOptional && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                Optional Stop
                              </span>
                            )}

                            {/* Cost Tag */}
                            {Boolean(item.cost && item.cost > 0) && (
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                ₹{item.cost?.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <h4
                            className={`text-base font-bold text-foreground pt-1 ${
                              item.isCompleted ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            {item.title}
                          </h4>

                          {/* Location */}
                          {item.location && (
                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                              <span>{item.location}</span>
                            </p>
                          )}

                          {/* Description / Notes */}
                          {(item.description || item.notes) && (
                            <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                              {item.description || item.notes}
                            </p>
                          )}
                        </div>

                        {/* Actions Strip */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                          {/* Completion Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleComplete(item.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              item.isCompleted
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                          >
                            {item.isCompleted ? (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                <span>Completed</span>
                              </>
                            ) : (
                              <>
                                <Circle className="h-4 w-4" />
                                <span>Mark Done</span>
                              </>
                            )}
                          </button>

                          {/* Reordering and Edit / Delete buttons */}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            {/* Move Up */}
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveItem(index, 'UP')}
                              className="p-1 rounded-lg hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
                              title="Move stop earlier"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>

                            {/* Move Down */}
                            <button
                              type="button"
                              disabled={index === activeItems.length - 1}
                              onClick={() => handleMoveItem(index, 'DOWN')}
                              className="p-1 rounded-lg hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
                              title="Move stop later"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => setEditingItem(item)}
                              className="p-1 rounded-lg hover:bg-muted hover:text-primary"
                              title="Edit stop"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1 rounded-lg hover:bg-muted hover:text-destructive"
                              title="Delete stop"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── Modals ─── */}
      <CreateDayDialog
        tripId={trip.id}
        nextDayNumber={(days?.length || 0) + 1}
        tripStartDate={trip.startDate}
        open={isCreateDayOpen}
        onOpenChange={setIsCreateDayOpen}
        onSuccess={(num) => setSelectedDayNumber(num)}
      />

      {activeDay && (
        <>
          <EditDayDialog
            tripId={trip.id}
            day={activeDay}
            open={isEditDayOpen}
            onOpenChange={setIsEditDayOpen}
          />

          <CreateItemDialog
            tripId={trip.id}
            dayId={activeDay.id}
            dayNumber={activeDay.dayNumber}
            open={isCreateItemOpen}
            onOpenChange={setIsCreateItemOpen}
            nextOrderIndex={activeDay.items?.length || 0}
          />

          <EditItemDialog
            tripId={trip.id}
            dayId={activeDay.id}
            item={editingItem}
            open={Boolean(editingItem)}
            onOpenChange={(op) => !op && setEditingItem(null)}
          />
        </>
      )}

      <BatchGenerateDialog
        trip={trip}
        open={isBatchOpen}
        onOpenChange={setIsBatchOpen}
        onSuccess={() => setSelectedDayNumber(1)}
      />

      <AIGenerateDaysDialog
        trip={trip}
        open={isAIOpen}
        onOpenChange={setIsAIOpen}
      />
    </div>
  );
}
