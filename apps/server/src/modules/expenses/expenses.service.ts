import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/errors.js';
import {
  type CreateExpenseInput,
  type UpdateExpenseInput,
  type SettlementLedger,
  type MemberBalance,
  type DebtSettlement,
  ExpenseSplitType,
  type SupportedCurrency,
} from '@waylo/shared';

export class ExpensesService {
  /**
   * List all expenses for a trip
   */
  async listExpenses(tripId: string) {
    return prisma.expense.findMany({
      where: { tripId },
      include: {
        paidBy: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            email: true,
          },
        },
        splits: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Get single expense details
   */
  async getExpense(expenseId: string) {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: {
        paidBy: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            email: true,
          },
        },
        splits: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!expense) {
      throw AppError.notFound('Expense not found');
    }

    return expense;
  }

  /**
   * Create an expense and generate splits
   */
  async createExpense(tripId: string, currentUserId: string, data: CreateExpenseInput) {
    const paidById = data.paidById || currentUserId;

    // Verify trip exists and get members
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        members: {
          select: { userId: true },
        },
      },
    });

    if (!trip) {
      throw AppError.notFound('Trip not found');
    }

    const memberIds = trip.members.map((m) => m.userId);

    // Calculate splits
    const splitsToCreate = this.calculateSplits(
      data.amount,
      data.splitType || ExpenseSplitType.EQUAL,
      memberIds,
      data.splits
    );

    return prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          tripId,
          title: data.title,
          amount: data.amount,
          currency: data.currency || trip.currency || 'INR',
          category: data.category,
          paymentMethod: data.paymentMethod || 'UPI',
          paidById,
          date: data.date ? new Date(data.date) : new Date(),
          receiptUrl: data.receiptUrl || null,
          splitType: data.splitType || ExpenseSplitType.EQUAL,
          notes: data.notes || null,
          splits: {
            create: splitsToCreate.map((split) => ({
              userId: split.userId,
              amount: split.amount,
              percentage: split.percentage ?? null,
              isSettled: split.userId === paidById, // Payer's own share is inherently settled
              settledAt: split.userId === paidById ? new Date() : null,
            })),
          },
        },
        include: {
          paidBy: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
              email: true,
            },
          },
          splits: {
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                  avatarUrl: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      return expense;
    });
  }

  /**
   * Update an expense
   */
  async updateExpense(expenseId: string, data: UpdateExpenseInput) {
    const existing = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: {
        trip: {
          include: {
            members: { select: { userId: true } },
          },
        },
      },
    });

    if (!existing) {
      throw AppError.notFound('Expense not found');
    }

    const newAmount = data.amount ?? existing.amount;
    const newSplitType = (data.splitType ?? existing.splitType) as ExpenseSplitType;
    const memberIds = existing.trip.members.map((m) => m.userId);

    return prisma.$transaction(async (tx) => {
      // If amount or split configuration changed, re-calculate splits
      if (data.amount !== undefined || data.splitType !== undefined || data.splits !== undefined) {
        await tx.expenseSplit.deleteMany({
          where: { expenseId },
        });

        const newSplits = this.calculateSplits(
          newAmount,
          newSplitType,
          memberIds,
          data.splits
        );

        const payerId = data.paidById || existing.paidById;

        await tx.expenseSplit.createMany({
          data: newSplits.map((s) => ({
            expenseId,
            userId: s.userId,
            amount: s.amount,
            percentage: s.percentage ?? null,
            isSettled: s.userId === payerId,
            settledAt: s.userId === payerId ? new Date() : null,
          })),
        });
      }

      return tx.expense.update({
        where: { id: expenseId },
        data: {
          title: data.title ?? undefined,
          amount: data.amount ?? undefined,
          currency: data.currency ?? undefined,
          category: data.category ?? undefined,
          paymentMethod: data.paymentMethod ?? undefined,
          paidById: data.paidById ?? undefined,
          date: data.date ? new Date(data.date) : undefined,
          receiptUrl: data.receiptUrl !== undefined ? data.receiptUrl : undefined,
          splitType: data.splitType ?? undefined,
          notes: data.notes !== undefined ? data.notes : undefined,
        },
        include: {
          paidBy: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
              email: true,
            },
          },
          splits: {
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                  avatarUrl: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    });
  }

  /**
   * Delete an expense
   */
  async deleteExpense(expenseId: string) {
    const existing = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!existing) {
      throw AppError.notFound('Expense not found');
    }

    await prisma.expense.delete({ where: { id: expenseId } });
    return { success: true, message: 'Expense deleted successfully' };
  }

  /**
   * Settle or unsettle a split
   */
  async settleSplit(splitId: string, isSettled: boolean) {
    const split = await prisma.expenseSplit.findUnique({
      where: { id: splitId },
    });

    if (!split) {
      throw AppError.notFound('Expense split not found');
    }

    return prisma.expenseSplit.update({
      where: { id: splitId },
      data: {
        isSettled,
        settledAt: isSettled ? new Date() : null,
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get settlement ledger and Who-Owes-Whom report
   */
  async getSettlementLedger(tripId: string): Promise<SettlementLedger> {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                email: true,
              },
            },
          },
        },
        expenses: {
          include: {
            paidBy: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                email: true,
              },
            },
            splits: {
              include: {
                user: {
                  select: {
                    id: true,
                    displayName: true,
                    avatarUrl: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!trip) {
      throw AppError.notFound('Trip not found');
    }

    const currency = (trip.currency || 'INR') as SupportedCurrency;
    const memberMap = new Map<string, { id: string; name: string; avatarUrl: string | null }>();

    for (const m of trip.members) {
      memberMap.set(m.userId, {
        id: m.userId,
        name: m.user.displayName,
        avatarUrl: m.user.avatarUrl,
      });
    }

    // Initialize balance counters
    const paidByMember: Record<string, number> = {};
    const shareByMember: Record<string, number> = {};
    const netDebtBalance: Record<string, number> = {}; // positive = owed money, negative = owes money

    for (const memberId of memberMap.keys()) {
      paidByMember[memberId] = 0;
      shareByMember[memberId] = 0;
      netDebtBalance[memberId] = 0;
    }

    let totalExpense = 0;

    for (const expense of trip.expenses) {
      totalExpense += expense.amount;
      paidByMember[expense.paidById] = (paidByMember[expense.paidById] || 0) + expense.amount;

      for (const split of expense.splits) {
        shareByMember[split.userId] = (shareByMember[split.userId] || 0) + split.amount;

        // If this split is unsettled and belongs to someone else, it contributes to unsettled net debts
        if (!split.isSettled && split.userId !== expense.paidById) {
          netDebtBalance[expense.paidById] = (netDebtBalance[expense.paidById] || 0) + split.amount;
          netDebtBalance[split.userId] = (netDebtBalance[split.userId] || 0) - split.amount;
        }
      }
    }

    // Format MemberBalances
    const balances: MemberBalance[] = Array.from(memberMap.values()).map((m) => {
      const paid = paidByMember[m.id] || 0;
      const share = shareByMember[m.id] || 0;
      return {
        userId: m.id,
        displayName: m.name,
        avatarUrl: m.avatarUrl,
        totalPaid: paid,
        totalShare: share,
        netBalance: paid - share,
      };
    });

    // Minimal Cash Flow Debt Settlement Algorithm
    const settlements = this.calculateMinimalSettlements(
      netDebtBalance,
      memberMap,
      currency
    );

    return {
      totalExpense,
      currency,
      balances,
      settlements,
    };
  }

  // ─── Private Helpers ────────────────────────────────────────

  /**
   * Min-Cash-Flow algorithm to generate minimal pairwise debt settlements
   */
  private calculateMinimalSettlements(
    netDebtBalance: Record<string, number>,
    memberMap: Map<string, { id: string; name: string; avatarUrl: string | null }>,
    currency: SupportedCurrency
  ): DebtSettlement[] {
    const settlements: DebtSettlement[] = [];

    // Separate into debtors and creditors
    type BalanceEntry = { userId: string; amount: number };
    const debtors: BalanceEntry[] = [];
    const creditors: BalanceEntry[] = [];

    for (const [userId, balance] of Object.entries(netDebtBalance)) {
      if (balance < -0.01) {
        debtors.push({ userId, amount: -balance });
      } else if (balance > 0.01) {
        creditors.push({ userId, amount: balance });
      }
    }

    // Sort descending by amount
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    let d = 0;
    let c = 0;

    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor = creditors[c];

      const settlementAmount = Math.min(debtor.amount, creditor.amount);

      if (settlementAmount > 0) {
        settlements.push({
          fromUserId: debtor.userId,
          fromName: memberMap.get(debtor.userId)?.name || 'Unknown',
          toUserId: creditor.userId,
          toName: memberMap.get(creditor.userId)?.name || 'Unknown',
          amount: Math.round(settlementAmount),
          currency,
        });

        debtor.amount -= settlementAmount;
        creditor.amount -= settlementAmount;
      }

      if (debtor.amount <= 0.01) d++;
      if (creditor.amount <= 0.01) c++;
    }

    return settlements;
  }

  /**
   * Split amount based on strategy
   */
  private calculateSplits(
    amount: number,
    splitType: ExpenseSplitType,
    allMemberIds: string[],
    customSplits?: Array<{ userId: string; amount?: number; percentage?: number }>
  ) {
    if (splitType === ExpenseSplitType.EXACT && customSplits && customSplits.length > 0) {
      const total = customSplits.reduce((acc, s) => acc + (s.amount || 0), 0);
      if (Math.abs(total - amount) > 2) {
        throw AppError.badRequest(
          `Sum of exact splits (${total}) does not match expense amount (${amount})`
        );
      }
      return customSplits.map((s) => ({
        userId: s.userId,
        amount: Math.round(s.amount || 0),
        percentage: null,
      }));
    }

    if (splitType === ExpenseSplitType.PERCENTAGE && customSplits && customSplits.length > 0) {
      const totalPercentage = customSplits.reduce((acc, s) => acc + (s.percentage || 0), 0);
      if (Math.abs(totalPercentage - 100) > 1) {
        throw AppError.badRequest(
          `Sum of split percentages (${totalPercentage}%) must equal 100%`
        );
      }
      return customSplits.map((s) => ({
        userId: s.userId,
        amount: Math.round((amount * (s.percentage || 0)) / 100),
        percentage: s.percentage,
      }));
    }

    // Default: EQUAL split
    const targetUserIds =
      customSplits && customSplits.length > 0
        ? customSplits.map((s) => s.userId)
        : allMemberIds;

    if (targetUserIds.length === 0) {
      throw AppError.badRequest('No members found to split expense with');
    }

    const share = Math.floor(amount / targetUserIds.length);
    let remainder = amount - share * targetUserIds.length;

    return targetUserIds.map((userId) => {
      const extra = remainder > 0 ? 1 : 0;
      if (remainder > 0) remainder--;
      return {
        userId,
        amount: share + extra,
        percentage: Number(((1 / targetUserIds.length) * 100).toFixed(2)),
      };
    });
  }
}

export const expensesService = new ExpensesService();
