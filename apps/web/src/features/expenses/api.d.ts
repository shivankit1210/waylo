import type { Expense, SettlementLedger, CreateExpenseInput, UpdateExpenseInput } from '@waylo/shared';
export declare function getExpenses(tripId: string): Promise<Expense[]>;
export declare function createExpense(tripId: string, data: CreateExpenseInput): Promise<Expense>;
export declare function updateExpense(tripId: string, expenseId: string, data: UpdateExpenseInput): Promise<Expense>;
export declare function deleteExpense(tripId: string, expenseId: string): Promise<void>;
export declare function settleSplit(tripId: string, splitId: string, isSettled: boolean): Promise<void>;
export declare function getSettlementLedger(tripId: string): Promise<SettlementLedger>;
//# sourceMappingURL=api.d.ts.map