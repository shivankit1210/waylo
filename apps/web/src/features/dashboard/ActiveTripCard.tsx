import { Link } from 'react-router-dom';
import {
  CalendarDays,
  MapPin,
  Sparkles,
  ArrowRight,
  Luggage,
  Receipt,
  CarFront,
  Clock,
  Compass,
} from 'lucide-react';
import type { TripWithDetails } from '@waylo/shared';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDateRange, formatCurrency } from '@/lib/utils';

interface ActiveTripCardProps {
  trip: TripWithDetails;
}

export function ActiveTripCard({ trip }: ActiveTripCardProps) {
  const members = trip.members || [];

  return (
    <Card className="relative overflow-hidden border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-2xl rounded-3xl p-6 sm:p-8">
      {/* Background image subtle overlay */}
      {trip.coverImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url(${trip.coverImageUrl})` }}
        />
      )}

      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
          Active Ongoing Expedition
        </div>

        <div className="flex items-center gap-2">
          {trip.estimatedBudget && (
            <span className="text-xs font-semibold text-muted-foreground bg-muted/80 px-3 py-1.5 rounded-xl border border-border">
              Budget: {formatCurrency(trip.estimatedBudget, trip.currency)}
            </span>
          )}
        </div>
      </div>

      {/* Middle Content */}
      <div className="grid lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            {trip.name}
          </h2>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground">
            {trip.destination && (
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {trip.destination}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </span>
          </div>

          {trip.description && (
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              {trip.description}
            </p>
          )}

          {/* Members */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2.5 overflow-hidden">
              {members.map((m) => (
                <Avatar key={m.id} className="h-8 w-8 ring-2 ring-background">
                  {m.user.avatarUrl && <AvatarImage src={m.user.avatarUrl} alt={m.user.displayName} />}
                  <AvatarFallback className="text-xs">
                    {m.user.displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {members.length} {members.length === 1 ? 'member' : 'travelers'} on road
            </span>
          </div>
        </div>

        {/* Quick Hub Actions */}
        <div className="bg-background/80 backdrop-blur-md p-5 rounded-2xl border border-border/80 space-y-3 shadow-inner">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-primary" />
            Live Trip Navigator
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              to={`/trips/${trip.id}?tab=itinerary`}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 hover:bg-muted font-medium transition-colors"
            >
              <CalendarDays className="h-4 w-4 text-blue-500" />
              <span>Itinerary</span>
            </Link>
            <Link
              to={`/trips/${trip.id}?tab=vehicle`}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 hover:bg-muted font-medium transition-colors"
            >
              <CarFront className="h-4 w-4 text-emerald-500" />
              <span>Vehicles</span>
            </Link>
            <Link
              to={`/trips/${trip.id}?tab=packing`}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 hover:bg-muted font-medium transition-colors"
            >
              <Luggage className="h-4 w-4 text-amber-500" />
              <span>Packing</span>
            </Link>
            <Link
              to={`/trips/${trip.id}?tab=expenses`}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 hover:bg-muted font-medium transition-colors"
            >
              <Receipt className="h-4 w-4 text-purple-500" />
              <span>Expenses</span>
            </Link>
          </div>

          <Button asChild className="w-full rounded-xl gap-2 mt-2" variant="gradient">
            <Link to={`/trips/${trip.id}`}>
              <span>Open Trip Central</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
