import type { UpdateItineraryDayInput, CreateItineraryItemInput, UpdateItineraryItemInput } from '@waylo/shared';
export declare const ITINERARY_QUERY_KEY: (tripId: string) => string[];
export declare function useItinerary(tripId: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").ItineraryDayWithItems[], Error>;
export declare function useCreateDay(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").ItineraryDayWithItems, Error, {
    dayNumber: number;
    date?: string | null | undefined;
    startLocation?: string | null | undefined;
    title?: string | null | undefined;
    endLocation?: string | null | undefined;
    plannedDeparture?: string | null | undefined;
    plannedArrival?: string | null | undefined;
    actualDeparture?: string | null | undefined;
    actualArrival?: string | null | undefined;
    plannedDistanceKm?: number | null | undefined;
    actualDistanceKm?: number | null | undefined;
    notes?: string | null | undefined;
}, unknown>;
export declare function useBatchGenerateDays(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").ItineraryDayWithItems[], Error, {
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
    startLocation?: string | null | undefined;
    destination?: string | null | undefined;
    dayCount?: number | undefined;
}, unknown>;
export declare function useUpdateDay(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").ItineraryDay, Error, {
    dayId: string;
    data: UpdateItineraryDayInput;
}, unknown>;
export declare function useDeleteDay(tripId: string): import("@tanstack/react-query").UseMutationResult<{
    deleted: boolean;
}, Error, string, unknown>;
export declare function useCreateItem(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").ItineraryItem, Error, {
    dayId: string;
    data: CreateItineraryItemInput;
}, unknown>;
export declare function useUpdateItem(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").ItineraryItem, Error, {
    dayId: string;
    itemId: string;
    data: UpdateItineraryItemInput;
}, unknown>;
export declare function useToggleItemComplete(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").ItineraryItem, Error, {
    dayId: string;
    itemId: string;
}, unknown>;
export declare function useDeleteItem(tripId: string): import("@tanstack/react-query").UseMutationResult<{
    deleted: boolean;
}, Error, {
    dayId: string;
    itemId: string;
}, unknown>;
export declare function useReorderItems(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").ItineraryItem[], Error, {
    dayId: string;
    items: {
        id: string;
        orderIndex: number;
    }[];
}, unknown>;
//# sourceMappingURL=hooks.d.ts.map