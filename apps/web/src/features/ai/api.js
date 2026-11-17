import apiClient from '@/lib/api';
export const aiApi = {
    /**
     * Generate complete structured itinerary
     */
    async generateItinerary(input) {
        const res = await apiClient.post('/ai/generate-itinerary', input);
        return res.data.data;
    },
    /**
     * Apply AI-crafted itinerary days and stops to a trip
     */
    async applyItinerary(input) {
        const res = await apiClient.post('/ai/apply-itinerary', input);
        return res.data.data;
    },
    /**
     * Generate intelligent packing checklist
     */
    async generatePacking(input) {
        const res = await apiClient.post('/ai/generate-packing', input);
        return res.data.data;
    },
    /**
     * Apply AI packing checklist items to trip
     */
    async applyPacking(input) {
        const res = await apiClient.post('/ai/apply-packing', input);
        return res.data.data;
    },
    /**
     * Send query to Travel Copilot chat
     */
    async chatCopilot(input) {
        const res = await apiClient.post('/ai/chat', input);
        return res.data.data;
    },
};
//# sourceMappingURL=api.js.map