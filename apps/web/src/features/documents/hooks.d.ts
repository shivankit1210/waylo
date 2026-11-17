import type { UpdateDocumentInput } from '@waylo/shared';
export declare function useDocuments(tripId: string): import("@tanstack/react-query").UseQueryResult<import("@waylo/shared").TripDocument[], Error>;
export declare function useCreateDocument(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").TripDocument, any, {
    title: string;
    isShared: boolean;
    documentType: import("@waylo/shared").DocumentType;
    notes?: string | null | undefined;
    fileUrl?: string | null | undefined;
    fileName?: string | null | undefined;
    fileSize?: number | null | undefined;
    expiryDate?: string | null | undefined;
}, unknown>;
export declare function useUpdateDocument(tripId: string): import("@tanstack/react-query").UseMutationResult<import("@waylo/shared").TripDocument, any, {
    documentId: string;
    data: UpdateDocumentInput;
}, unknown>;
export declare function useDeleteDocument(tripId: string): import("@tanstack/react-query").UseMutationResult<void, any, string, unknown>;
//# sourceMappingURL=hooks.d.ts.map