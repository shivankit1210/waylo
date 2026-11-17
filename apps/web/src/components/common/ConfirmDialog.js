import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = 'Continue', cancelLabel = 'Cancel', variant = 'default', onConfirm, isLoading = false, }) {
    return (_jsx(AlertDialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: title }), _jsx(AlertDialogDescription, { children: description })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { disabled: isLoading, children: cancelLabel }), _jsx(AlertDialogAction, { onClick: (e) => {
                                e.preventDefault();
                                onConfirm();
                            }, disabled: isLoading, className: cn(variant === 'destructive' && buttonVariants({ variant: 'destructive' })), children: isLoading ? 'Processing...' : confirmLabel })] })] }) }));
}
//# sourceMappingURL=ConfirmDialog.js.map