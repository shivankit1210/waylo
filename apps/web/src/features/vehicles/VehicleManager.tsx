import { useState } from 'react';
import {
  Gauge,
  Fuel,
  ClipboardCheck,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import {
  useVehicles,
  useFuelLogs,
  useInspections,
  useDeleteVehicle,
} from './hooks';
import { CreateVehicleDialog } from './CreateVehicleDialog';
import { AddFuelLogDialog } from './AddFuelLogDialog';
import { VehicleInspectionDialog } from './VehicleInspectionDialog';
import type { TripWithDetails, Vehicle, FuelLog, VehicleInspection } from '@waylo/shared';

interface VehicleManagerProps {
  trip: TripWithDetails | any;
}

export function VehicleManager({ trip }: VehicleManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFuelDialog, setShowFuelDialog] = useState(false);
  const [showInspectDialog, setShowInspectDialog] = useState(false);

  const { data: vehicles = [], isLoading: isLoadingVehicles } = useVehicles(trip.id);
  const deleteMutation = useDeleteVehicle(trip.id);

  // Selected vehicle (defaults to first vehicle)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const activeVehicle =
    vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0] || null;

  const { data: fuelLogs = [], isLoading: isLoadingLogs } = useFuelLogs(
    trip.id,
    activeVehicle?.id || ''
  );
  const { data: inspections = [], isLoading: isLoadingInspections } = useInspections(
    trip.id,
    activeVehicle?.id || ''
  );

  const currency = trip.currency || 'INR';

  const formatCurrency = (amountInCents: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency === 'INR' ? 'INR' : currency,
      maximumFractionDigits: 0,
    }).format(amountInCents / 100);
  };

  if (isLoadingVehicles) {
    return (
      <div className="py-16 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Calculate vehicle fuel stats
  const totalFuelLiters = fuelLogs.reduce((acc, log) => acc + log.litersOrKwh, 0);
  const totalFuelCost = fuelLogs.reduce((acc, log) => acc + log.cost, 0);

  // Average efficiency among logs that have fuelEfficiencyKmPerUnit
  const logsWithEfficiency = fuelLogs.filter((l) => l.fuelEfficiencyKmPerUnit);
  const avgEfficiency =
    logsWithEfficiency.length > 0
      ? Number(
          (
            logsWithEfficiency.reduce((acc, l) => acc + (l.fuelEfficiencyKmPerUnit || 0), 0) /
            logsWithEfficiency.length
          ).toFixed(1)
        )
      : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Gauge className="h-6 w-6 text-primary" />
            Vehicles & Fuel Economy
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage expedition rides, track refuels & km/L mileage, and record pre-trip safety checklists.
          </p>
        </div>

        <Button
          onClick={() => setShowCreateDialog(true)}
          className="gap-2 rounded-xl font-bold shrink-0 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <EmptyState
          icon={Gauge}
          title="No vehicles added yet"
          description="Register your motorcycle, car, or SUV to log fuel fill-ups and complete pre-trip safety inspections."
          actionLabel="Register First Vehicle"
          onAction={() => setShowCreateDialog(true)}
        />
      ) : (
        <div className="space-y-6">
          {/* Vehicle Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {vehicles.map((v) => {
              const isSelected = activeVehicle?.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted'
                  }`}
                >
                  <span>{v.type === 'MOTORCYCLE' ? '🏍️' : '🚗'}</span>
                  <span>{v.name}</span>
                  {v.registrationNumber && (
                    <span className="opacity-75 font-mono text-[10px]">
                      ({v.registrationNumber})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeVehicle && (
            <div className="space-y-6">
              {/* Active Vehicle Hero Card */}
              <Card className="p-6 rounded-3xl border-border/80 bg-gradient-to-br from-card to-muted/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-black text-foreground">
                        {activeVehicle.name}
                      </h3>
                      <Badge variant="outline" className="text-xs font-medium">
                        {activeVehicle.make} {activeVehicle.model}
                      </Badge>
                      <Badge variant="secondary" className="text-xs font-medium">
                        {activeVehicle.fuelType}
                      </Badge>
                      {activeVehicle.registrationNumber && (
                        <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-black/10 dark:bg-white/10 font-bold">
                          {activeVehicle.registrationNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tank Capacity: {activeVehicle.tankCapacityLiters || 'N/A'} Liters • Current
                      Odometer:{' '}
                      <span className="font-bold text-foreground">
                        {activeVehicle.currentOdometer?.toLocaleString() || '0'} km
                      </span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      onClick={() => setShowFuelDialog(true)}
                      size="sm"
                      className="gap-1.5 rounded-xl text-xs font-bold"
                    >
                      <Fuel className="h-4 w-4" />
                      Log Fuel
                    </Button>
                    <Button
                      onClick={() => setShowInspectDialog(true)}
                      size="sm"
                      variant="outline"
                      className="gap-1.5 rounded-xl text-xs font-bold"
                    >
                      <ClipboardCheck className="h-4 w-4" />
                      Safety Check
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteMutation.mutate(activeVehicle.id)}
                      disabled={deleteMutation.isPending}
                      title="Remove vehicle"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/60">
                  <div className="p-3 rounded-2xl bg-muted/40">
                    <span className="text-[11px] font-semibold text-muted-foreground block">
                      Avg Fuel Economy
                    </span>
                    <span className="text-lg font-black text-foreground flex items-center gap-1 mt-0.5">
                      {avgEfficiency ? `${avgEfficiency} km/L` : 'Calculating...'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-muted/40">
                    <span className="text-[11px] font-semibold text-muted-foreground block">
                      Total Fuel Volume
                    </span>
                    <span className="text-lg font-black text-foreground mt-0.5 block">
                      {totalFuelLiters.toFixed(1)} L
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-muted/40">
                    <span className="text-[11px] font-semibold text-muted-foreground block">
                      Total Fuel Cost
                    </span>
                    <span className="text-lg font-black text-foreground mt-0.5 block">
                      {formatCurrency(totalFuelCost)}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-muted/40">
                    <span className="text-[11px] font-semibold text-muted-foreground block">
                      Last Checklist
                    </span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                      {inspections[0]?.status === 'PASSED' ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" /> Passed
                        </>
                      ) : inspections[0]?.status === 'ATTENTION_NEEDED' ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-amber-500" /> Attention
                        </>
                      ) : inspections[0]?.status === 'FAILED' ? (
                        <>
                          <XCircle className="h-4 w-4 text-rose-500" /> Failed
                        </>
                      ) : (
                        'No check yet'
                      )}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Fuel Logs & Inspection Tabs */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Fuel Logs Stream (2 Cols) */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-primary" />
                      Refuel History ({fuelLogs.length})
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFuelDialog(true)}
                      className="text-xs font-semibold text-primary"
                    >
                      + Refill
                    </Button>
                  </div>

                  {isLoadingLogs ? (
                    <LoadingSpinner />
                  ) : fuelLogs.length === 0 ? (
                    <Card className="p-6 text-center text-xs text-muted-foreground rounded-2xl border-border/80">
                      No fuel logs recorded yet for this vehicle.
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {fuelLogs.map((log: FuelLog) => (
                        <Card
                          key={log.id}
                          className="p-4 rounded-2xl border-border/80 flex items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-foreground">
                                {log.odometer.toLocaleString()} km
                              </span>
                              {log.fuelEfficiencyKmPerUnit && (
                                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-bold py-0">
                                  ⚡ {log.fuelEfficiencyKmPerUnit} km/L
                                </Badge>
                              )}
                              {log.isFullTank && (
                                <Badge variant="secondary" className="text-[10px] py-0">
                                  Full Tank
                                </Badge>
                              )}
                            </div>

                            <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(log.date).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span>{log.litersOrKwh} Liters</span>
                              {log.stationLocation && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {log.stationLocation}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="font-black text-sm sm:text-base text-foreground">
                              {formatCurrency(log.cost)}
                            </p>
                            {log.fuelPricePerUnit && (
                              <p className="text-[11px] text-muted-foreground">
                                ₹{log.fuelPricePerUnit.toFixed(2)}/L
                              </p>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pre-Trip Safety Checklists (1 Col) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-emerald-500" />
                      Safety Checklists
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowInspectDialog(true)}
                      className="text-xs font-semibold text-primary"
                    >
                      + Check
                    </Button>
                  </div>

                  {isLoadingInspections ? (
                    <LoadingSpinner />
                  ) : inspections.length === 0 ? (
                    <Card className="p-6 text-center text-xs text-muted-foreground rounded-2xl border-border/80">
                      No safety inspections logged yet.
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {inspections.map((insp: VehicleInspection) => (
                        <Card
                          key={insp.id}
                          className="p-4 rounded-2xl border-border/80 space-y-2 bg-muted/20"
                        >
                          <div className="flex items-center justify-between">
                            <Badge
                              className={`text-[11px] font-bold py-0 ${
                                insp.status === 'PASSED'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                  : insp.status === 'ATTENTION_NEEDED'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                              }`}
                            >
                              {insp.status === 'PASSED'
                                ? '✓ Road-Ready'
                                : insp.status === 'ATTENTION_NEEDED'
                                ? '⚠️ Attention Needed'
                                : '✕ Critical Failure'}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground">
                              {new Date(insp.inspectedAt).toLocaleDateString()}
                            </span>
                          </div>

                          {insp.odometer && (
                            <p className="text-xs font-semibold text-foreground">
                              Odometer: {insp.odometer.toLocaleString()} km
                            </p>
                          )}

                          {insp.notes && (
                            <p className="text-xs text-muted-foreground italic bg-background/50 p-2 rounded-xl border border-border/50">
                              "{insp.notes}"
                            </p>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <CreateVehicleDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        trip={trip}
      />

      {activeVehicle && (
        <>
          <AddFuelLogDialog
            open={showFuelDialog}
            onOpenChange={setShowFuelDialog}
            trip={trip}
            vehicle={activeVehicle}
          />
          <VehicleInspectionDialog
            open={showInspectDialog}
            onOpenChange={setShowInspectDialog}
            trip={trip}
            vehicle={activeVehicle}
          />
        </>
      )}
    </div>
  );
}
