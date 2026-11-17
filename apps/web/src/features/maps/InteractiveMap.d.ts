import React from 'react';
import type { RouteGeometry, RouteWaypoint } from '@waylo/shared';
interface InteractiveMapProps {
    route?: RouteGeometry;
    waypoints?: RouteWaypoint[];
    className?: string;
}
export declare function InteractiveMap({ route, waypoints: directWaypoints, className, }: InteractiveMapProps): React.JSX.Element;
export {};
//# sourceMappingURL=InteractiveMap.d.ts.map