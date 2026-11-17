import type { Vehicle, FuelLog, VehicleInspection, CreateVehicleInput, UpdateVehicleInput, CreateFuelLogInput, CreateInspectionInput } from '@waylo/shared';
export declare function getVehicles(tripId: string): Promise<Vehicle[]>;
export declare function createVehicle(tripId: string, data: CreateVehicleInput): Promise<Vehicle>;
export declare function updateVehicle(tripId: string, vehicleId: string, data: UpdateVehicleInput): Promise<Vehicle>;
export declare function deleteVehicle(tripId: string, vehicleId: string): Promise<void>;
export declare function getFuelLogs(tripId: string, vehicleId: string): Promise<FuelLog[]>;
export declare function addFuelLog(tripId: string, vehicleId: string, data: CreateFuelLogInput): Promise<FuelLog>;
export declare function getInspections(tripId: string, vehicleId: string): Promise<VehicleInspection[]>;
export declare function addInspection(tripId: string, vehicleId: string, data: CreateInspectionInput): Promise<VehicleInspection>;
//# sourceMappingURL=api.d.ts.map