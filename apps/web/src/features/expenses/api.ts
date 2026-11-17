import { apiClient } from '@/lib/api';
import type {
  Expense,
  SettlementLedger,
  CreateExpenseInput,
  UpdateExpenseInput,
  ApiResponse,
} from '@waylo/shared';

export async function getExpenses(tripId: string): Promise<Expense[]> {
  const response = await apiClient.get<ApiResponse<Expense[]>>(`/trips/${tripId}/expenses`);
  return response.data.data;
}

export async function createExpense(tripId: string, data: CreateExpenseInput): Promise<Expense> {
  const response = await apiClient.post<ApiResponse<Expense>>(`/trips/${tripId}/expenses`, data);
  return response.data.data;
}

export async function updateExpense(
  tripId: string,
  expenseId: string,
  data: UpdateExpenseInput
): Promise<Expense> {
  const response = await apiClient.put<ApiResponse<Expense>>(
    `/trips/${tripId}/expenses/${expenseId}`,
    data
  );
  return response.data.data;
}

export async function deleteExpense(tripId: string, expenseId: string): Promise<void> {
  await apiClient.delete(`/trips/${tripId}/expenses/${expenseId}`);
}

export async function settleSplit(
  tripId: string,
  splitId: string,
  isSettled: boolean
): Promise<void> {
  await apiClient.patch(`/trips/${tripId}/expenses/splits/${splitId}/settle`, {
    splitId,
    isSettled,
  });
}

export async function getSettlementLedger(tripId: string): Promise<SettlementLedger> {
  const response = await apiClient.get<ApiResponse<SettlementLedger>>(
    `/trips/${tripId}/expenses/ledger`
  );
  return response.data.data;
}
