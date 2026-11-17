import type { TripDocument, CreateDocumentInput, UpdateDocumentInput } from '@waylo/shared';
export declare function getDocuments(tripId: string): Promise<TripDocument[]>;
export declare function createDocument(tripId: string, data: CreateDocumentInput): Promise<TripDocument>;
export declare function updateDocument(tripId: string, documentId: string, data: UpdateDocumentInput): Promise<TripDocument>;
export declare function deleteDocument(tripId: string, documentId: string): Promise<void>;
//# sourceMappingURL=api.d.ts.map