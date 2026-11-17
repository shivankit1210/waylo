import { useQuery } from '@tanstack/react-query';
import * as api from './api';

export function useTripRoute(tripId: string) {
  return useQuery({
    queryKey: ['trip-route', tripId],
    queryFn: () => api.getTripRoute(tripId),
    enabled: Boolean(tripId),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useWeatherForecast(lat: number, lng: number, locationName?: string) {
  return useQuery({
    queryKey: ['weather-forecast', lat, lng, locationName],
    queryFn: () => api.getWeatherForecast(lat, lng, locationName),
    enabled: Boolean(lat && lng),
    staleTime: 10 * 60 * 1000, // Weather cache 10 minutes
  });
}
