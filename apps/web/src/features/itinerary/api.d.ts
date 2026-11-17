import type { ItineraryDayWithItems, ItineraryDay, ItineraryItem, CreateItineraryDayInput, UpdateItineraryDayInput, BatchGenerateDaysInput, CreateItineraryItemInput, UpdateItineraryItemInput } from '@waylo/shared';
export declare function getItinerary(tripId: string): Promise<ItineraryDayWithItems[]>;
export declare function createDay(tripId: string, data: CreateItineraryDayInput): Promise<ItineraryDayWithItems>;
export declare function batchGenerateDays(tripId: string, data: BatchGenerateDaysInput): Promise<ItineraryDayWithItems[]>;
export declare function updateDay(tripId: string, dayId: string, data: UpdateItineraryDayInput): Promise<ItineraryDay>;
export declare function deleteDay(tripId: string, dayId: string): Promise<{
    deleted: boolean;
}>;
export declare function createItem(tripId: string, dayId: string, data: CreateItineraryItemInput): Promise<ItineraryItem>;
export declare function updateItem(tripId: string, dayId: string, itemId: string, data: UpdateItineraryItemInput): Promise<ItineraryItem>;
export declare function toggleItemComplete(tripId: string, dayId: string, itemId: string): Promise<ItineraryItem>;
export declare function deleteItem(tripId: string, dayId: string, itemId: string): Promise<{
    deleted: boolean;
}>;
export declare function reorderItems(tripId: string, dayId: string, items: {
    id: string;
    orderIndex: number;
}[]): Promise<ItineraryItem[]>;
//# sourceMappingURL=api.d.ts.map