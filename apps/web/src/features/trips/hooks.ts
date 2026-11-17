import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  duplicateTrip,
  updateTripStatus,
  archiveTrip,
  getMembers,
  addMember,
  removeMember,
  type GetTripsParams,
} from './api';
import type { CreateTripInput, UpdateTripInput, AddMemberInput, TripStatus } from '@waylo/shared';
import { toast } from 'sonner';

export const TRIP_KEYS = {
  all: ['trips'] as const,
  lists: () => [...TRIP_KEYS.all, 'list'] as const,
  list: (params?: GetTripsParams) => [...TRIP_KEYS.lists(), params] as const,
  details: () => [...TRIP_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TRIP_KEYS.details(), id] as const,
  members: (tripId: string) => [...TRIP_KEYS.detail(tripId), 'members'] as const,
};

export function useTrips(params?: GetTripsParams) {
  return useQuery({
    queryKey: TRIP_KEYS.list(params),
    queryFn: () => getTrips(params),
  });
}

export function useTrip(tripId?: string) {
  return useQuery({
    queryKey: TRIP_KEYS.detail(tripId ?? ''),
    queryFn: () => getTrip(tripId!),
    enabled: Boolean(tripId),
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTripInput) => createTrip(data),
    onSuccess: (newTrip) => {
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.lists() });
      toast.success(`Trip "${newTrip.name}" created successfully!`);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create trip');
    },
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, data }: { tripId: string; data: UpdateTripInput }) =>
      updateTrip(tripId, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.detail(updated.id) });
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.lists() });
      toast.success('Trip updated successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update trip');
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => deleteTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.lists() });
      toast.success('Trip deleted');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete trip');
    },
  });
}

export function useDuplicateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => duplicateTrip(tripId),
    onSuccess: (duplicated) => {
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.lists() });
      toast.success(`Duplicated "${duplicated.name}"`);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to duplicate trip');
    },
  });
}

export function useUpdateTripStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, status }: { tripId: string; status: TripStatus }) =>
      updateTripStatus(tripId, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.detail(updated.id) });
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.lists() });
      toast.success(`Trip status changed to ${updated.status}`);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to change status');
    },
  });
}

export function useArchiveTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => archiveTrip(tripId),
    onSuccess: (archived) => {
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.detail(archived.id) });
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.lists() });
      toast.success('Trip archived');
    },
  });
}

export function useTripMembers(tripId?: string) {
  return useQuery({
    queryKey: TRIP_KEYS.members(tripId ?? ''),
    queryFn: () => getMembers(tripId!),
    enabled: Boolean(tripId),
  });
}

export function useAddTripMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, data }: { tripId: string; data: AddMemberInput }) =>
      addMember(tripId, data),
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.members(tripId) });
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.detail(tripId) });
      toast.success('Member invited successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to add member');
    },
  });
}

export function useRemoveTripMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, memberId }: { tripId: string; memberId: string }) =>
      removeMember(tripId, memberId),
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.members(tripId) });
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.detail(tripId) });
      toast.success('Member removed');
    },
  });
}
