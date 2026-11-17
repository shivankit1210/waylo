import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as api from './api';
export function useDocuments(tripId) {
    return useQuery({
        queryKey: ['documents', tripId],
        queryFn: () => api.getDocuments(tripId),
        enabled: Boolean(tripId),
    });
}
export function useCreateDocument(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.createDocument(tripId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents', tripId] });
            toast.success('Document uploaded to trip vault');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to save document');
        },
    });
}
export function useUpdateDocument(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ documentId, data, }) => api.updateDocument(tripId, documentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents', tripId] });
            toast.success('Document updated');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to update document');
        },
    });
}
export function useDeleteDocument(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (documentId) => api.deleteDocument(tripId, documentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents', tripId] });
            toast.success('Document removed from vault');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.error?.message || 'Failed to delete document');
        },
    });
}
//# sourceMappingURL=hooks.js.map