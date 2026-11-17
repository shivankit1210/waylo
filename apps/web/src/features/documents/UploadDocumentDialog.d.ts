import React from 'react';
import { DocumentType, type TripWithDetails } from '@waylo/shared';
interface UploadDocumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trip: TripWithDetails | any;
}
export declare const DOCUMENT_TYPE_LABELS: Record<DocumentType, string>;
export declare function UploadDocumentDialog({ open, onOpenChange, trip, }: UploadDocumentDialogProps): React.JSX.Element;
export {};
//# sourceMappingURL=UploadDocumentDialog.d.ts.map