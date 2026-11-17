import { type TripWithDetails } from '@waylo/shared';
interface BatchGenerateDialogProps {
    trip: TripWithDetails;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}
export declare function BatchGenerateDialog({ trip, open, onOpenChange, onSuccess, }: BatchGenerateDialogProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=BatchGenerateDialog.d.ts.map