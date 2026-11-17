import type { Request, Response, NextFunction } from 'express';
import { expensesService } from './expenses.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export async function getExpenses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { tripId } = req.params;
    const expenses = await expensesService.listExpenses(tripId);
    sendSuccess(res, expenses);
  } catch (error) {
    next(error);
  }
}

export async function getExpense(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { expenseId } = req.params;
    const expense = await expensesService.getExpense(expenseId);
    sendSuccess(res, expense);
  } catch (error) {
    next(error);
  }
}

export async function createExpense(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { tripId } = req.params;
    const userId = req.user!.id;
    const expense = await expensesService.createExpense(tripId, userId, req.body);
    sendSuccess(res, expense, 'Expense created successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateExpense(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { expenseId } = req.params;
    const expense = await expensesService.updateExpense(expenseId, req.body);
    sendSuccess(res, expense, 'Expense updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteExpense(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { expenseId } = req.params;
    const result = await expensesService.deleteExpense(expenseId);
    sendSuccess(res, result, 'Expense deleted successfully');
  } catch (error) {
    next(error);
  }
}

export async function settleSplit(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { splitId } = req.params;
    const { isSettled = true } = req.body;
    const split = await expensesService.settleSplit(splitId, isSettled);
    sendSuccess(
      res,
      split,
      isSettled ? 'Split marked as settled' : 'Split marked as unsettled'
    );
  } catch (error) {
    next(error);
  }
}

export async function getSettlementLedger(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { tripId } = req.params;
    const ledger = await expensesService.getSettlementLedger(tripId);
    sendSuccess(res, ledger);
  } catch (error) {
    next(error);
  }
}
