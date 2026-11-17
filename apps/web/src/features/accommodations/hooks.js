import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as api from './api';
export function useAccommodations(tripId) {
    return useQuery({
        queryKey: ['accommodations', tripId],
        queryFn: () => api.getAccommodations(tripId),
        enabled: Boolean(tripId),
    });
}
export function useCreateAccommodation(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.createAccommodation(tripId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accommodations', tripId] });
            toast.success('Accommodation booking saved');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to save accommodation');
        },
    });
}
export function useUpdateAccommodation(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ accommodationId, data, }) => api.updateAccommodation(tripId, accommodationId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accommodations', tripId] });
            toast.success('Accommodation updated');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to update accommodation');
        },
    });
}
export function useDeleteAccommodation(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (accommodationId) => api.deleteAccommodation(tripId, accommodationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accommodations', tripId] });
            toast.success('Accommodation removed');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to delete accommodation');
        },
    });
}
//# sourceMappingURL=hooks.js.map