import type { PackingListWithDetails, PackingItem, LuggageBag, CreatePackingListInput, UpdatePackingListInput, CreateLuggageBagInput, UpdateLuggageBagInput, CreatePackingItemInput, UpdatePackingItemInput, PackingStatus } from '@waylo/shared';
export declare function getPackingLists(tripId: string): Promise<PackingListWithDetails[]>;
export declare function createPackingList(tripId: string, data: CreatePackingListInput): Promise<PackingListWithDetails>;
export declare function updatePackingList(tripId: string, listId: string, data: UpdatePackingListInput): Promise<PackingListWithDetails>;
export declare function deletePackingList(tripId: string, listId: string): Promise<{
    deleted: boolean;
}>;
export declare function applyTemplate(tripId: string, templateKey: string, name?: string): Promise<PackingListWithDetails[]>;
export declare function getLuggageBags(tripId: string): Promise<LuggageBag[]>;
export declare function createLuggageBag(tripId: string, data: CreateLuggageBagInput): Promise<LuggageBag>;
export declare function updateLuggageBag(tripId: string, bagId: string, data: UpdateLuggageBagInput): Promise<LuggageBag>;
export declare function deleteLuggageBag(tripId: string, bagId: string): Promise<{
    deleted: boolean;
}>;
export declare function createPackingItem(tripId: string, listId: string, data: CreatePackingItemInput): Promise<PackingItem>;
export declare function updatePackingItem(tripId: string, itemId: string, data: UpdatePackingItemInput): Promise<PackingItem>;
export declare function updateItemStatus(tripId: string, itemId: string, status: PackingStatus): Promise<PackingItem>;
export declare function batchUpdateStatus(tripId: string, itemIds: string[], status: PackingStatus): Promise<{
    updatedCount: number;
    status: PackingStatus;
}>;
export declare function deletePackingItem(tripId: string, itemId: string): Promise<{
    deleted: boolean;
}>;
//# sourceMappingURL=api.d.ts.map