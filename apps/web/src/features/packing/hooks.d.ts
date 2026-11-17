import type { UpdatePackingListInput, UpdateLuggageBagInput, CreatePackingItemInput, UpdatePackingItemInput, PackingStatus } from '@waylo/shared';
export declare const PACKING_QUERY_KEY: (tripId: string) => string[];
export declare const BAGS_QUERY_KEY: (tripId: string) => string[];
export declare function usePackingLists(tripId: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").PackingListWithDetails[], Error>;
export declare function useLuggageBags(tripId: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").LuggageBag[], Error>;
export declare function useCreatePackingList(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").PackingListWithDetails, Error, {
    name: string;
    isTemplate: boolean;
    description?: string | null | undefined;
    category?: string | null | undefined;
}, unknown>;
export declare function useUpdatePackingList(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").PackingListWithDetails, Error, {
    listId: string;
    data: UpdatePackingListInput;
}, unknown>;
export declare function useDeletePackingList(tripId: string): import("@tanstack/react-query").UseMutationResult<{
    deleted: boolean;
}, Error, string, unknown>;
export declare function useApplyPackingTemplate(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").PackingListWithDetails[], Error, {
    templateKey: string;
    name?: string;
}, unknown>;
export declare function useCreateLuggageBag(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").LuggageBag, Error, {
    name: string;
    bagType: import("@waylo/shared").LuggageBagType;
    notes?: string | null | undefined;
    capacityLiters?: number | null | undefined;
    maxWeightKg?: number | null | undefined;
    color?: string | null | undefined;
}, unknown>;
export declare function useUpdateLuggageBag(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").LuggageBag, Error, {
    bagId: string;
    data: UpdateLuggageBagInput;
}, unknown>;
export declare function useDeleteLuggageBag(tripId: string): import("@tanstack/react-query").UseMutationResult<{
    deleted: boolean;
}, Error, string, unknown>;
export declare function useCreatePackingItem(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").PackingItem, Error, {
    listId: string;
    data: CreatePackingItemInput;
}, unknown>;
export declare function useUpdatePackingItem(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").PackingItem, Error, {
    itemId: string;
    data: UpdatePackingItemInput;
}, unknown>;
export declare function useUpdateItemStatus(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").PackingItem, Error, {
    itemId: string;
    status: PackingStatus;
}, unknown>;
export declare function useBatchUpdateStatus(tripId: string): import("@tanstack/react-query").UseMutationResult<{
    updatedCount: number;
    status: PackingStatus;
}, Error, {
    itemIds: string[];
    status: PackingStatus;
}, unknown>;
export declare function useDeletePackingItem(tripId: string): import("@tanstack/react-query").UseMutationResult<{
    deleted: boolean;
}, Error, string, unknown>;
//# sourceMappingURL=hooks.d.ts.map