import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as api from './api';
import type { CreateAccommodationInput, UpdateAccommodationInput } from '@waylo/shared';

export function useAccommodations(tripId: string) {
  return useQuery({
    queryKey: ['accommodations', tripId],
    queryFn: () => api.getAccommodations(tripId),
    enabled: Boolean(tripId),
  });
}

export function useCreateAccommodation(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccommodationInput) => api.createAccommodation(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations', tripId] });
      toast.success('Accommodation booking saved');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to save accommodation');
    },
  });
}

export function useUpdateAccommodation(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accommodationId,
      data,
    }: {
      accommodationId: string;
      data: UpdateAccommodationInput;
    }) => api.updateAccommodation(tripId, accommodationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations', tripId] });
      toast.success('Accommodation updated');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to update accommodation');
    },
  });
}

export function useDeleteAccommodation(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accommodationId: string) =>
      api.deleteAccommodation(tripId, accommodationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations', tripId] });
      toast.success('Accommodation removed');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to delete accommodation');
    },
  });
}
