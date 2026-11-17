import type { UpdateExpenseInput } from '@waylo/shared';
export declare function useExpenses(tripId: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").Expense[], Error>;
export declare function useSettlementLedger(tripId: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").SettlementLedger, Error>;
export declare function useCreateExpense(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").Expense, any, {
    currency: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD";
    title: string;
    category: import("@waylo/shared").ExpenseCategory;
    amount: number;
    paymentMethod: import("@waylo/shared").PaymentMethod;
    splitType: import("@waylo/shared").ExpenseSplitType;
    date?: string | undefined;
    notes?: string | null | undefined;
    paidById?: string | undefined;
    splits?: {
        userId: string;
        amount: number;
        percentage?: number | undefined;
    }[] | undefined;
    receiptUrl?: string | null | undefined;
}, unknown>;
export declare function useUpdateExpense(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").Expense, any, {
    expenseId: string;
    data: UpdateExpenseInput;
}, unknown>;
export declare function useDeleteExpense(tripId: string): import("@tanstack/react-query").UseMutationResult<void, any, string, unknown>;
export declare function useSettleSplit(tripId: string): import("@tanstack/react-query").UseMutationResult<void, any, {
    splitId: string;
    isSettled: boolean;
}, unknown>;
//# sourceMappingURL=hooks.d.ts.map