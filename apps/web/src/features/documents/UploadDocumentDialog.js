import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { DocumentType } from '@waylo/shared';
import { useCreateDocument } from './hooks';
export const DOCUMENT_TYPE_LABELS = {
    [DocumentType.DRIVING_LICENSE]: '🪪 Driving License',
    [DocumentType.VEHICLE_RC]: '🏍️ Vehicle RC Book',
    [DocumentType.INSURANCE_POLICY]: '🛡️ Vehicle / Travel Insurance',
    [DocumentType.PUC_CERTIFICATE]: '💨 PUC Emission Certificate',
    [DocumentType.HOTEL_VOUCHER]: '🏨 Hotel / Stay Voucher',
    [DocumentType.TICKETS]: '🎟️ Tickets & Boarding Passes',
    [DocumentType.PERMIT]: '📜 Travel / Environmental Permit',
    [DocumentType.ID_PROOF]: '🆔 Aadhaar / National ID',
    [DocumentType.PASSPORT]: '🛂 Passport & Visa',
    [DocumentType.OTHER]: '📁 Other Document',
};
export function UploadDocumentDialog({ open, onOpenChange, trip, }) {
    const createMutation = useCreateDocument(trip.id);
    const [title, setTitle] = useState('');
    const [documentType, setDocumentType] = useState(DocumentType.INSURANCE_POLICY);
    const [fileName, setFileName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [isShared, setIsShared] = useState(true);
    const [notes, setNotes] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim())
            return;
        await createMutation.mutateAsync({
            title: title.trim(),
            documentType,
            fileName: fileName.trim() || `${title.replace(/\s+/g, '_')}.pdf`,
            fileSize: 1024 * 1024, // 1MB mock default
            expiryDate: expiryDate || null,
            isShared,
            notes: notes.trim() || null,
        });
        setTitle('');
        setFileName('');
        setExpiryDate('');
        setNotes('');
        onOpenChange(false);
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-md max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "text-xl font-bold", children: "Add Travel Document" }), _jsx(DialogDescription, { className: "text-xs text-muted-foreground", children: "Store digital driving licenses, insurance cards, permits, and booking vouchers in your trip vault." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-2", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "doc-title", className: "text-xs font-semibold", children: "Document Title *" }), _jsx(Input, { id: "doc-title", placeholder: "e.g. Motorcycle Comprehensive Insurance, Inner Line Permit", value: title, onChange: (e) => setTitle(e.target.value), required: true })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { className: "text-xs font-semibold", children: "Document Category" }), _jsxs(Select, { value: documentType, onValueChange: (v) => setDocumentType(v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: Object.entries(DOCUMENT_TYPE_LABELS).map(([docKey, label]) => (_jsx(SelectItem, { value: docKey, children: label }, docKey))) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "doc-file", className: "text-xs font-semibold", children: "File / Reference Name" }), _jsx(Input, { id: "doc-file", placeholder: "e.g. Policy_2026.pdf", value: fileName, onChange: (e) => setFileName(e.target.value) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "doc-exp", className: "text-xs font-semibold", children: "Expiration Date" }), _jsx(Input, { id: "doc-exp", type: "date", value: expiryDate, onChange: (e) => setExpiryDate(e.target.value) })] })] }), _jsxs("div", { className: "flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/80", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "doc-share", className: "text-xs font-bold text-foreground cursor-pointer", children: "Share with Trip Crew" }), _jsx("p", { className: "text-[11px] text-muted-foreground", children: "All members on this trip can view this document for police/checkpost verification." })] }), _jsx(Switch, { id: "doc-share", checked: isShared, onCheckedChange: setIsShared })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "doc-notes", className: "text-xs font-semibold", children: "Policy # / Emergency Helplines / Notes" }), _jsx(Textarea, { id: "doc-notes", placeholder: "e.g. Policy #ICICI-883921. Toll-free RSA emergency helpline: 1800-2666.", rows: 2, value: notes, onChange: (e) => setNotes(e.target.value) })] }), _jsxs(DialogFooter, { className: "pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), className: "rounded-xl", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: createMutation.isPending || !title.trim(), className: "rounded-xl font-bold", children: createMutation.isPending ? 'Saving...' : 'Add to Vault' })] })] })] }) }));
}
//# sourceMappingURL=UploadDocumentDialog.js.map