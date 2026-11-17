import type { UpdateVehicleInput, CreateFuelLogInput, CreateInspectionInput } from '@waylo/shared';
export declare function useVehicles(tripId: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").Vehicle[], Error>;
export declare function useFuelLogs(tripId: string, vehicleId: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").FuelLog[], Error>;
export declare function useInspections(tripId: string, vehicleId: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").VehicleInspection[], Error>;
export declare function useCreateVehicle(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").Vehicle, any, {
    type: import("@waylo/shared").VehicleType;
    name: string;
    fuelType: import("@waylo/shared").FuelType;
    make?: string | null | undefined;
    model?: string | null | undefined;
    year?: number | null | undefined;
    registrationNumber?: string | null | undefined;
    tankCapacityLiters?: number | null | undefined;
    initialOdometer?: number | null | undefined;
    currentOdometer?: number | null | undefined;
    tripId?: string | null | undefined;
}, unknown>;
export declare function useUpdateVehicle(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").Vehicle, any, {
    vehicleId: string;
    data: UpdateVehicleInput;
}, unknown>;
export declare function useDeleteVehicle(tripId: string): import("@tanstack/react-query").UseMutationResult<void, any, string, unknown>;
export declare function useAddFuelLog(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").FuelLog, any, {
    vehicleId: string;
    data: CreateFuelLogInput;
}, unknown>;
export declare function useAddInspection(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").VehicleInspection, any, {
    vehicleId: string;
    data: CreateInspectionInput;
}, unknown>;
//# sourceMappingURL=hooks.d.ts.map