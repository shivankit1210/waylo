import type { JournalEntry, TripHighlight, TripAnalytics, CreateJournalEntryInput, UpdateJournalEntryInput, CreateTripHighlightInput } from '@waylo/shared';
export declare function getJournalEntries(tripId: string): Promise<JournalEntry[]>;
export declare function createJournalEntry(tripId: string, data: CreateJournalEntryInput): Promise<JournalEntry>;
export declare function updateJournalEntry(tripId: string, entryId: string, data: UpdateJournalEntryInput): Promise<JournalEntry>;
export declare function deleteJournalEntry(tripId: string, entryId: string): Promise<void>;
export declare function getTripHighlights(tripId: string): Promise<TripHighlight[]>;
export declare function createTripHighlight(tripId: string, data: CreateTripHighlightInput): Promise<TripHighlight>;
export declare function deleteTripHighlight(tripId: string, highlightId: string): Promise<void>;
export declare function getTripAnalytics(tripId: string): Promise<TripAnalytics>;
//# sourceMappingURL=api.d.ts.map