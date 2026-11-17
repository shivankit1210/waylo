import React from 'react';
interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'destructive';
    onConfirm: () => void;
    isLoading?: boolean;
}
export declare function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, cancelLabel, variant, onConfirm, isLoading, }: ConfirmDialogProps): React.JSX.Element;
export {};
//# sourceMappingURL=ConfirmDialog.d.ts.map