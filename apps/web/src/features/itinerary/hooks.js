import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
export const ITINERARY_QUERY_KEY = (tripId) => ['itinerary', tripId];
export function useItinerary(tripId) {
    return useQuery({
        queryKey: ITINERARY_QUERY_KEY(tripId),
        queryFn: () => api.getItinerary(tripId),
        enabled: Boolean(tripId),
    });
}
export function useCreateDay(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.createDay(tripId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
        },
    });
}
export function useBatchGenerateDays(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.batchGenerateDays(tripId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
        },
    });
}
export function useUpdateDay(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ dayId, data }) => api.updateDay(tripId, dayId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
        },
    });
}
export function useDeleteDay(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dayId) => api.deleteDay(tripId, dayId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
        },
    });
}
export function useCreateItem(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ dayId, data }) => api.createItem(tripId, dayId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
        },
    });
}
export function useUpdateItem(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ dayId, itemId, data, }) => api.updateItem(tripId, dayId, itemId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
        },
    });
}
export function useToggleItemComplete(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ dayId, itemId }) => api.toggleItemComplete(tripId, dayId, itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
        },
    });
}
export function useDeleteItem(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ dayId, itemId }) => api.deleteItem(tripId, dayId, itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
        },
    });
}
export function useReorderItems(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ dayId, items, }) => api.reorderItems(tripId, dayId, items),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
        },
    });
}
//# sourceMappingURL=hooks.js.map