export declare function useGenerateItinerary(): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").AIGeneratedItinerary, any, {
    tripType: import("@waylo/shared").TripType;
    destination: string;
    daysCount: number;
    travelPace: "PACKED" | "RELAXED" | "MODERATE";
    budget: "MODERATE" | "BUDGET" | "LUXURY";
    interests?: string[] | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    origin?: string | undefined;
    preferences?: string | undefined;
}, unknown>;
export declare function useApplyItinerary(tripId?: string): import("@tanstack/react-query").UseMutationResult<{
    appliedDaysCount: number;
    message: string;
}, any, {
    tripId: string;
    itinerary: {
        days: {
            dayNumber: number;
            title: string;
            stops: {
                title: string;
                itemType: import("@waylo/shared").ItineraryItemType;
                flexibility: import("@waylo/shared").ActivityFlexibility;
                isOptional: boolean;
                plannedDistanceKm?: number | null | undefined;
                notes?: string | null | undefined;
                location?: string | null | undefined;
                plannedStartTime?: string | null | undefined;
                plannedEndTime?: string | null | undefined;
            }[];
            startLocation?: string | null | undefined;
            endLocation?: string | null | undefined;
            notes?: string | null | undefined;
        }[];
        tripTitle?: string | undefined;
        summary?: string | undefined;
        highlights?: string[] | undefined;
    };
}, unknown>;
export declare function useGeneratePacking(): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").AIGeneratedPackingList, any, {
    tripType: import("@waylo/shared").TripType;
    destination: string;
    daysCount: number;
    includeRidingGear: boolean;
    tripId?: string | undefined;
    climate?: string | undefined;
}, unknown>;
export declare function useApplyPacking(tripId?: string): import("@tanstack/react-query").UseMutationResult<{
    listId: string;
    addedItemsCount: number;
    message: string;
}, any, {
    items: {
        name: string;
        category: import("@waylo/shared").PackingCategory;
        quantity: number;
        isRequired: boolean;
        notes?: string | null | undefined;
    }[];
    tripId: string;
}, unknown>;
export declare function useChatCopilot(): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").AIChatResponse, any, {
    message: string;
    tripId?: string | undefined;
    history?: {
        role: "user" | "assistant" | "system";
        content: string;
    }[] | undefined;
    tripContext?: Record<string, any> | undefined;
}, unknown>;
//# sourceMappingURL=hooks.d.ts.map