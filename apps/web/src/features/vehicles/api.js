import { apiClient } from '@/lib/api';
export async function getVehicles(tripId) {
    const response = await apiClient.get(`/trips/${tripId}/vehicles`);
    return response.data.data;
}
export async function createVehicle(tripId, data) {
    const response = await apiClient.post(`/trips/${tripId}/vehicles`, data);
    return response.data.data;
}
export async function updateVehicle(tripId, vehicleId, data) {
    const response = await apiClient.put(`/trips/${tripId}/vehicles/${vehicleId}`, data);
    return response.data.data;
}
export async function deleteVehicle(tripId, vehicleId) {
    await apiClient.delete(`/trips/${tripId}/vehicles/${vehicleId}`);
}
export async function getFuelLogs(tripId, vehicleId) {
    const response = await apiClient.get(`/trips/${tripId}/vehicles/${vehicleId}/fuel-logs`);
    return response.data.data;
}
export async function addFuelLog(tripId, vehicleId, data) {
    const response = await apiClient.post(`/trips/${tripId}/vehicles/${vehicleId}/fuel-logs`, data);
    return response.data.data;
}
export async function getInspections(tripId, vehicleId) {
    const response = await apiClient.get(`/trips/${tripId}/vehicles/${vehicleId}/inspections`);
    return response.data.data;
}
export async function addInspection(tripId, vehicleId, data) {
    const response = await apiClient.post(`/trips/${tripId}/vehicles/${vehicleId}/inspections`, data);
    return response.data.data;
}
//# sourceMappingURL=api.js.map