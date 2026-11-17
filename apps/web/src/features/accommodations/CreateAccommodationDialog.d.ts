import React from 'react';
import { type TripWithDetails } from '@waylo/shared';
interface CreateAccommodationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trip: TripWithDetails | any;
}
export declare const BOOKING_TYPE_LABELS: Record<string, string>;
export declare function CreateAccommodationDialog({ open, onOpenChange, trip, }: CreateAccommodationDialogProps): React.JSX.Element;
export {};
//# sourceMappingURL=CreateAccommodationDialog.d.ts.map