import { Router } from 'express';
import {
  TripRole,
  createExpenseSchema,
  updateExpenseSchema,
  settleExpenseSplitSchema,
} from '@waylo/shared';
import * as expensesController from './expenses.controller.js';
import { authenticate, requireTripMember } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';

export const expenseRoutes = Router({ mergeParams: true });

expenseRoutes.use(authenticate);

// ─── Expense Endpoints ──────────────────────────────────────
expenseRoutes.get(
  '/',
  requireTripMember(),
  expensesController.getExpenses
);

expenseRoutes.get(
  '/ledger',
  requireTripMember(),
  expensesController.getSettlementLedger
);

expenseRoutes.get(
  '/:expenseId',
  requireTripMember(),
  expensesController.getExpense
);

expenseRoutes.post(
  '/',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(createExpenseSchema),
  expensesController.createExpense
);

expenseRoutes.put(
  '/:expenseId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  validateBody(updateExpenseSchema),
  expensesController.updateExpense
);

expenseRoutes.delete(
  '/:expenseId',
  requireTripMember([TripRole.OWNER, TripRole.LEADER, TripRole.MEMBER]),
  expensesController.deleteExpense
);

expenseRoutes.patch(
  '/splits/:splitId/settle',
  requireTripMember(),
  validateBody(settleExpenseSplitSchema),
  expensesController.settleSplit
);
