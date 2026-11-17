import type { TripRouteResponse, WeatherForecast } from '@waylo/shared';
export declare function getTripRoute(tripId: string): Promise<TripRouteResponse>;
export declare function getWeatherForecast(lat: number, lng: number, locationName?: string): Promise<WeatherForecast>;
//# sourceMappingURL=api.d.ts.map