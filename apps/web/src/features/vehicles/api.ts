import { apiClient } from '@/lib/api';
import type {
  Vehicle,
  FuelLog,
  VehicleInspection,
  CreateVehicleInput,
  UpdateVehicleInput,
  CreateFuelLogInput,
  CreateInspectionInput,
  ApiResponse,
} from '@waylo/shared';

export async function getVehicles(tripId: string): Promise<Vehicle[]> {
  const response = await apiClient.get<ApiResponse<Vehicle[]>>(`/trips/${tripId}/vehicles`);
  return response.data.data;
}

export async function createVehicle(tripId: string, data: CreateVehicleInput): Promise<Vehicle> {
  const response = await apiClient.post<ApiResponse<Vehicle>>(`/trips/${tripId}/vehicles`, data);
  return response.data.data;
}

export async function updateVehicle(
  tripId: string,
  vehicleId: string,
  data: UpdateVehicleInput
): Promise<Vehicle> {
  const response = await apiClient.put<ApiResponse<Vehicle>>(
    `/trips/${tripId}/vehicles/${vehicleId}`,
    data
  );
  return response.data.data;
}

export async function deleteVehicle(tripId: string, vehicleId: string): Promise<void> {
  await apiClient.delete(`/trips/${tripId}/vehicles/${vehicleId}`);
}

export async function getFuelLogs(tripId: string, vehicleId: string): Promise<FuelLog[]> {
  const response = await apiClient.get<ApiResponse<FuelLog[]>>(
    `/trips/${tripId}/vehicles/${vehicleId}/fuel-logs`
  );
  return response.data.data;
}

export async function addFuelLog(
  tripId: string,
  vehicleId: string,
  data: CreateFuelLogInput
): Promise<FuelLog> {
  const response = await apiClient.post<ApiResponse<FuelLog>>(
    `/trips/${tripId}/vehicles/${vehicleId}/fuel-logs`,
    data
  );
  return response.data.data;
}

export async function getInspections(
  tripId: string,
  vehicleId: string
): Promise<VehicleInspection[]> {
  const response = await apiClient.get<ApiResponse<VehicleInspection[]>>(
    `/trips/${tripId}/vehicles/${vehicleId}/inspections`
  );
  return response.data.data;
}

export async function addInspection(
  tripId: string,
  vehicleId: string,
  data: CreateInspectionInput
): Promise<VehicleInspection> {
  const response = await apiClient.post<ApiResponse<VehicleInspection>>(
    `/trips/${tripId}/vehicles/${vehicleId}/inspections`,
    data
  );
  return response.data.data;
}
