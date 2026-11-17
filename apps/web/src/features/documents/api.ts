import { apiClient } from '@/lib/api';
import type {
  TripDocument,
  CreateDocumentInput,
  UpdateDocumentInput,
  ApiResponse,
} from '@waylo/shared';

export async function getDocuments(tripId: string): Promise<TripDocument[]> {
  const response = await apiClient.get<ApiResponse<TripDocument[]>>(
    `/trips/${tripId}/documents`
  );
  return response.data.data;
}

export async function createDocument(
  tripId: string,
  data: CreateDocumentInput
): Promise<TripDocument> {
  const response = await apiClient.post<ApiResponse<TripDocument>>(
    `/trips/${tripId}/documents`,
    data
  );
  return response.data.data;
}

export async function updateDocument(
  tripId: string,
  documentId: string,
  data: UpdateDocumentInput
): Promise<TripDocument> {
  const response = await apiClient.put<ApiResponse<TripDocument>>(
    `/trips/${tripId}/documents/${documentId}`,
    data
  );
  return response.data.data;
}

export async function deleteDocument(
  tripId: string,
  documentId: string
): Promise<void> {
  await apiClient.delete(`/trips/${tripId}/documents/${documentId}`);
}
