import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from './api';
import { toast } from 'sonner';
import type {
  GenerateItineraryInput,
  ApplyAIItineraryInput,
  GeneratePackingInput,
  ApplyAIPackingInput,
  ChatCopilotInput,
} from '@waylo/shared';

export function useGenerateItinerary() {
  return useMutation({
    mutationFn: (input: GenerateItineraryInput) => aiApi.generateItinerary(input),
    onError: (err: any) => {
      const msg = err.response?.data?.error?.message || 'Failed to generate itinerary with AI';
      toast.error(msg);
    },
  });
}

export function useApplyItinerary(tripId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ApplyAIItineraryInput) => aiApi.applyItinerary(input),
    onSuccess: (data) => {
      toast.success(data.message || 'AI itinerary applied successfully!');
      if (tripId) {
        queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
        queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] });
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error?.message || 'Failed to apply itinerary to trip';
      toast.error(msg);
    },
  });
}

export function useGeneratePacking() {
  return useMutation({
    mutationFn: (input: GeneratePackingInput) => aiApi.generatePacking(input),
    onError: (err: any) => {
      const msg = err.response?.data?.error?.message || 'Failed to generate packing list';
      toast.error(msg);
    },
  });
}

export function useApplyPacking(tripId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ApplyAIPackingInput) => aiApi.applyPacking(input),
    onSuccess: (data) => {
      toast.success(data.message || 'AI items added to packing checklist!');
      if (tripId) {
        queryClient.invalidateQueries({ queryKey: ['packing', tripId] });
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error?.message || 'Failed to apply packing items';
      toast.error(msg);
    },
  });
}

export function useChatCopilot() {
  return useMutation({
    mutationFn: (input: ChatCopilotInput) => aiApi.chatCopilot(input),
    onError: (err: any) => {
      const msg = err.response?.data?.error?.message || 'Travel Copilot failed to respond';
      toast.error(msg);
    },
  });
}
