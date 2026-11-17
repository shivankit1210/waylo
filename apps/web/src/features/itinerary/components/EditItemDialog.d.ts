import { type ItineraryItem } from '@waylo/shared';
interface EditItemDialogProps {
    tripId: string;
    dayId: string;
    item: ItineraryItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export declare function EditItemDialog({ tripId, dayId, item, open, onOpenChange, }: EditItemDialogProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=EditItemDialog.d.ts.map