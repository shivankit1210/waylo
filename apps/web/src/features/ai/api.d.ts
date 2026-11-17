import type { GenerateItineraryInput, ApplyAIItineraryInput, GeneratePackingInput, ApplyAIPackingInput, ChatCopilotInput, AIGeneratedItinerary, AIGeneratedPackingList, AIChatResponse } from '@waylo/shared';
export declare const aiApi: {
    /**
     * Generate complete structured itinerary
     */
    generateItinerary(input: GenerateItineraryInput): Promise<AIGeneratedItinerary>;
    /**
     * Apply AI-crafted itinerary days and stops to a trip
     */
    applyItinerary(input: ApplyAIItineraryInput): Promise<{
        appliedDaysCount: number;
        message: string;
    }>;
    /**
     * Generate intelligent packing checklist
     */
    generatePacking(input: GeneratePackingInput): Promise<AIGeneratedPackingList>;
    /**
     * Apply AI packing checklist items to trip
     */
    applyPacking(input: ApplyAIPackingInput): Promise<{
        listId: string;
        addedItemsCount: number;
        message: string;
    }>;
    /**
     * Send query to Travel Copilot chat
     */
    chatCopilot(input: ChatCopilotInput): Promise<AIChatResponse>;
};
//# sourceMappingURL=api.d.ts.map