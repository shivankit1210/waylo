import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTrips, getTrip, createTrip, updateTrip, deleteTrip, duplicateTrip, updateTripStatus, archiveTrip, getMembers, addMember, removeMember, } from './api';
import { toast } from 'sonner';
export const TRIP_KEYS = {
    all: ['trips'],
    lists: () => [...TRIP_KEYS.all, 'list'],
    list: (params) => [...TRIP_KEYS.lists(), params],
    details: () => [...TRIP_KEYS.all, 'detail'],
    detail: (id) => [...TRIP_KEYS.details(), id],
    members: (tripId) => [...TRIP_KEYS.detail(tripId), 'members'],
};
export function useTrips(params) {
    return useQuery({
        queryKey: TRIP_KEYS.list(params),
        queryFn: () => getTrips(params),
    });
}
export function useTrip(tripId) {
    return useQuery({
        queryKey: TRIP_KEYS.detail(tripId ?? ''),
        queryFn: () => getTrip(tripId),
        enabled: Boolean(tripId),
    });
}
export function useCreateTrip() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createTrip(data),
        onSuccess: (newTrip) => {
            queryClient.invalidateQueries({ queryKey: TRIP_KEYS.lists() });
            toast.success(`Trip "${newTrip.name}" created successfully!`);
        },
        onError: (err) => {
            toast.error(err?.message || 'Failed to create trip');
        },
    });
}
export function useUpdateTrip() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ tripId, data }) => updateTrip(tripId, data),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: TRIP_KEYS.detail(updated.id) });
            queryClient.invalidateQueries({ queryKey: TRIP_KEYS.lists() });
            toast.success('Trip updated successfully');
        },
        onError: (err) => {
            toast.error(err?.message || 'Failed to update trip');
        },
    });
}
export function useDeleteTrip() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (tripId) => deleteTrip(tripId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TRIP_KEYS.lists() });
            toast.success('Trip deleted');
        },
        onError: (err) => {
            toast.error(err?.message || 'Failed to delete trip');
        },
    });
}
export function useDuplicateTrip() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (tripId) => duplicateTrip(tripId),
        onSuccess: (duplicated) => {
            queryClient.invalidateQueries({ queryKey: TRIP_KEYS.lists() });
            toast.success(`Duplicated "${duplicated.name}"`);
        },
        onError: (err) => {
            toast.error(err?.message || 'Failed to duplicate trip');
        },
    });
}
export function useUpdateTripStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ tripId, status }) => updateTripStatus(tripId, status),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: TRIP_KEYS.detail(updated.id) });
            queryClient.invalidateQueries({ queryKey: TRIP_KEYS.lists() });
            toast.success(`Trip status changed to ${updated.status}`);
        },
        onError: (err) => {
            toast.error(err?.message || 'Failed to change status');
        },
    });
}
export function useArchiveTrip() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (tripId) => archiveTrip(tripId),
        onSuccess: (archived) => {
            queryClient.invalidateQueries({ queryKey: TRIP_KEYS.detail(archived.id) });
            queryClient.invalidateQueries({ queryKey: TRIP_KEYS.lists() });
            toast.success('Trip archived');
        },
    });
}
export function useTripMembers(tripId) {
    return useQuery({
        queryKey: TRIP_KEYS.members(tripId ?? ''),
        queryFn: () => getMembers(tripId),
        enabled: Boolean(tripId),
    });
}
export function useAddTripMember() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ tripId, data }) => addMember(tripId, data),
        onSuccess: (_, { tripId }) => {
            queryClient.invalidateQueries({ queryKey: TRIP_KEYS.members(tripId) });
            queryClient.invalidateQueries({ queryKey: TRIP_KEYS.detail(tripId) });
            toast.success('Member invited successfully');
        },
        onError: (err) => {
            toast.error(err?.message || 'Failed to add member');
        },
    });
}
export function useRemoveTripMember() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ tripId, memberId }) => removeMember(tripId, memberId),
        onSuccess: (_, { tripId }) => {
            queryClient.invalidateQueries({ queryKey: TRIP_KEYS.members(tripId) });
            queryClient.invalidateQueries({ queryKey: TRIP_KEYS.detail(tripId) });
            toast.success('Member removed');
        },
    });
}
//# sourceMappingURL=hooks.js.map