import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type {
  CreateItineraryDayInput,
  UpdateItineraryDayInput,
  BatchGenerateDaysInput,
  CreateItineraryItemInput,
  UpdateItineraryItemInput,
} from '@waylo/shared';

export const ITINERARY_QUERY_KEY = (tripId: string) => ['itinerary', tripId];

export function useItinerary(tripId: string) {
  return useQuery({
    queryKey: ITINERARY_QUERY_KEY(tripId),
    queryFn: () => api.getItinerary(tripId),
    enabled: Boolean(tripId),
  });
}

export function useCreateDay(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItineraryDayInput) => api.createDay(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
    },
  });
}

export function useBatchGenerateDays(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BatchGenerateDaysInput) => api.batchGenerateDays(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
    },
  });
}

export function useUpdateDay(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dayId, data }: { dayId: string; data: UpdateItineraryDayInput }) =>
      api.updateDay(tripId, dayId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
    },
  });
}

export function useDeleteDay(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dayId: string) => api.deleteDay(tripId, dayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
    },
  });
}

export function useCreateItem(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dayId, data }: { dayId: string; data: CreateItineraryItemInput }) =>
      api.createItem(tripId, dayId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
    },
  });
}

export function useUpdateItem(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      dayId,
      itemId,
      data,
    }: {
      dayId: string;
      itemId: string;
      data: UpdateItineraryItemInput;
    }) => api.updateItem(tripId, dayId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
    },
  });
}

export function useToggleItemComplete(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dayId, itemId }: { dayId: string; itemId: string }) =>
      api.toggleItemComplete(tripId, dayId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
    },
  });
}

export function useDeleteItem(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dayId, itemId }: { dayId: string; itemId: string }) =>
      api.deleteItem(tripId, dayId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
    },
  });
}

export function useReorderItems(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      dayId,
      items,
    }: {
      dayId: string;
      items: { id: string; orderIndex: number }[];
    }) => api.reorderItems(tripId, dayId, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITINERARY_QUERY_KEY(tripId) });
    },
  });
}
