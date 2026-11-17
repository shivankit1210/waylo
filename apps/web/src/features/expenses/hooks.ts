import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as api from './api';
import type { CreateExpenseInput, UpdateExpenseInput } from '@waylo/shared';

export function useExpenses(tripId: string) {
  return useQuery({
    queryKey: ['expenses', tripId],
    queryFn: () => api.getExpenses(tripId),
    enabled: Boolean(tripId),
  });
}

export function useSettlementLedger(tripId: string) {
  return useQuery({
    queryKey: ['expenses-ledger', tripId],
    queryFn: () => api.getSettlementLedger(tripId),
    enabled: Boolean(tripId),
  });
}

export function useCreateExpense(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseInput) => api.createExpense(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', tripId] });
      queryClient.invalidateQueries({ queryKey: ['expenses-ledger', tripId] });
      toast.success('Expense recorded successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to record expense');
    },
  });
}

export function useUpdateExpense(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expenseId, data }: { expenseId: string; data: UpdateExpenseInput }) =>
      api.updateExpense(tripId, expenseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', tripId] });
      queryClient.invalidateQueries({ queryKey: ['expenses-ledger', tripId] });
      toast.success('Expense updated');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to update expense');
    },
  });
}

export function useDeleteExpense(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) => api.deleteExpense(tripId, expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', tripId] });
      queryClient.invalidateQueries({ queryKey: ['expenses-ledger', tripId] });
      toast.success('Expense removed');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to delete expense');
    },
  });
}

export function useSettleSplit(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ splitId, isSettled }: { splitId: string; isSettled: boolean }) =>
      api.settleSplit(tripId, splitId, isSettled),
    onSuccess: (_, { isSettled }) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', tripId] });
      queryClient.invalidateQueries({ queryKey: ['expenses-ledger', tripId] });
      toast.success(isSettled ? 'Debt marked as settled' : 'Debt reopened');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to update settlement');
    },
  });
}
