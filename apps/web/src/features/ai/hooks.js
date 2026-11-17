import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from './api';
import { toast } from 'sonner';
export function useGenerateItinerary() {
    return useMutation({
        mutationFn: (input) => aiApi.generateItinerary(input),
        onError: (err) => {
            const msg = err.response?.data?.error?.message || 'Failed to generate itinerary with AI';
            toast.error(msg);
        },
    });
}
export function useApplyItinerary(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => aiApi.applyItinerary(input),
        onSuccess: (data) => {
            toast.success(data.message || 'AI itinerary applied successfully!');
            if (tripId) {
                queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
                queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] });
            }
        },
        onError: (err) => {
            const msg = err.response?.data?.error?.message || 'Failed to apply itinerary to trip';
            toast.error(msg);
        },
    });
}
export function useGeneratePacking() {
    return useMutation({
        mutationFn: (input) => aiApi.generatePacking(input),
        onError: (err) => {
            const msg = err.response?.data?.error?.message || 'Failed to generate packing list';
            toast.error(msg);
        },
    });
}
export function useApplyPacking(tripId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => aiApi.applyPacking(input),
        onSuccess: (data) => {
            toast.success(data.message || 'AI items added to packing checklist!');
            if (tripId) {
                queryClient.invalidateQueries({ queryKey: ['packing', tripId] });
            }
        },
        onError: (err) => {
            const msg = err.response?.data?.error?.message || 'Failed to apply packing items';
            toast.error(msg);
        },
    });
}
export function useChatCopilot() {
    return useMutation({
        mutationFn: (input) => aiApi.chatCopilot(input),
        onError: (err) => {
            const msg = err.response?.data?.error?.message || 'Travel Copilot failed to respond';
            toast.error(msg);
        },
    });
}
//# sourceMappingURL=hooks.js.map