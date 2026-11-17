import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Bike,
  Car,
  Plane,
  Train,
  Bus,
  Footprints,
  Ship,
  Users,
} from 'lucide-react';
import type { TripWithDetails, TransportMode } from '@waylo/shared';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDateRange, formatCurrency } from '@/lib/utils';

interface TripCardProps {
  trip: TripWithDetails;
}

const getTransportIcon = (mode: TransportMode) => {
  switch (mode) {
    case 'MOTORCYCLE' as any:
      return <span key={mode}><Bike className="h-3.5 w-3.5 text-blue-500" /></span>;
    case 'CAR' as any:
      return <span key={mode}><Car className="h-3.5 w-3.5 text-emerald-500" /></span>;
    case 'FLIGHT' as any:
      return <span key={mode}><Plane className="h-3.5 w-3.5 text-sky-500" /></span>;
    case 'TRAIN' as any:
      return <span key={mode}><Train className="h-3.5 w-3.5 text-purple-500" /></span>;
    case 'BUS' as any:
      return <span key={mode}><Bus className="h-3.5 w-3.5 text-amber-500" /></span>;
    case 'WALKING' as any:
      return <span key={mode}><Footprints className="h-3.5 w-3.5 text-teal-500" /></span>;
    case 'FERRY' as any:
      return <span key={mode}><Ship className="h-3.5 w-3.5 text-cyan-500" /></span>;
    default:
      return null;
  }
};

export function TripCard({ trip }: TripCardProps) {
  const members = trip.members || [];

  return (
    <Link to={`/trips/${trip.id}`} className="block group h-full">
      <Card className="overflow-hidden border border-border/80 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col rounded-2xl">
        {/* Cover Image / Gradient */}
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-tr from-slate-800 to-slate-900">
          {trip.coverImageUrl ? (
            <img
              src={trip.coverImageUrl}
              alt={trip.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center">
              <span className="text-white/40 text-4xl font-black">Waylo</span>
            </div>
          )}

          {/* Overlay Gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <StatusBadge status={trip.status} />
            {trip.estimatedBudget ? (
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
                {formatCurrency(trip.estimatedBudget, trip.currency)}
              </span>
            ) : null}
          </div>

          {/* Bottom Destination pill */}
          {trip.destination && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/90 font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 max-w-[90%] truncate">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{trip.destination}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-lg text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
              {trip.name}
            </h3>

            {trip.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                {trip.description}
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2 border-t border-border/60">
            {/* Dates & Modes */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
              </div>

              {trip.transportModes && trip.transportModes.length > 0 && (
                <div className="flex items-center gap-1 bg-muted/60 px-2 py-1 rounded-lg">
                  {trip.transportModes.map(getTransportIcon)}
                </div>
              )}
            </div>

            {/* Footer: Member avatars & counts */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2 overflow-hidden">
                  {members.slice(0, 3).map((m) => (
                    <Avatar key={m.id} className="h-6 w-6 ring-2 ring-card border-none">
                      {m.user.avatarUrl && <AvatarImage src={m.user.avatarUrl} alt={m.user.displayName} />}
                      <AvatarFallback className="text-[9px]">
                        {m.user.displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                {members.length > 3 && (
                  <span className="text-[10px] font-medium text-muted-foreground">
                    +{members.length - 3}
                  </span>
                )}
                {members.length === 0 && (
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Solo
                  </span>
                )}
              </div>

              {trip.tags && trip.tags.length > 0 && (
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md truncate max-w-[100px]">
                  #{trip.tags[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
