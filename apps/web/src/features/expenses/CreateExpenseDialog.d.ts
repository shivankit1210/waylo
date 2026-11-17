import React from 'react';
import { ExpenseCategory, PaymentMethod, type TripWithDetails } from '@waylo/shared';
interface CreateExpenseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trip: TripWithDetails | any;
}
export declare const CATEGORY_LABELS: Record<ExpenseCategory, string>;
export declare const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string>;
export declare function CreateExpenseDialog({ open, onOpenChange, trip, }: CreateExpenseDialogProps): React.JSX.Element;
export {};
//# sourceMappingURL=CreateExpenseDialog.d.ts.map