import apiClient from '@/lib/api';
import type {
  ApiResponse,
  GenerateItineraryInput,
  ApplyAIItineraryInput,
  GeneratePackingInput,
  ApplyAIPackingInput,
  ChatCopilotInput,
  AIGeneratedItinerary,
  AIGeneratedPackingList,
  AIChatResponse,
} from '@waylo/shared';

export const aiApi = {
  /**
   * Generate complete structured itinerary
   */
  async generateItinerary(
    input: GenerateItineraryInput
  ): Promise<AIGeneratedItinerary> {
    const res = await apiClient.post<ApiResponse<AIGeneratedItinerary>>(
      '/ai/generate-itinerary',
      input,
      { timeout: 120000 }
    );
    return res.data.data;
  },

  /**
   * Apply AI-crafted itinerary days and stops to a trip
   */
  async applyItinerary(
    input: ApplyAIItineraryInput
  ): Promise<{ appliedDaysCount: number; message: string }> {
    const res = await apiClient.post<
      ApiResponse<{ appliedDaysCount: number; message: string }>
    >('/ai/apply-itinerary', input, { timeout: 120000 });
    return res.data.data;
  },

  /**
   * Generate intelligent packing checklist
   */
  async generatePacking(
    input: GeneratePackingInput
  ): Promise<AIGeneratedPackingList> {
    const res = await apiClient.post<ApiResponse<AIGeneratedPackingList>>(
      '/ai/generate-packing',
      input,
      { timeout: 120000 }
    );
    return res.data.data;
  },

  /**
   * Apply AI packing checklist items to trip
   */
  async applyPacking(
    input: ApplyAIPackingInput
  ): Promise<{ listId: string; addedItemsCount: number; message: string }> {
    const res = await apiClient.post<
      ApiResponse<{ listId: string; addedItemsCount: number; message: string }>
    >('/ai/apply-packing', input, { timeout: 120000 });
    return res.data.data;
  },

  /**
   * Send query to Travel Copilot chat
   */
  async chatCopilot(input: ChatCopilotInput): Promise<AIChatResponse> {
    const res = await apiClient.post<ApiResponse<AIChatResponse>>(
      '/ai/chat',
      input,
      { timeout: 120000 }
    );
    return res.data.data;
  },
};
