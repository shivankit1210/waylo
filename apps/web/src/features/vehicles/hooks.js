import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as api from './api';
export function useVehicles(tripId) {
    return useQuery({
        queryKey: ['vehicles', tripId],
        queryFn: () => api.getVehicles(tripId),
        enabled: Boolean(tripId),
    });
}
export function useFuelLogs(tripId, vehicleId) {
    return useQuery({
        queryKey: ['fuel-logs', tripId, vehicleId],
        queryFn: () => api.getFuelLogs(tripId, vehicleId),
        enabled: Boolean(tripId && vehicleId),
    });
}
export function useInspections(tripId, vehicleId) {
    return useQuery({
        queryKey: ['inspections', tripId, vehicleId],
        queryFn: () => api.getInspections(tripId, vehicleId),
        enabled: Boolean(tripId && vehicleId),
    });
}
export function useCreateVehicle(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.createVehicle(tripId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles', tripId] });
            toast.success('Vehicle registered for expedition');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to register vehicle');
        },
    });
}
export function useUpdateVehicle(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ vehicleId, data }) => api.updateVehicle(tripId, vehicleId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles', tripId] });
            toast.success('Vehicle profile updated');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to update vehicle');
        },
    });
}
export function useDeleteVehicle(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (vehicleId) => api.deleteVehicle(tripId, vehicleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles', tripId] });
            toast.success('Vehicle removed');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to delete vehicle');
        },
    });
}
export function useAddFuelLog(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ vehicleId, data }) => api.addFuelLog(tripId, vehicleId, data),
        onSuccess: (_, { vehicleId }) => {
            queryClient.invalidateQueries({ queryKey: ['fuel-logs', tripId, vehicleId] });
            queryClient.invalidateQueries({ queryKey: ['vehicles', tripId] });
            toast.success('Fuel log recorded');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to record fuel log');
        },
    });
}
export function useAddInspection(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ vehicleId, data }) => api.addInspection(tripId, vehicleId, data),
        onSuccess: (_, { vehicleId }) => {
            queryClient.invalidateQueries({ queryKey: ['inspections', tripId, vehicleId] });
            queryClient.invalidateQueries({ queryKey: ['vehicles', tripId] });
            toast.success('Inspection checklist saved');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to save inspection');
        },
    });
}
//# sourceMappingURL=hooks.js.map