import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as api from './api';
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  CreateFuelLogInput,
  CreateInspectionInput,
} from '@waylo/shared';

export function useVehicles(tripId: string) {
  return useQuery({
    queryKey: ['vehicles', tripId],
    queryFn: () => api.getVehicles(tripId),
    enabled: Boolean(tripId),
  });
}

export function useFuelLogs(tripId: string, vehicleId: string) {
  return useQuery({
    queryKey: ['fuel-logs', tripId, vehicleId],
    queryFn: () => api.getFuelLogs(tripId, vehicleId),
    enabled: Boolean(tripId && vehicleId),
  });
}

export function useInspections(tripId: string, vehicleId: string) {
  return useQuery({
    queryKey: ['inspections', tripId, vehicleId],
    queryFn: () => api.getInspections(tripId, vehicleId),
    enabled: Boolean(tripId && vehicleId),
  });
}

export function useCreateVehicle(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVehicleInput) => api.createVehicle(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', tripId] });
      toast.success('Vehicle registered for expedition');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to register vehicle');
    },
  });
}

export function useUpdateVehicle(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, data }: { vehicleId: string; data: UpdateVehicleInput }) =>
      api.updateVehicle(tripId, vehicleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', tripId] });
      toast.success('Vehicle profile updated');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to update vehicle');
    },
  });
}

export function useDeleteVehicle(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId: string) => api.deleteVehicle(tripId, vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', tripId] });
      toast.success('Vehicle removed');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to delete vehicle');
    },
  });
}

export function useAddFuelLog(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, data }: { vehicleId: string; data: CreateFuelLogInput }) =>
      api.addFuelLog(tripId, vehicleId, data),
    onSuccess: (_, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: ['fuel-logs', tripId, vehicleId] });
      queryClient.invalidateQueries({ queryKey: ['vehicles', tripId] });
      toast.success('Fuel log recorded');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to record fuel log');
    },
  });
}

export function useAddInspection(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, data }: { vehicleId: string; data: CreateInspectionInput }) =>
      api.addInspection(tripId, vehicleId, data),
    onSuccess: (_, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: ['inspections', tripId, vehicleId] });
      queryClient.invalidateQueries({ queryKey: ['vehicles', tripId] });
      toast.success('Inspection checklist saved');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to save inspection');
    },
  });
}
