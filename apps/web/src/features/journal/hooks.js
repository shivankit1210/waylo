import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJournalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry, getTripHighlights, createTripHighlight, deleteTripHighlight, getTripAnalytics, } from './api';
import toast from 'react-hot-toast';
export function useJournalEntries(tripId) {
    return useQuery({
        queryKey: ['journal', tripId, 'entries'],
        queryFn: () => getJournalEntries(tripId),
        enabled: Boolean(tripId),
    });
}
export function useCreateJournalEntry(tripId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => createJournalEntry(tripId, data),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['journal', tripId, 'entries'] });
            void qc.invalidateQueries({ queryKey: ['journal', tripId, 'analytics'] });
            toast.success('Journal memory captured! 📖');
        },
        onError: (err) => {
            toast.error(err.response?.data?.error?.message || 'Failed to save entry');
        },
    });
}
export function useUpdateJournalEntry(tripId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ entryId, data }) => updateJournalEntry(tripId, entryId, data),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['journal', tripId, 'entries'] });
            toast.success('Entry updated');
        },
        onError: (err) => {
            toast.error(err.response?.data?.error?.message || 'Failed to update entry');
        },
    });
}
export function useDeleteJournalEntry(tripId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (entryId) => deleteJournalEntry(tripId, entryId),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['journal', tripId, 'entries'] });
            void qc.invalidateQueries({ queryKey: ['journal', tripId, 'analytics'] });
            toast.success('Entry deleted');
        },
        onError: (err) => {
            toast.error(err.response?.data?.error?.message || 'Failed to delete entry');
        },
    });
}
export function useTripHighlights(tripId) {
    return useQuery({
        queryKey: ['journal', tripId, 'highlights'],
        queryFn: () => getTripHighlights(tripId),
        enabled: Boolean(tripId),
    });
}
export function useCreateTripHighlight(tripId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => createTripHighlight(tripId, data),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['journal', tripId, 'highlights'] });
            void qc.invalidateQueries({ queryKey: ['journal', tripId, 'analytics'] });
            toast.success('Trip highlight pinned! ⭐');
        },
        onError: (err) => {
            toast.error(err.response?.data?.error?.message || 'Failed to add highlight');
        },
    });
}
export function useDeleteTripHighlight(tripId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (highlightId) => deleteTripHighlight(tripId, highlightId),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['journal', tripId, 'highlights'] });
            void qc.invalidateQueries({ queryKey: ['journal', tripId, 'analytics'] });
            toast.success('Highlight removed');
        },
        onError: (err) => {
            toast.error(err.response?.data?.error?.message || 'Failed to delete highlight');
        },
    });
}
export function useTripAnalytics(tripId) {
    return useQuery({
        queryKey: ['journal', tripId, 'analytics'],
        queryFn: () => getTripAnalytics(tripId),
        enabled: Boolean(tripId),
        staleTime: 60000,
    });
}
//# sourceMappingURL=hooks.js.map