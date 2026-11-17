import { type PackingItem, type LuggageBag } from '@waylo/shared';
interface EditItemDialogProps {
    tripId: string;
    item: PackingItem | null;
    bags: LuggageBag[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export declare function EditItemDialog({ tripId, item, bags, open, onOpenChange, }: EditItemDialogProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=EditItemDialog.d.ts.map