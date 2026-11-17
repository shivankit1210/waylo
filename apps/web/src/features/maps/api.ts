import { apiClient } from '@/lib/api';
import type { TripRouteResponse, WeatherForecast, ApiResponse } from '@waylo/shared';

export async function getTripRoute(tripId: string): Promise<TripRouteResponse> {
  const response = await apiClient.get<ApiResponse<TripRouteResponse>>(
    `/trips/${tripId}/route`
  );
  return response.data.data;
}

export async function getWeatherForecast(
  lat: number,
  lng: number,
  locationName?: string
): Promise<WeatherForecast> {
  const response = await apiClient.get<ApiResponse<WeatherForecast>>(
    `/maps/weather/forecast`,
    {
      params: { lat, lng, locationName },
    }
  );
  return response.data.data;
}
