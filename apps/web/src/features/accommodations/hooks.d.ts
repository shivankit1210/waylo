import type { UpdateAccommodationInput } from '@waylo/shared';
export declare function useAccommodations(tripId: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").Accommodation[], Error>;
export declare function useCreateAccommodation(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").Accommodation, any, {
    type: import("@waylo/shared").BookingType;
    name: string;
    currency: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD";
    checkInDate: string;
    checkOutDate: string;
    bookingStatus: import("@waylo/shared").BookingStatus;
    notes?: string | null | undefined;
    location?: string | null | undefined;
    checkInTime?: string | null | undefined;
    checkOutTime?: string | null | undefined;
    confirmationCode?: string | null | undefined;
    totalCost?: number | null | undefined;
    contactPhone?: string | null | undefined;
    contactEmail?: string | null | undefined;
}, unknown>;
export declare function useUpdateAccommodation(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").Accommodation, any, {
    accommodationId: string;
    data: UpdateAccommodationInput;
}, unknown>;
export declare function useDeleteAccommodation(tripId: string): import("@tanstack/react-query").UseMutationResult<void, any, string, unknown>;
//# sourceMappingURL=hooks.d.ts.map