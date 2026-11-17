import React from 'react';
import { type Vehicle, type TripWithDetails } from '@waylo/shared';
interface VehicleInspectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trip: TripWithDetails | any;
    vehicle: Vehicle;
}
export declare function VehicleInspectionDialog({ open, onOpenChange, trip, vehicle, }: VehicleInspectionDialogProps): React.JSX.Element;
export {};
//# sourceMappingURL=VehicleInspectionDialog.d.ts.map