import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DocumentType, type TripWithDetails } from '@waylo/shared';
import { useCreateDocument } from './hooks';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripWithDetails | any;
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
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

export function UploadDocumentDialog({
  open,
  onOpenChange,
  trip,
}: UploadDocumentDialogProps) {
  const createMutation = useCreateDocument(trip.id);

  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>(
    DocumentType.INSURANCE_POLICY
  );
  const [fileName, setFileName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isShared, setIsShared] = useState(true);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Travel Document</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Store digital driving licenses, insurance cards, permits, and booking vouchers in your trip vault.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="doc-title" className="text-xs font-semibold">
              Document Title *
            </Label>
            <Input
              id="doc-title"
              placeholder="e.g. Motorcycle Comprehensive Insurance, Inner Line Permit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Document Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Document Category</Label>
            <Select
              value={documentType}
              onValueChange={(v) => setDocumentType(v as DocumentType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([docKey, label]) => (
                  <SelectItem key={docKey} value={docKey}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Name & Expiry */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="doc-file" className="text-xs font-semibold">
                File / Reference Name
              </Label>
              <Input
                id="doc-file"
                placeholder="e.g. Policy_2026.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="doc-exp" className="text-xs font-semibold">
                Expiration Date
              </Label>
              <Input
                id="doc-exp"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          {/* Share Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/80">
            <div className="space-y-0.5">
              <Label
                htmlFor="doc-share"
                className="text-xs font-bold text-foreground cursor-pointer"
              >
                Share with Trip Crew
              </Label>
              <p className="text-[11px] text-muted-foreground">
                All members on this trip can view this document for police/checkpost verification.
              </p>
            </div>
            <Switch id="doc-share" checked={isShared} onCheckedChange={setIsShared} />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="doc-notes" className="text-xs font-semibold">
              Policy # / Emergency Helplines / Notes
            </Label>
            <Textarea
              id="doc-notes"
              placeholder="e.g. Policy #ICICI-883921. Toll-free RSA emergency helpline: 1800-2666."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || !title.trim()}
              className="rounded-xl font-bold"
            >
              {createMutation.isPending ? 'Saving...' : 'Add to Vault'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
