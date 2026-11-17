import type { RideSession, RiderLocation, CrewPingAlert, UpdateRiderLocationInput, SendCrewPingInput } from '@waylo/shared';
export declare const trackingApi: {
    /**
     * Get active ride session
     */
    getSession(tripId: string): Promise<RideSession>;
    /**
     * Start or resume ride session
     */
    startSession(tripId: string, data: {
        name: string;
    }): Promise<RideSession>;
    /**
     * End active ride session
     */
    endSession(tripId: string): Promise<RideSession>;
    /**
     * Get snapshot of active riders in the trip
     */
    getRiders(tripId: string): Promise<RiderLocation[]>;
    /**
     * Update current rider location via HTTP
     */
    updateLocation(tripId: string, data: UpdateRiderLocationInput): Promise<RiderLocation>;
    /**
     * Get recent crew alerts & pings
     */
    getPings(tripId: string): Promise<CrewPingAlert[]>;
    /**
     * Send crew alert / emergency beacon
     */
    sendPing(tripId: string, data: Omit<SendCrewPingInput, "tripId">): Promise<CrewPingAlert>;
};
//# sourceMappingURL=api.d.ts.map