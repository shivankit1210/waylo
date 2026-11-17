import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
export const PACKING_QUERY_KEY = (tripId) => ['packing', tripId];
export const BAGS_QUERY_KEY = (tripId) => ['luggageBags', tripId];
export function usePackingLists(tripId) {
    return useQuery({
        queryKey: PACKING_QUERY_KEY(tripId),
        queryFn: () => api.getPackingLists(tripId),
        enabled: Boolean(tripId),
    });
}
export function useLuggageBags(tripId) {
    return useQuery({
        queryKey: BAGS_QUERY_KEY(tripId),
        queryFn: () => api.getLuggageBags(tripId),
        enabled: Boolean(tripId),
    });
}
export function useCreatePackingList(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.createPackingList(tripId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
        },
    });
}
export function useUpdatePackingList(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ listId, data }) => api.updatePackingList(tripId, listId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
        },
    });
}
export function useDeletePackingList(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (listId) => api.deletePackingList(tripId, listId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
        },
    });
}
export function useApplyPackingTemplate(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ templateKey, name }) => api.applyTemplate(tripId, templateKey, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
        },
    });
}
export function useCreateLuggageBag(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.createLuggageBag(tripId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BAGS_QUERY_KEY(tripId) });
            queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
        },
    });
}
export function useUpdateLuggageBag(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bagId, data }) => api.updateLuggageBag(tripId, bagId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BAGS_QUERY_KEY(tripId) });
            queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
        },
    });
}
export function useDeleteLuggageBag(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (bagId) => api.deleteLuggageBag(tripId, bagId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BAGS_QUERY_KEY(tripId) });
            queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
        },
    });
}
export function useCreatePackingItem(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ listId, data }) => api.createPackingItem(tripId, listId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
        },
    });
}
export function useUpdatePackingItem(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ itemId, data }) => api.updatePackingItem(tripId, itemId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
        },
    });
}
export function useUpdateItemStatus(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ itemId, status }) => api.updateItemStatus(tripId, itemId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
        },
    });
}
export function useBatchUpdateStatus(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ itemIds, status }) => api.batchUpdateStatus(tripId, itemIds, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
        },
    });
}
export function useDeletePackingItem(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (itemId) => api.deletePackingItem(tripId, itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
        },
    });
}
//# sourceMappingURL=hooks.js.map