import { apiClient } from '@/lib/api';
export async function getAccommodations(tripId) {
    const response = await apiClient.get(`/trips/${tripId}/accommodations`);
    return response.data.data;
}
export async function createAccommodation(tripId, data) {
    const response = await apiClient.post(`/trips/${tripId}/accommodations`, data);
    return response.data.data;
}
export async function updateAccommodation(tripId, accommodationId, data) {
    const response = await apiClient.put(`/trips/${tripId}/accommodations/${accommodationId}`, data);
    return response.data.data;
}
export async function deleteAccommodation(tripId, accommodationId) {
    await apiClient.delete(`/trips/${tripId}/accommodations/${accommodationId}`);
}
//# sourceMappingURL=api.js.map