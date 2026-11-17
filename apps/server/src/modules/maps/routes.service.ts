import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/errors.js';
import { weatherService } from './weather.service.js';
import type {
  RouteGeometry,
  RouteWaypoint,
  TripRouteResponse,
} from '@waylo/shared';

// Approximate geocoding coordinates for popular travel destinations
const GEOCODE_CACHE: Record<string, [number, number]> = {
  mumbai: [18.9220, 72.8347],
  panvel: [18.9894, 73.1175],
  chiplun: [17.5323, 73.5187],
  goa: [15.4989, 73.8278],
  panaji: [15.4989, 73.8278],
  vagator: [15.5996, 73.7431],
  delhi: [28.6139, 77.2090],
  manali: [32.2396, 77.1887],
  leh: [34.1526, 77.5771],
  ladakh: [34.1526, 77.5771],
  jaipur: [26.9124, 75.7873],
  udaipur: [24.5854, 73.7125],
  bangalore: [12.9716, 77.5946],
  pune: [18.5204, 73.8567],
  coorg: [12.3375, 75.8069],
  ooty: [11.4102, 76.6950],
};

function lookupCoords(locationName?: string | null): [number, number] {
  if (!locationName) return [18.9220, 72.8347]; // default Mumbai
  const normalized = locationName.toLowerCase();
  for (const [key, coords] of Object.entries(GEOCODE_CACHE)) {
    if (normalized.includes(key)) {
      return coords;
    }
  }
  // Default to West Coast scenic corridor if unknown
  return [17.5323, 73.5187];
}

// Great-circle Haversine distance in km
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export class RoutesService {
  /**
   * Get complete route geometry and live weather for a trip
   */
  async getTripRoute(tripId: string): Promise<TripRouteResponse> {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        itineraryDays: {
          include: {
            items: {
              orderBy: { orderIndex: 'asc' },
            },
          },
          orderBy: { dayNumber: 'asc' },
        },
      },
    });

    if (!trip) {
      throw AppError.notFound('Trip not found');
    }

    const waypoints: RouteWaypoint[] = [];

    // 1. Origin Waypoint
    const originCoords = lookupCoords(trip.startLocation || 'Mumbai Base');
    waypoints.push({
      name: trip.startLocation || 'Trip Origin',
      description: 'Starting point of expedition',
      latitude: originCoords[0],
      longitude: originCoords[1],
      orderIndex: 0,
      stopType: 'ORIGIN',
    });

    let currentOrder = 1;

    // 2. Day-by-Day stops
    for (const day of trip.itineraryDays) {
      if (day.startLocation && day.dayNumber > 1) {
        const coords = lookupCoords(day.startLocation);
        waypoints.push({
          name: day.startLocation,
          description: `Day ${day.dayNumber} Departure Base`,
          latitude: coords[0],
          longitude: coords[1],
          orderIndex: currentOrder++,
          dayNumber: day.dayNumber,
          stopType: 'REST',
        });
      }

      for (const item of day.items) {
        const lat = item.latitude || lookupCoords(item.location || item.title)[0];
        const lng = item.longitude || lookupCoords(item.location || item.title)[1];

        waypoints.push({
          id: item.id,
          name: item.title,
          description: item.description,
          latitude: lat,
          longitude: lng,
          orderIndex: currentOrder++,
          dayNumber: day.dayNumber,
          stopType: item.itemType,
          estimatedArrival: item.startTime,
        });
      }

      if (day.endLocation) {
        const coords = lookupCoords(day.endLocation);
        waypoints.push({
          name: day.endLocation,
          description: `Day ${day.dayNumber} Overnight Destination`,
          latitude: coords[0],
          longitude: coords[1],
          orderIndex: currentOrder++,
          dayNumber: day.dayNumber,
          stopType: 'REST',
        });
      }
    }

    // 3. Final Destination Waypoint
    const destCoords = lookupCoords(trip.destination || 'Goa');
    waypoints.push({
      name: trip.destination || 'Trip Destination',
      description: 'Final expedition destination',
      latitude: destCoords[0],
      longitude: destCoords[1],
      orderIndex: currentOrder++,
      stopType: 'DESTINATION',
    });

    // 4. Calculate route geometry
    const route = await this.calculateDirections(waypoints);

    // 5. Fetch live weather for the destination
    const weather = await weatherService.getForecast(
      destCoords[0],
      destCoords[1],
      trip.destination || 'Destination'
    );

    return {
      route,
      weather,
    };
  }

  /**
   * Fetch route from OSRM public API or compute fallback Haversine polyline
   */
  async calculateDirections(waypoints: RouteWaypoint[]): Promise<RouteGeometry> {
    if (waypoints.length < 2) {
      return {
        coordinates: waypoints.map((w) => [w.latitude, w.longitude]),
        distanceKm: 0,
        durationMinutes: 0,
        waypoints,
      };
    }

    try {
      // Build OSRM query: lon1,lat1;lon2,lat2...
      // Take up to 10 key waypoints for OSRM rate limits
      const step = Math.max(1, Math.floor(waypoints.length / 10));
      const sampledWaypoints = waypoints.filter(
        (_, idx) => idx === 0 || idx === waypoints.length - 1 || idx % step === 0
      );

      const coordString = sampledWaypoints
        .map((w) => `${w.longitude.toFixed(5)},${w.latitude.toFixed(5)}`)
        .join(';');

      const url = `http://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const json: any = await res.json();
        if (json.code === 'Ok' && json.routes?.[0]) {
          const osrmRoute = json.routes[0];
          const rawCoords: [number, number][] = osrmRoute.geometry.coordinates; // [lon, lat]

          // Convert GeoJSON [lon, lat] to Leaflet [lat, lng]
          const leafletCoords: [number, number][] = rawCoords.map(([lon, lat]) => [lat, lon]);

          return {
            coordinates: leafletCoords,
            distanceKm: Number((osrmRoute.distance / 1000).toFixed(1)),
            durationMinutes: Math.round(osrmRoute.duration / 60),
            waypoints,
          };
        }
      }
    } catch {
      // Fallback interpolation if OSRM is slow / offline
    }

    return this.fallbackRoute(waypoints);
  }

  /**
   * Fallback straight-line interpolation with Haversine distance
   */
  private fallbackRoute(waypoints: RouteWaypoint[]): RouteGeometry {
    let totalDistance = 0;
    const coordinates: [number, number][] = [];

    for (let i = 0; i < waypoints.length; i++) {
      const current = waypoints[i];
      coordinates.push([current.latitude, current.longitude]);

      if (i > 0) {
        const prev = waypoints[i - 1];
        totalDistance += haversineDistance(
          prev.latitude,
          prev.longitude,
          current.latitude,
          current.longitude
        );
      }
    }

    // Assume average road factor 1.25x and speed 55 km/h
    const estimatedDistance = Math.round(totalDistance * 1.25);
    const estimatedMinutes = Math.round((estimatedDistance / 55) * 60);

    return {
      coordinates,
      distanceKm: estimatedDistance,
      durationMinutes: estimatedMinutes,
      waypoints,
    };
  }
}

export const routesService = new RoutesService();
