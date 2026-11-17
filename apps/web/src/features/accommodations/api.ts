import { apiClient } from '@/lib/api';
import type {
  Accommodation,
  CreateAccommodationInput,
  UpdateAccommodationInput,
  ApiResponse,
} from '@waylo/shared';

export async function getAccommodations(tripId: string): Promise<Accommodation[]> {
  const response = await apiClient.get<ApiResponse<Accommodation[]>>(
    `/trips/${tripId}/accommodations`
  );
  return response.data.data;
}

export async function createAccommodation(
  tripId: string,
  data: CreateAccommodationInput
): Promise<Accommodation> {
  const response = await apiClient.post<ApiResponse<Accommodation>>(
    `/trips/${tripId}/accommodations`,
    data
  );
  return response.data.data;
}

export async function updateAccommodation(
  tripId: string,
  accommodationId: string,
  data: UpdateAccommodationInput
): Promise<Accommodation> {
  const response = await apiClient.put<ApiResponse<Accommodation>>(
    `/trips/${tripId}/accommodations/${accommodationId}`,
    data
  );
  return response.data.data;
}

export async function deleteAccommodation(
  tripId: string,
  accommodationId: string
): Promise<void> {
  await apiClient.delete(`/trips/${tripId}/accommodations/${accommodationId}`);
}
