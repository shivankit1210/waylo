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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InspectionStatus, type Vehicle, type TripWithDetails } from '@waylo/shared';
import { useAddInspection } from './hooks';

interface VehicleInspectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripWithDetails | any;
  vehicle: Vehicle;
}

const CHECKLIST_ITEMS = [
  { key: 'tyreTreadPressure', label: 'Tyre Pressure & Tread Condition' },
  { key: 'brakes', label: 'Brakes & Brake Fluid Level' },
  { key: 'chainLubeTension', label: 'Drive Chain / Belt Lube & Tension' },
  { key: 'engineOilLevel', label: 'Engine Oil & Coolant Levels' },
  { key: 'headlightsHornIndicators', label: 'Headlights, Indicators & Horn' },
  { key: 'cablesClutchThrottle', label: 'Clutch & Throttle Free Play' },
  { key: 'luggageMountsBungees', label: 'Luggage Racks & Straps Security' },
];

export function VehicleInspectionDialog({
  open,
  onOpenChange,
  trip,
  vehicle,
}: VehicleInspectionDialogProps) {
  const addInspectionMutation = useAddInspection(trip.id);

  const [status, setStatus] = useState<InspectionStatus>(InspectionStatus.PASSED);
  const [odometer, setOdometer] = useState(
    vehicle.currentOdometer ? String(vehicle.currentOdometer) : ''
  );
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    tyreTreadPressure: true,
    brakes: true,
    chainLubeTension: true,
    engineOilLevel: true,
    headlightsHornIndicators: true,
    cablesClutchThrottle: true,
    luggageMountsBungees: true,
  });
  const [notes, setNotes] = useState('');

  const toggleChecklistItem = (key: string) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addInspectionMutation.mutateAsync({
      vehicleId: vehicle.id,
      data: {
        vehicleId: vehicle.id,
        status,
        checklist,
        odometer: odometer ? parseFloat(odometer) : null,
        notes: notes.trim() || null,
      },
    });

    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Vehicle Safety Inspection</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Complete pre-trip mechanical and safety checklist for {vehicle.name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Status & Odometer */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Inspection Result</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as InspectionStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={InspectionStatus.PASSED}>
                    🟢 Passed (Road-Ready)
                  </SelectItem>
                  <SelectItem value={InspectionStatus.ATTENTION_NEEDED}>
                    🟡 Needs Attention
                  </SelectItem>
                  <SelectItem value={InspectionStatus.FAILED}>
                    🔴 Critical Failure
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="insp-odo" className="text-xs font-semibold">
                Odometer (km)
              </Label>
              <Input
                id="insp-odo"
                type="number"
                placeholder="e.g. 4200"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
              />
            </div>
          </div>

          {/* Checklist items */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <Label className="text-xs font-semibold">Pre-Trip Checklist Items</Label>

            <div className="space-y-2">
              {CHECKLIST_ITEMS.map((item) => {
                const checked = Boolean(checklist[item.key]);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleChecklistItem(item.key)}
                    className={`w-full p-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                      checked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="font-bold text-sm">
                      {checked ? '✓ Checked' : '○ Pending'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="insp-notes" className="text-xs font-semibold">
              Inspection Notes / Service Remarks
            </Label>
            <Textarea
              id="insp-notes"
              placeholder="e.g. Front tyre 32 PSI, chain lubed with Motul, brake pads 80% remaining."
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
              disabled={addInspectionMutation.isPending}
              className="rounded-xl font-bold"
            >
              {addInspectionMutation.isPending ? 'Saving...' : 'Submit Inspection'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
