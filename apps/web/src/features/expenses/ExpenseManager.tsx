import { useState } from 'react';
import {
  Receipt,
  Plus,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useAuthStore } from '@/stores/authStore';
import {
  useExpenses,
  useSettlementLedger,
  useDeleteExpense,
  useSettleSplit,
} from './hooks';
import {
  CreateExpenseDialog,
  CATEGORY_LABELS,
  PAYMENT_METHOD_LABELS,
} from './CreateExpenseDialog';
import type { TripWithDetails, Expense, ExpenseSplit } from '@waylo/shared';

interface ExpenseManagerProps {
  trip: TripWithDetails | any;
}

export function ExpenseManager({ trip }: ExpenseManagerProps) {
  const { user } = useAuthStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'stream' | 'settlement'>('stream');

  const { data: expenses = [], isLoading: isLoadingExpenses } = useExpenses(trip.id);
  const { data: ledger, isLoading: isLoadingLedger } = useSettlementLedger(trip.id);
  const deleteMutation = useDeleteExpense(trip.id);
  const settleMutation = useSettleSplit(trip.id);

  const currency = trip.currency || 'INR';

  const formatCurrency = (amountInCents: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency === 'INR' ? 'INR' : currency,
      maximumFractionDigits: 2,
    }).format(amountInCents / 100);
  };

  if (isLoadingExpenses || isLoadingLedger) {
    return (
      <div className="py-16 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Calculate user's specific balance
  const myBalance = ledger?.balances?.find((b) => b.userId === user?.id);
  const netAmount = myBalance?.netBalance || 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            Expenses & Debt Settlements
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Log group expenses, track member shares, and resolve debts with minimum cash flow.
          </p>
        </div>

        <Button
          onClick={() => setShowCreateDialog(true)}
          className="gap-2 rounded-xl font-bold shrink-0 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Log Expense
        </Button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Expense */}
        <Card className="p-5 rounded-2xl border-border/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Total Group Spend</span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-foreground">
              {formatCurrency(ledger?.totalExpense || 0)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Across {expenses.length} recorded receipt{expenses.length !== 1 ? 's' : ''}
            </p>
          </div>
        </Card>

        {/* My Total Paid */}
        <Card className="p-5 rounded-2xl border-border/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>You Paid Directly</span>
            <ArrowUpRight className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-foreground">
              {formatCurrency(myBalance?.totalPaid || 0)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Your share: {formatCurrency(myBalance?.totalShare || 0)}
            </p>
          </div>
        </Card>

        {/* Net Settlement Status */}
        <Card className="p-5 rounded-2xl border-border/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Your Net Balance</span>
            <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <p
              className={`text-2xl font-black ${
                netAmount > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : netAmount < 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-foreground'
              }`}
            >
              {netAmount > 0 ? '+' : ''}
              {formatCurrency(netAmount)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {netAmount > 0
                ? 'You are owed money by others'
                : netAmount < 0
                ? 'You owe money to the group'
                : 'All your debts are fully settled'}
            </p>
          </div>
        </Card>
      </div>

      {/* Sub Tabs: Stream vs Settlement */}
      <Tabs
        value={activeSubTab}
        onValueChange={(v) => setActiveSubTab(v as 'stream' | 'settlement')}
      >
        <TabsList className="bg-muted/60 p-1 rounded-2xl">
          <TabsTrigger value="stream" className="rounded-xl px-4 py-1.5 text-xs font-semibold">
            All Expenses ({expenses.length})
          </TabsTrigger>
          <TabsTrigger
            value="settlement"
            className="rounded-xl px-4 py-1.5 text-xs font-semibold gap-1.5"
          >
            <span>Who Owes Whom</span>
            {ledger?.settlements && ledger.settlements.length > 0 && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold">
                {ledger.settlements.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Expense Stream */}
        <TabsContent value="stream" className="space-y-4 pt-2">
          {expenses.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No expenses logged yet"
              description="Start recording shared expenses like petrol, toll charges, homestays, or highway restaurant meals."
              actionLabel="Log First Expense"
              onAction={() => setShowCreateDialog(true)}
            />
          ) : (
            <div className="space-y-3">
              {expenses.map((expense: Expense) => {
                const isPayer = expense.paidById === user?.id;
                return (
                  <Card
                    key={expense.id}
                    className="p-4 sm:p-5 rounded-2xl border-border/80 hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {CATEGORY_LABELS[expense.category]?.slice(0, 2) || '💰'}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm sm:text-base text-foreground">
                            {expense.title}
                          </h4>
                          <Badge variant="outline" className="text-[10px] font-medium py-0">
                            {CATEGORY_LABELS[expense.category] || expense.category}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] font-medium py-0">
                            {PAYMENT_METHOD_LABELS[expense.paymentMethod] || expense.paymentMethod}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                          <span>
                            Paid by{' '}
                            <span className="font-semibold text-foreground">
                              {isPayer ? 'You' : expense.paidBy?.displayName || 'Traveler'}
                            </span>
                          </span>
                          <span>•</span>
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                          {expense.notes && (
                            <>
                              <span>•</span>
                              <span className="italic">{expense.notes}</span>
                            </>
                          )}
                        </p>

                        {/* Splits chips */}
                        {expense.splits && expense.splits.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                            <span className="text-[11px] text-muted-foreground font-medium">
                              Split with:
                            </span>
                            {expense.splits.map((split: ExpenseSplit) => {
                              const isSelf = split.userId === user?.id;
                              return (
                                <span
                                  key={split.id}
                                  className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium flex items-center gap-1 ${
                                    split.isSettled
                                      ? 'bg-muted/40 border-border/60 text-muted-foreground line-through'
                                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                  }`}
                                >
                                  {isSelf ? 'You' : split.user?.displayName || 'Member'}:{' '}
                                  {formatCurrency(split.amount)}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-border/60 gap-1 shrink-0">
                      <p className="text-lg font-black text-foreground">
                        {formatCurrency(expense.amount)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteMutation.mutate(expense.id)}
                        disabled={deleteMutation.isPending}
                        title="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Settlement Ledger ("Who Owes Whom") */}
        <TabsContent value="settlement" className="space-y-6 pt-2">
          {/* Who Owes Whom cards */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Minimal Debt Settlements (Direct Transfers)
            </h3>

            {ledger?.settlements && ledger.settlements.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {ledger.settlements.map((settlement, idx) => {
                  const isYouPaying = settlement.fromUserId === user?.id;
                  const isYouReceiving = settlement.toUserId === user?.id;

                  return (
                    <Card
                      key={idx}
                      className="p-4 rounded-2xl border-border/80 flex items-center justify-between gap-4 bg-muted/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {isYouPaying ? 'OUT' : isYouReceiving ? 'IN' : 'PAY'}
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">
                            {isYouPaying ? 'You owe' : settlement.fromName}
                          </p>
                          <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
                            <span>{isYouPaying ? 'You' : settlement.fromName}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{isYouReceiving ? 'You' : settlement.toName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-black text-base text-foreground">
                          {formatCurrency(settlement.amount)}
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold py-0 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                        >
                          UPI Transfer
                        </Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-6 rounded-2xl border-border/80 text-center space-y-2 bg-muted/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm text-foreground">Everyone is all squared up!</h4>
                <p className="text-xs text-muted-foreground">
                  No unsettled debts pending among trip crew members.
                </p>
              </Card>
            )}
          </div>

          {/* Member Balance Ledger Table */}
          <div className="space-y-3 pt-4 border-t border-border/60">
            <h3 className="font-bold text-base text-foreground">Crew Balance Breakdown</h3>

            <div className="overflow-x-auto rounded-2xl border border-border/80">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 border-b border-border/80 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3 px-4 text-left">Member</th>
                    <th className="py-3 px-4 text-right">Total Paid</th>
                    <th className="py-3 px-4 text-right">Total Share</th>
                    <th className="py-3 px-4 text-right">Net Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {ledger?.balances?.map((member) => {
                    const isSelf = member.userId === user?.id;
                    return (
                      <tr key={member.userId} className="hover:bg-muted/30">
                        <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center">
                            {member.displayName.slice(0, 2).toUpperCase()}
                          </div>
                          <span>
                            {member.displayName} {isSelf && '(You)'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground">
                          {formatCurrency(member.totalPaid)}
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground">
                          {formatCurrency(member.totalShare)}
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-black ${
                            member.netBalance > 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : member.netBalance < 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {member.netBalance > 0 ? '+' : ''}
                          {formatCurrency(member.netBalance)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Log Expense Dialog */}
      <CreateExpenseDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        trip={trip}
      />
    </div>
  );
}
