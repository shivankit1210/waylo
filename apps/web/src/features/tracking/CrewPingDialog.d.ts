import { PingType } from '@waylo/shared';
interface CrewPingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSendPing: (type: PingType, message?: string) => void;
    isLoading?: boolean;
}
export declare function CrewPingDialog({ open, onOpenChange, onSendPing, isLoading, }: CrewPingDialogProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=CrewPingDialog.d.ts.map