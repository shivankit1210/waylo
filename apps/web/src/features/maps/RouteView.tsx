import {
  Compass,
  MapPin,
  Clock,
  Milestone,
  ExternalLink,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useTripRoute } from './hooks';
import { InteractiveMap } from './InteractiveMap';
import { WeatherWidget } from './WeatherWidget';
import type { TripWithDetails, RouteWaypoint } from '@waylo/shared';

interface RouteViewProps {
  trip: TripWithDetails | any;
}

export function RouteView({ trip }: RouteViewProps) {
  const { data, isLoading } = useTripRoute(trip.id);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const route = data?.route;
  const weather = data?.weather;
  const waypoints = route?.waypoints || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Compass className="h-6 w-6 text-primary" />
            Route Map & Weather Forecast
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore your itinerary waypoints on OpenStreetMap with real-time weather advisories.
          </p>
        </div>

        {/* External Google Maps / OpenStreetMap direct link button */}
        {trip.startLocation && trip.destination && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl text-xs font-semibold"
            asChild
          >
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                trip.startLocation
              )}&destination=${encodeURIComponent(trip.destination)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open in Google Maps
            </a>
          </Button>
        )}
      </div>

      {/* Top Route Stats KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 rounded-2xl border-border/80 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Milestone className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground block">
              Total Route Distance
            </span>
            <span className="text-lg font-black text-foreground">
              {route?.distanceKm ? `${route.distanceKm} km` : 'Calculating...'}
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl border-border/80 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground block">
              Est. Drive Time
            </span>
            <span className="text-lg font-black text-foreground">
              {route?.durationMinutes
                ? `${Math.floor(route.durationMinutes / 60)}h ${route.durationMinutes % 60}m`
                : 'En-route'}
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl border-border/80 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground block">
              Route Waypoints
            </span>
            <span className="text-lg font-black text-foreground">
              {waypoints.length} stops
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl border-border/80 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground block">
              Destination
            </span>
            <span className="text-sm font-bold text-foreground truncate block max-w-[120px]">
              {trip.destination || 'Unset'}
            </span>
          </div>
        </Card>
      </div>

      {/* Main Map Component */}
      <InteractiveMap route={route} className="h-[480px]" />

      {/* Weather Forecast Section */}
      <WeatherWidget weather={weather} />

      {/* Waypoints Sequence Timeline */}
      {waypoints.length > 0 && (
        <Card className="p-6 rounded-3xl border-border/80 space-y-4">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <Milestone className="h-4 w-4 text-primary" />
            Route Stops & Waypoint Sequence
          </h3>

          <div className="space-y-3">
            {waypoints.map((wp: RouteWaypoint, idx: number) => {
              const isOrigin = idx === 0;
              const isDestination = idx === waypoints.length - 1;

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-muted/30 border border-border/70 flex items-center justify-between gap-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isOrigin
                          ? 'bg-blue-600 text-white'
                          : isDestination
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {isOrigin ? '📍' : isDestination ? '🏁' : idx}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-foreground">
                          {wp.name}
                        </span>
                        {wp.stopType && (
                          <Badge variant="outline" className="text-[10px] py-0">
                            {wp.stopType}
                          </Badge>
                        )}
                        {wp.dayNumber && (
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            Day {wp.dayNumber}
                          </span>
                        )}
                      </div>

                      {wp.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {wp.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {wp.estimatedArrival && (
                    <div className="text-right shrink-0 text-xs font-semibold text-muted-foreground">
                      ⏰ {wp.estimatedArrival}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
