import type { TripWithDetails, TripMemberSummary, TripStatus, CreateTripInput, UpdateTripInput, AddMemberInput, PaginationInput, PaginatedResponse } from '@waylo/shared';
export interface GetTripsParams extends Partial<PaginationInput> {
    status?: TripStatus;
    search?: string;
    pageSize?: number;
}
export declare function getTrips(params?: GetTripsParams): Promise<PaginatedResponse<TripWithDetails>>;
export declare function getTrip(tripId: string): Promise<TripWithDetails>;
export declare function createTrip(data: CreateTripInput): Promise<TripWithDetails>;
export declare function updateTrip(tripId: string, data: UpdateTripInput): Promise<TripWithDetails>;
export declare function deleteTrip(tripId: string): Promise<void>;
export declare function duplicateTrip(tripId: string): Promise<TripWithDetails>;
export declare function updateTripStatus(tripId: string, status: TripStatus): Promise<TripWithDetails>;
export declare function archiveTrip(tripId: string): Promise<TripWithDetails>;
export declare function getMembers(tripId: string): Promise<TripMemberSummary[]>;
export declare function addMember(tripId: string, data: AddMemberInput): Promise<TripMemberSummary>;
export declare function removeMember(tripId: string, memberId: string): Promise<void>;
//# sourceMappingURL=api.d.ts.map