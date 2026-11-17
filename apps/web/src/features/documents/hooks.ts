import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as api from './api';
import type { CreateDocumentInput, UpdateDocumentInput } from '@waylo/shared';

export function useDocuments(tripId: string) {
  return useQuery({
    queryKey: ['documents', tripId],
    queryFn: () => api.getDocuments(tripId),
    enabled: Boolean(tripId),
  });
}

export function useCreateDocument(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDocumentInput) => api.createDocument(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', tripId] });
      toast.success('Document uploaded to trip vault');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to save document');
    },
  });
}

export function useUpdateDocument(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      data,
    }: {
      documentId: string;
      data: UpdateDocumentInput;
    }) => api.updateDocument(tripId, documentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', tripId] });
      toast.success('Document updated');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to update document');
    },
  });
}

export function useDeleteDocument(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => api.deleteDocument(tripId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', tripId] });
      toast.success('Document removed from vault');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || 'Failed to delete document');
    },
  });
}
