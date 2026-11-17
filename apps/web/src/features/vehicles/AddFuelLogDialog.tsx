import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { Vehicle, TripWithDetails } from '@waylo/shared';
import { useAddFuelLog } from './hooks';

interface AddFuelLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripWithDetails | any;
  vehicle: Vehicle;
}

export function AddFuelLogDialog({
  open,
  onOpenChange,
  trip,
  vehicle,
}: AddFuelLogDialogProps) {
  const addLogMutation = useAddFuelLog(trip.id);

  const [odometer, setOdometer] = useState(
    vehicle.currentOdometer ? String(vehicle.currentOdometer) : ''
  );
  const [litersOrKwh, setLitersOrKwh] = useState('');
  const [displayCost, setDisplayCost] = useState('');
  const [isFullTank, setIsFullTank] = useState(true);
  const [stationLocation, setStationLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const odoNum = parseFloat(odometer);
    const volNum = parseFloat(litersOrKwh);
    const costNum = parseFloat(displayCost);

    if (isNaN(odoNum) || isNaN(volNum) || isNaN(costNum) || volNum <= 0 || costNum <= 0) {
      return;
    }

    const costInCents = Math.round(costNum * 100);
    const pricePerUnit = Number((costNum / volNum).toFixed(2));

    await addLogMutation.mutateAsync({
      vehicleId: vehicle.id,
      data: {
        vehicleId: vehicle.id,
        odometer: odoNum,
        litersOrKwh: volNum,
        cost: costInCents,
        currency: (trip.currency || 'INR') as any,
        isFullTank,
        fuelPricePerUnit: pricePerUnit,
        stationLocation: stationLocation.trim() || null,
        notes: notes.trim() || null,
      },
    });

    setLitersOrKwh('');
    setDisplayCost('');
    setStationLocation('');
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Log Fuel Refill</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Record fuel volume and odometer for {vehicle.name} to track mileage and fuel efficiency.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Odometer */}
          <div className="space-y-1.5">
            <Label htmlFor="fuel-odo" className="text-xs font-semibold">
              Current Odometer (km) *
            </Label>
            <Input
              id="fuel-odo"
              type="number"
              step="0.1"
              placeholder="e.g. 4620"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              required
            />
          </div>

          {/* Volume & Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fuel-vol" className="text-xs font-semibold">
                Volume (Liters / kWh) *
              </Label>
              <Input
                id="fuel-vol"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g. 14.5"
                value={litersOrKwh}
                onChange={(e) => setLitersOrKwh(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fuel-cost" className="text-xs font-semibold">
                Total Cost ({trip.currency || 'INR'}) *
              </Label>
              <Input
                id="fuel-cost"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g. 1530"
                value={displayCost}
                onChange={(e) => setDisplayCost(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Full Tank Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/80">
            <div className="space-y-0.5">
              <Label htmlFor="fuel-full" className="text-xs font-bold text-foreground cursor-pointer">
                Full Tank Fill-up (Auto-Cutoff)
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Required to accurately compute km/L fuel efficiency.
              </p>
            </div>
            <Switch
              id="fuel-full"
              checked={isFullTank}
              onCheckedChange={setIsFullTank}
            />
          </div>

          {/* Station Location */}
          <div className="space-y-1.5">
            <Label htmlFor="fuel-station" className="text-xs font-semibold">
              Gas Station / Highway Outlet
            </Label>
            <Input
              id="fuel-station"
              placeholder="e.g. HPCL Express Highway, IOCL Chiplun"
              value={stationLocation}
              onChange={(e) => setStationLocation(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="fuel-notes" className="text-xs font-semibold">
              Notes (optional)
            </Label>
            <Textarea
              id="fuel-notes"
              placeholder="e.g. Tyre pressure 32 PSI, windscreen cleaned."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addLogMutation.isPending || !odometer || !litersOrKwh || !displayCost}
              className="rounded-xl font-bold"
            >
              {addLogMutation.isPending ? 'Logging...' : 'Save Fuel Log'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
