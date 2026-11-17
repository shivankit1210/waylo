import { type GetTripsParams } from './api';
import type { UpdateTripInput, AddMemberInput, TripStatus } from '@waylo/shared';
export declare const TRIP_KEYS: {
    all: readonly ["trips"];
    lists: () => readonly ["trips", "list"];
    list: (params?: GetTripsParams) => readonly ["trips", "list", GetTripsParams | undefined];
    details: () => readonly ["trips", "detail"];
    detail: (id: string) => readonly ["trips", "detail", string];
    members: (tripId: string) => readonly ["trips", "detail", string, "members"];
};
export declare function useTrips(params?: GetTripsParams): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").PaginatedResponse<import("@waylo/shared").TripWithDetails>, Error>;
export declare function useTrip(tripId?: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").TripWithDetails, Error>;
export declare function useCreateTrip(): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").TripWithDetails, any, {
    name: string;
    tripType: import("@waylo/shared").TripType;
    transportModes: import("@waylo/shared").TransportMode[];
    currency: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD";
    visibility: import("@waylo/shared").TripVisibility;
    tags: string[];
    description?: string | null | undefined;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
    startLocation?: string | null | undefined;
    destination?: string | null | undefined;
    returnLocation?: string | null | undefined;
    estimatedBudget?: number | null | undefined;
    coverImageUrl?: string | null | undefined;
}, unknown>;
export declare function useUpdateTrip(): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").TripWithDetails, any, {
    tripId: string;
    data: UpdateTripInput;
}, unknown>;
export declare function useDeleteTrip(): import("@tanstack/react-query").UseMutationResult<void, any, string, unknown>;
export declare function useDuplicateTrip(): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").TripWithDetails, any, string, unknown>;
export declare function useUpdateTripStatus(): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").TripWithDetails, any, {
    tripId: string;
    status: TripStatus;
}, unknown>;
export declare function useArchiveTrip(): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").TripWithDetails, Error, string, unknown>;
export declare function useTripMembers(tripId?: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").TripMemberSummary[], Error>;
export declare function useAddTripMember(): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").TripMemberSummary, any, {
    tripId: string;
    data: AddMemberInput;
}, unknown>;
export declare function useRemoveTripMember(): import("@tanstack/react-query").UseMutationResult<void, Error, {
    tripId: string;
    memberId: string;
}, unknown>;
//# sourceMappingURL=hooks.d.ts.map