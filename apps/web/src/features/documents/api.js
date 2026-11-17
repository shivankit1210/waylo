import { apiClient } from '@/lib/api';
export async function getDocuments(tripId) {
    const response = await apiClient.get(`/trips/${tripId}/documents`);
    return response.data.data;
}
export async function createDocument(tripId, data) {
    const response = await apiClient.post(`/trips/${tripId}/documents`, data);
    return response.data.data;
}
export async function updateDocument(tripId, documentId, data) {
    const response = await apiClient.put(`/trips/${tripId}/documents/${documentId}`, data);
    return response.data.data;
}
export async function deleteDocument(tripId, documentId) {
    await apiClient.delete(`/trips/${tripId}/documents/${documentId}`);
}
//# sourceMappingURL=api.js.map