import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as api from './api';
export function useExpenses(tripId) {
    return useQuery({
        queryKey: ['expenses', tripId],
        queryFn: () => api.getExpenses(tripId),
        enabled: Boolean(tripId),
    });
}
export function useSettlementLedger(tripId) {
    return useQuery({
        queryKey: ['expenses-ledger', tripId],
        queryFn: () => api.getSettlementLedger(tripId),
        enabled: Boolean(tripId),
    });
}
export function useCreateExpense(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.createExpense(tripId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', tripId] });
            queryClient.invalidateQueries({ queryKey: ['expenses-ledger', tripId] });
            toast.success('Expense recorded successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to record expense');
        },
    });
}
export function useUpdateExpense(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ expenseId, data }) => api.updateExpense(tripId, expenseId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', tripId] });
            queryClient.invalidateQueries({ queryKey: ['expenses-ledger', tripId] });
            toast.success('Expense updated');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to update expense');
        },
    });
}
export function useDeleteExpense(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (expenseId) => api.deleteExpense(tripId, expenseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', tripId] });
            queryClient.invalidateQueries({ queryKey: ['expenses-ledger', tripId] });
            toast.success('Expense removed');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to delete expense');
        },
    });
}
export function useSettleSplit(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ splitId, isSettled }) => api.settleSplit(tripId, splitId, isSettled),
        onSuccess: (_, { isSettled }) => {
            queryClient.invalidateQueries({ queryKey: ['expenses', tripId] });
            queryClient.invalidateQueries({ queryKey: ['expenses-ledger', tripId] });
            toast.success(isSettled ? 'Debt marked as settled' : 'Debt reopened');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to update settlement');
        },
    });
}
//# sourceMappingURL=hooks.js.map