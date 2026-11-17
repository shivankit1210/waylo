import { apiClient } from '@/lib/api';
export async function getExpenses(tripId) {
    const response = await apiClient.get(`/trips/${tripId}/expenses`);
    return response.data.data;
}
export async function createExpense(tripId, data) {
    const response = await apiClient.post(`/trips/${tripId}/expenses`, data);
    return response.data.data;
}
export async function updateExpense(tripId, expenseId, data) {
    const response = await apiClient.put(`/trips/${tripId}/expenses/${expenseId}`, data);
    return response.data.data;
}
export async function deleteExpense(tripId, expenseId) {
    await apiClient.delete(`/trips/${tripId}/expenses/${expenseId}`);
}
export async function settleSplit(tripId, splitId, isSettled) {
    await apiClient.patch(`/trips/${tripId}/expenses/splits/${splitId}/settle`, {
        splitId,
        isSettled,
    });
}
export async function getSettlementLedger(tripId) {
    const response = await apiClient.get(`/trips/${tripId}/expenses/ledger`);
    return response.data.data;
}
//# sourceMappingURL=api.js.map