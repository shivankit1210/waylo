import type { UpdateJournalEntryInput } from '@waylo/shared';
export declare function useJournalEntries(tripId: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").JournalEntry[], Error>;
export declare function useCreateJournalEntry(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").JournalEntry, any, {
    title: string;
    content: string;
    mediaUrls: string[];
    dayNumber?: number | null | undefined;
    location?: string | null | undefined;
    mood?: import("@waylo/shared").JournalMood | null | undefined;
    weatherNote?: string | null | undefined;
}, unknown>;
export declare function useUpdateJournalEntry(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").JournalEntry, any, {
    entryId: string;
    data: UpdateJournalEntryInput;
}, unknown>;
export declare function useDeleteJournalEntry(tripId: string): import("@tanstack/react-query").UseMutationResult<void, any, string, unknown>;
export declare function useTripHighlights(tripId: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").TripHighlight[], Error>;
export declare function useCreateTripHighlight(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").TripHighlight, any, {
    title: string;
    category: import("@waylo/shared").HighlightCategory;
    rating: number;
    description?: string | null | undefined;
    location?: string | null | undefined;
    photoUrl?: string | null | undefined;
}, unknown>;
export declare function useDeleteTripHighlight(tripId: string): import("@tanstack/react-query").UseMutationResult<void, any, string, unknown>;
export declare function useTripAnalytics(tripId: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").TripAnalytics, Error>;
//# sourceMappingURL=hooks.d.ts.map