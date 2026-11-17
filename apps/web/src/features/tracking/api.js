import apiClient from '@/lib/api';
export const trackingApi = {
    /**
     * Get active ride session
     */
    async getSession(tripId) {
        const res = await apiClient.get(`/trips/${tripId}/tracking/session`);
        return res.data.data;
    },
    /**
     * Start or resume ride session
     */
    async startSession(tripId, data) {
        const res = await apiClient.post(`/trips/${tripId}/tracking/session`, data);
        return res.data.data;
    },
    /**
     * End active ride session
     */
    async endSession(tripId) {
        const res = await apiClient.patch(`/trips/${tripId}/tracking/session/end`);
        return res.data.data;
    },
    /**
     * Get snapshot of active riders in the trip
     */
    async getRiders(tripId) {
        const res = await apiClient.get(`/trips/${tripId}/tracking/riders`);
        return res.data.data;
    },
    /**
     * Update current rider location via HTTP
     */
    async updateLocation(tripId, data) {
        const res = await apiClient.post(`/trips/${tripId}/tracking/location`, data);
        return res.data.data;
    },
    /**
     * Get recent crew alerts & pings
     */
    async getPings(tripId) {
        const res = await apiClient.get(`/trips/${tripId}/tracking/pings`);
        return res.data.data;
    },
    /**
     * Send crew alert / emergency beacon
     */
    async sendPing(tripId, data) {
        const res = await apiClient.post(`/trips/${tripId}/tracking/pings`, { ...data, tripId });
        return res.data.data;
    },
};
//# sourceMappingURL=api.js.map