import { apiClient } from '@/lib/api';
export async function getTripRoute(tripId) {
    const response = await apiClient.get(`/trips/${tripId}/route`);
    return response.data.data;
}
export async function getWeatherForecast(lat, lng, locationName) {
    const response = await apiClient.get(`/maps/weather/forecast`, {
        params: { lat, lng, locationName },
    });
    return response.data.data;
}
//# sourceMappingURL=api.js.map