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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VehicleType, FuelType, type TripWithDetails } from '@waylo/shared';
import { useCreateVehicle } from './hooks';

interface CreateVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripWithDetails | any;
}

export function CreateVehicleDialog({
  open,
  onOpenChange,
  trip,
}: CreateVehicleDialogProps) {
  const createMutation = useCreateVehicle(trip.id);

  const [name, setName] = useState('');
  const [type, setType] = useState<VehicleType>(VehicleType.MOTORCYCLE);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>(FuelType.PETROL);
  const [tankCapacityLiters, setTankCapacityLiters] = useState('');
  const [odometer, setOdometer] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createMutation.mutateAsync({
      name: name.trim(),
      type,
      make: make.trim() || null,
      model: model.trim() || null,
      registrationNumber: registrationNumber.trim().toUpperCase() || null,
      fuelType,
      tankCapacityLiters: tankCapacityLiters ? parseFloat(tankCapacityLiters) : null,
      initialOdometer: odometer ? parseFloat(odometer) : null,
      currentOdometer: odometer ? parseFloat(odometer) : null,
      tripId: trip.id,
    });

    setName('');
    setMake('');
    setModel('');
    setRegistrationNumber('');
    setTankCapacityLiters('');
    setOdometer('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Register Vehicle</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Add a motorcycle, car, or campervan to track fuel efficiency and pre-trip checklists.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="v-name" className="text-xs font-semibold">
              Vehicle Nickname *
            </Label>
            <Input
              id="v-name"
              placeholder="e.g. Royal Enfield Himalayan 450, Road King"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Vehicle Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as VehicleType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={VehicleType.MOTORCYCLE}>🏍️ Motorcycle</SelectItem>
                  <SelectItem value={VehicleType.CAR}>🚗 Car</SelectItem>
                  <SelectItem value={VehicleType.SUV}>🚙 SUV</SelectItem>
                  <SelectItem value={VehicleType.VAN}>🚐 Van / Camper</SelectItem>
                  <SelectItem value={VehicleType.BICYCLE}>🚲 Bicycle</SelectItem>
                  <SelectItem value={VehicleType.RENTAL}>🚕 Rental</SelectItem>
                  <SelectItem value={VehicleType.OTHER}>⚡ Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Fuel Type</Label>
              <Select value={fuelType} onValueChange={(v) => setFuelType(v as FuelType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FuelType.PETROL}>⛽ Petrol</SelectItem>
                  <SelectItem value={FuelType.DIESEL}>🛢️ Diesel</SelectItem>
                  <SelectItem value={FuelType.ELECTRIC}>⚡ Electric (EV)</SelectItem>
                  <SelectItem value={FuelType.HYBRID}>🌿 Hybrid</SelectItem>
                  <SelectItem value={FuelType.CNG}>💨 CNG</SelectItem>
                  <SelectItem value={FuelType.OTHER}>✨ Other / None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="v-make" className="text-xs font-semibold">
                Make / Manufacturer
              </Label>
              <Input
                id="v-make"
                placeholder="e.g. Royal Enfield, Toyota"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="v-model" className="text-xs font-semibold">
                Model
              </Label>
              <Input
                id="v-model"
                placeholder="e.g. Himalayan, Fortuner"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="v-reg" className="text-xs font-semibold">
                Registration Plate #
              </Label>
              <Input
                id="v-reg"
                placeholder="e.g. MH 02 EE 7788"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="v-tank" className="text-xs font-semibold">
                Tank Capacity (Liters)
              </Label>
              <Input
                id="v-tank"
                type="number"
                step="0.1"
                placeholder="e.g. 17"
                value={tankCapacityLiters}
                onChange={(e) => setTankCapacityLiters(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="v-odo" className="text-xs font-semibold">
              Current Odometer Reading (km)
            </Label>
            <Input
              id="v-odo"
              type="number"
              step="1"
              placeholder="e.g. 4200"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
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
              disabled={createMutation.isPending || !name.trim()}
              className="rounded-xl font-bold"
            >
              {createMutation.isPending ? 'Registering...' : 'Register Vehicle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
