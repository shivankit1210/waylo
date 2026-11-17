import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type {
  CreatePackingListInput,
  UpdatePackingListInput,
  CreateLuggageBagInput,
  UpdateLuggageBagInput,
  CreatePackingItemInput,
  UpdatePackingItemInput,
  PackingStatus,
} from '@waylo/shared';

export const PACKING_QUERY_KEY = (tripId: string) => ['packing', tripId];
export const BAGS_QUERY_KEY = (tripId: string) => ['luggageBags', tripId];

export function usePackingLists(tripId: string) {
  return useQuery({
    queryKey: PACKING_QUERY_KEY(tripId),
    queryFn: () => api.getPackingLists(tripId),
    enabled: Boolean(tripId),
  });
}

export function useLuggageBags(tripId: string) {
  return useQuery({
    queryKey: BAGS_QUERY_KEY(tripId),
    queryFn: () => api.getLuggageBags(tripId),
    enabled: Boolean(tripId),
  });
}

export function useCreatePackingList(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePackingListInput) => api.createPackingList(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
    },
  });
}

export function useUpdatePackingList(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, data }: { listId: string; data: UpdatePackingListInput }) =>
      api.updatePackingList(tripId, listId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
    },
  });
}

export function useDeletePackingList(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listId: string) => api.deletePackingList(tripId, listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
    },
  });
}

export function useApplyPackingTemplate(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ templateKey, name }: { templateKey: string; name?: string }) =>
      api.applyTemplate(tripId, templateKey, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
    },
  });
}

export function useCreateLuggageBag(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLuggageBagInput) => api.createLuggageBag(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BAGS_QUERY_KEY(tripId) });
      queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
    },
  });
}

export function useUpdateLuggageBag(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bagId, data }: { bagId: string; data: UpdateLuggageBagInput }) =>
      api.updateLuggageBag(tripId, bagId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BAGS_QUERY_KEY(tripId) });
      queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
    },
  });
}

export function useDeleteLuggageBag(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bagId: string) => api.deleteLuggageBag(tripId, bagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BAGS_QUERY_KEY(tripId) });
      queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
    },
  });
}

export function useCreatePackingItem(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, data }: { listId: string; data: CreatePackingItemInput }) =>
      api.createPackingItem(tripId, listId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
    },
  });
}

export function useUpdatePackingItem(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdatePackingItemInput }) =>
      api.updatePackingItem(tripId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
    },
  });
}

export function useUpdateItemStatus(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, status }: { itemId: string; status: PackingStatus }) =>
      api.updateItemStatus(tripId, itemId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
    },
  });
}

export function useBatchUpdateStatus(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemIds, status }: { itemIds: string[]; status: PackingStatus }) =>
      api.batchUpdateStatus(tripId, itemIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
    },
  });
}

export function useDeletePackingItem(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => api.deletePackingItem(tripId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PACKING_QUERY_KEY(tripId) });
    },
  });
}
