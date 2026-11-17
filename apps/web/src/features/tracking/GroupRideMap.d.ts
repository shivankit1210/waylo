import type { RiderLocation, CrewPingAlert } from '@waylo/shared';
interface GroupRideMapProps {
    riders: RiderLocation[];
    recentPings?: CrewPingAlert[];
    center?: [number, number];
    zoom?: number;
    className?: string;
}
export declare function GroupRideMap({ riders, recentPings, center, // Goa default
zoom, className, }: GroupRideMapProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=GroupRideMap.d.ts.map