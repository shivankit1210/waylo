export interface QueuedAction {
    id: string;
    tripId?: string;
    type: string;
    endpoint: string;
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    payload: any;
    createdAt: string;
}
export declare const offlineStorage: {
    /**
     * Save trip data in IndexedDB for offline viewing
     */
    saveTrip(trip: any): Promise<void>;
    /**
     * Retrieve cached trip data by ID
     */
    getTrip(tripId: string): Promise<any | null>;
    /**
     * Retrieve all cached trips
     */
    getAllTrips(): Promise<any[]>;
    /**
     * Enqueue a pending mutation action while offline
     */
    enqueueAction(action: Omit<QueuedAction, "id" | "createdAt">): Promise<QueuedAction>;
    /**
     * Get all pending queued actions in order
     */
    getQueue(): Promise<QueuedAction[]>;
    /**
     * Remove a completed action from the queue
     */
    removeAction(id: string): Promise<void>;
    /**
     * Clear all pending queued actions
     */
    clearQueue(): Promise<void>;
};
//# sourceMappingURL=offlineStorage.d.ts.map