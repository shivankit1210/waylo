import type { TripWithDetails } from '@waylo/shared';
import { useTripAnalytics } from './hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Fuel,
  Receipt,
  Route,
  CheckCircle2,
  Users,
  Compass,
  FileDown,
  Printer,
  Calendar,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TripAnalyticsReportProps {
  trip: TripWithDetails;
}

export function TripAnalyticsReport({ trip }: TripAnalyticsReportProps) {
  const { data: analytics, isLoading } = useTripAnalytics(trip.id);

  const handlePrintExport = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!analytics) return;
    const blob = new Blob([JSON.stringify({ trip, analytics }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip.name.toLowerCase().replace(/\s+/g, '-')}-expedition-report.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Expedition report exported as JSON! 📊');
  };

  if (isLoading || !analytics) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-32 rounded-3xl bg-muted/40" />
        ))}
      </div>
    );
  }

  const { expenses, fuelAnalytics, stopsCount, crewStats } = analytics;
  const currencySymbol = expenses.currency === 'INR' ? '₹' : '$';

  return (
    <div className="space-y-8 print:p-0">
      {/* Action / Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            Expedition Analytics & Performance Report
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Complete telemetry breakdown: route mileage, fuel efficiency, budget variance, and crew progress.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportJSON} className="gap-2 rounded-xl">
            <FileDown className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintExport} className="gap-2 rounded-xl">
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Distance */}
        <Card className="p-5 rounded-3xl border-border/80 bg-gradient-to-br from-card via-card to-blue-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Distance Covered
            </span>
            <Route className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-foreground">
            {analytics.totalDistanceLoggedKm.toLocaleString()}{' '}
            <span className="text-sm font-semibold text-muted-foreground">km</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Planned: {analytics.totalDistancePlannedKm} km ({analytics.totalDays} Days)
          </p>
        </Card>

        {/* Total Expenses */}
        <Card className="p-5 rounded-3xl border-border/80 bg-gradient-to-br from-card via-card to-emerald-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Spent
            </span>
            <Receipt className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-foreground">
            {currencySymbol}
            {Math.round(expenses.totalSpent / 100).toLocaleString()}
          </p>
          <p
            className={`text-xs font-medium ${
              expenses.budgetVariance >= 0 ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {expenses.budgetVariance >= 0
              ? `Under budget by ${currencySymbol}${Math.round(expenses.budgetVariance / 100).toLocaleString()}`
              : `Over budget by ${currencySymbol}${Math.round(Math.abs(expenses.budgetVariance) / 100).toLocaleString()}`}
          </p>
        </Card>

        {/* Fuel Efficiency */}
        <Card className="p-5 rounded-3xl border-border/80 bg-gradient-to-br from-card via-card to-amber-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Fuel Efficiency
            </span>
            <Fuel className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-foreground">
            {fuelAnalytics.averageKmPerLiter || '—'}{' '}
            <span className="text-sm font-semibold text-muted-foreground">km/L</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {fuelAnalytics.totalFuelLiters} L consumed ({fuelAnalytics.logsCount} refills)
          </p>
        </Card>

        {/* Itinerary Progress */}
        <Card className="p-5 rounded-3xl border-border/80 bg-gradient-to-br from-card via-card to-purple-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Route Stops
            </span>
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-foreground">
            {stopsCount.completed} / {stopsCount.total}
          </p>
          <p className="text-xs text-muted-foreground">
            {stopsCount.total > 0
              ? `${Math.round((stopsCount.completed / stopsCount.total) * 100)}% route milestones verified`
              : 'No stops logged'}
          </p>
        </Card>
      </div>

      {/* Secondary Metrics: Cost Breakdown & Crew Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Cost Analysis Breakdown */}
        <Card className="p-6 md:col-span-2 rounded-3xl border-border/80 space-y-5">
          <h4 className="font-bold text-base text-foreground flex items-center justify-between">
            <span>Expense Category Allocation</span>
            <span className="text-xs font-normal text-muted-foreground">
              Avg {currencySymbol}
              {Math.round(expenses.averagePerDay / 100)} / day · {currencySymbol}
              {Math.round(expenses.averagePerPerson / 100)} / rider
            </span>
          </h4>

          {expenses.categoryBreakdown.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center">No categorized expenses recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {expenses.categoryBreakdown.map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="capitalize text-foreground font-semibold">
                      {item.category.replace(/_/g, ' ').toLowerCase()} ({item.count})
                    </span>
                    <span className="text-muted-foreground">
                      {currencySymbol}
                      {Math.round(item.amount / 100).toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Crew & Journey Readiness Stats */}
        <Card className="p-6 rounded-3xl border-border/80 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-base text-foreground">Crew & Expedition Vitals</h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground">Riders & Drivers</span>
                <span className="font-bold text-foreground">{crewStats.totalMembers} Members</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground">Cost per Kilometre</span>
                <span className="font-bold text-foreground">
                  {currencySymbol}
                  {expenses.costPerKm.toFixed(2)} / km
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground">Journal Entries</span>
                <span className="font-bold text-foreground">{crewStats.journalEntriesCount} Logs</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground">Pinned Highlights</span>
                <span className="font-bold text-foreground">{crewStats.highlightsCount} Spots</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Packing Ready</span>
                <span className="font-bold text-emerald-500">
                  {crewStats.packingCompletionPercentage}% Packed
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-primary leading-relaxed">
            <span className="font-semibold block mb-0.5">💡 Copilot Trip Debrief</span>
            Your average fuel burn was highly efficient for high-altitude passes. Keep tyre pressures balanced for return leg.
          </div>
        </Card>
      </div>
    </div>
  );
}
