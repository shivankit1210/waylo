import { type ItineraryDay } from '@waylo/shared';
interface EditDayDialogProps {
    tripId: string;
    day: ItineraryDay | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export declare function EditDayDialog({ tripId, day, open, onOpenChange, }: EditDayDialogProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=EditDayDialog.d.ts.map