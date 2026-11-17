import React from 'react';
import type { Vehicle, TripWithDetails } from '@waylo/shared';
interface AddFuelLogDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trip: TripWithDetails | any;
    vehicle: Vehicle;
}
export declare function AddFuelLogDialog({ open, onOpenChange, trip, vehicle, }: AddFuelLogDialogProps): React.JSX.Element;
export {};
//# sourceMappingURL=AddFuelLogDialog.d.ts.map