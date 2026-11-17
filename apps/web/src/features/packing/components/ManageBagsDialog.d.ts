import { type LuggageBag } from '@waylo/shared';
interface ManageBagsDialogProps {
    tripId: string;
    bags: LuggageBag[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export declare function ManageBagsDialog({ tripId, bags, open, onOpenChange, }: ManageBagsDialogProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=ManageBagsDialog.d.ts.map