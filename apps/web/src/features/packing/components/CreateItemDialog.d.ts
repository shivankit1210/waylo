import { PackingCategory, type LuggageBag } from '@waylo/shared';
interface CreateItemDialogProps {
    tripId: string;
    listId: string;
    bags: LuggageBag[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultCategory?: PackingCategory;
}
export declare function CreateItemDialog({ tripId, listId, bags, open, onOpenChange, defaultCategory, }: CreateItemDialogProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=CreateItemDialog.d.ts.map