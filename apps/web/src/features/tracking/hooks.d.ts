import { PingType, type RideSession, type RiderLocation, type CrewPingAlert } from '@waylo/shared';
export declare function useRideSession(tripId?: string): import("@tanstack/react-query").UseQueryResult<RideSession | null, Error>;
export declare function useRiders(tripId?: string): import("@tanstack/react-query").UseQueryResult<RiderLocation[], Error>;
export declare function useCrewPings(tripId?: string): import("@tanstack/react-query").UseQueryResult<CrewPingAlert[], Error>;
export declare function useStartRideSession(tripId?: string): import("@tanstack/react-query").UseMutationResult<RideSession, Error, {
    name: string;
}, unknown>;
export declare function useEndRideSession(tripId?: string): import("@tanstack/react-query").UseMutationResult<RideSession, Error, void, unknown>;
export declare function useSendCrewPing(tripId?: string): import("@tanstack/react-query").UseMutationResult<CrewPingAlert, Error, {
    pingType: PingType;
    message?: string;
    latitude?: number;
    longitude?: number;
}, unknown>;
/**
 * Real-time WebSocket hook for group ride telemetry and pings
 */
export declare function useLiveTrackingWebSocket(tripId?: string, initialCenter?: [number, number]): {
    isConnected: boolean;
    riders: RiderLocation[];
    recentPings: CrewPingAlert[];
    isBroadcasting: boolean;
    isSimulating: boolean;
    sendLocation: (coords: {
        latitude: number;
        longitude: number;
        speedKmh?: number;
        headingDeg?: number;
        batteryPercent?: number;
        altitude?: number;
    }) => void;
    sendCrewPing: (pingType: PingType, message?: string, customCoords?: {
        lat: number;
        lng: number;
    }) => void;
    startGpsBroadcast: () => void;
    stopGpsBroadcast: () => void;
    startSimulation: () => void;
    stopSimulation: () => void;
};
//# sourceMappingURL=hooks.d.ts.map