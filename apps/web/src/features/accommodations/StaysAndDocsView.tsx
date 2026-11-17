import { useState } from 'react';
import {
  Hotel,
  FileText,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Lock,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useAccommodations, useDeleteAccommodation } from './hooks';
import { useDocuments, useDeleteDocument } from '../documents/hooks';
import {
  CreateAccommodationDialog,
  BOOKING_TYPE_LABELS,
} from './CreateAccommodationDialog';
import {
  UploadDocumentDialog,
  DOCUMENT_TYPE_LABELS,
} from '../documents/UploadDocumentDialog';
import type {
  TripWithDetails,
  Accommodation,
  TripDocument,
  BookingStatus,
} from '@waylo/shared';

interface StaysAndDocsViewProps {
  trip: TripWithDetails | any;
}

export function StaysAndDocsView({ trip }: StaysAndDocsViewProps) {
  const [activeTab, setActiveTab] = useState<'stays' | 'vault'>('stays');
  const [showStayDialog, setShowStayDialog] = useState(false);
  const [showDocDialog, setShowDocDialog] = useState(false);

  const { data: stays = [], isLoading: isLoadingStays } = useAccommodations(trip.id);
  const { data: documents = [], isLoading: isLoadingDocs } = useDocuments(trip.id);

  const deleteStayMutation = useDeleteAccommodation(trip.id);
  const deleteDocMutation = useDeleteDocument(trip.id);

  const currency = trip.currency || 'INR';

  const formatCurrency = (amountInCents: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency === 'INR' ? 'INR' : currency,
      maximumFractionDigits: 0,
    }).format(amountInCents / 100);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold py-0">
            ✓ Confirmed
          </Badge>
        );
      case 'TENTATIVE':
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold py-0">
            ⏳ Tentative
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] font-bold py-0">
            ✕ Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoadingStays || isLoadingDocs) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const totalStayCost = stays.reduce((acc, s) => acc + (s.totalCost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Hotel className="h-6 w-6 text-primary" />
            Accommodations & Document Vault
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your homestay & hotel reservations, check-in vouchers, and secure digital travel passes.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeTab === 'stays' ? (
            <Button
              onClick={() => setShowStayDialog(true)}
              className="gap-2 rounded-xl font-bold shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Stay
            </Button>
          ) : (
            <Button
              onClick={() => setShowDocDialog(true)}
              className="gap-2 rounded-xl font-bold shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Document
            </Button>
          )}
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'stays' | 'vault')}
      >
        <TabsList className="bg-muted/60 p-1 rounded-2xl">
          <TabsTrigger value="stays" className="rounded-xl px-4 py-1.5 text-xs font-semibold gap-2">
            <Hotel className="h-4 w-4" />
            <span>Stays & Bookings ({stays.length})</span>
          </TabsTrigger>
          <TabsTrigger value="vault" className="rounded-xl px-4 py-1.5 text-xs font-semibold gap-2">
            <FileText className="h-4 w-4" />
            <span>Documents Vault ({documents.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* ─── Tab 1: Stays & Accommodations ─────────────────── */}
        <TabsContent value="stays" className="space-y-4 pt-2">
          {/* Top Metric Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="p-4 rounded-2xl border-border/80">
              <span className="text-[11px] font-semibold text-muted-foreground block">
                Total Accommodations
              </span>
              <span className="text-xl font-black text-foreground mt-0.5 block">
                {stays.length} reserved
              </span>
            </Card>

            <Card className="p-4 rounded-2xl border-border/80">
              <span className="text-[11px] font-semibold text-muted-foreground block">
                Total Stay Spend
              </span>
              <span className="text-xl font-black text-foreground mt-0.5 block">
                {formatCurrency(totalStayCost)}
              </span>
            </Card>

            <Card className="p-4 rounded-2xl border-border/80">
              <span className="text-[11px] font-semibold text-muted-foreground block">
                Expedition Destination
              </span>
              <span className="text-sm font-bold text-foreground mt-1 truncate block">
                {trip.destination || 'Not specified'}
              </span>
            </Card>
          </div>

          {stays.length === 0 ? (
            <EmptyState
              icon={Hotel}
              title="No accommodations booked yet"
              description="Add hotels, beachside homestays, hostels, or campsites to keep check-in codes and contact numbers readily accessible offline."
              actionLabel="Add First Stay"
              onAction={() => setShowStayDialog(true)}
            />
          ) : (
            <div className="space-y-4">
              {stays.map((stay: Accommodation) => {
                const checkIn = new Date(stay.checkInDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                const checkOut = new Date(stay.checkOutDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <Card
                    key={stay.id}
                    className="p-5 sm:p-6 rounded-3xl border-border/80 space-y-4 hover:border-primary/40 transition-all bg-card/60"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-lg text-foreground">
                            {stay.name}
                          </h3>
                          <Badge variant="outline" className="text-xs font-medium">
                            {BOOKING_TYPE_LABELS[stay.type] || stay.type}
                          </Badge>
                          {getStatusBadge(stay.bookingStatus)}
                        </div>

                        {stay.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span>{stay.location}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {stay.totalCost && (
                          <span className="text-lg font-black text-foreground mr-2">
                            {formatCurrency(stay.totalCost)}
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => deleteStayMutation.mutate(stay.id)}
                          disabled={deleteStayMutation.isPending}
                          title="Delete stay"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Stay Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-2xl bg-muted/40">
                        <span className="text-[11px] text-muted-foreground font-semibold block flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-primary" /> Check-in
                        </span>
                        <span className="font-bold text-foreground text-sm mt-0.5 block">
                          {checkIn}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          From {stay.checkInTime || '14:00'}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-muted/40">
                        <span className="text-[11px] text-muted-foreground font-semibold block flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-rose-500" /> Check-out
                        </span>
                        <span className="font-bold text-foreground text-sm mt-0.5 block">
                          {checkOut}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Until {stay.checkOutTime || '11:00'}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-muted/40">
                        <span className="text-[11px] text-muted-foreground font-semibold block flex items-center gap-1">
                          <Clock className="h-3 w-3 text-amber-500" /> Booking Ref #
                        </span>
                        <span className="font-mono font-bold text-primary text-sm mt-0.5 block">
                          {stay.confirmationCode || 'Direct Host'}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-muted/40">
                        <span className="text-[11px] text-muted-foreground font-semibold block flex items-center gap-1">
                          <Phone className="h-3 w-3 text-emerald-500" /> Host Contact
                        </span>
                        <span className="font-bold text-foreground text-xs mt-0.5 block truncate">
                          {stay.contactPhone || 'No phone'}
                        </span>
                        {stay.contactEmail && (
                          <span className="text-[10px] text-muted-foreground truncate block">
                            {stay.contactEmail}
                          </span>
                        )}
                      </div>
                    </div>

                    {stay.notes && (
                      <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-2xl border border-border/50 flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{stay.notes}</span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ─── Tab 2: Documents Vault ────────────────────────── */}
        <TabsContent value="vault" className="space-y-4 pt-2">
          {documents.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Trip Document Vault is Empty"
              description="Keep vehicle registration papers, travel insurance cards, and entry permits saved in one secure digital folder for your whole travel crew."
              actionLabel="Add Document to Vault"
              onAction={() => setShowDocDialog(true)}
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {documents.map((doc: TripDocument) => {
                const expiry = doc.expiryDate
                  ? new Date(doc.expiryDate).toLocaleDateString()
                  : null;

                return (
                  <Card
                    key={doc.id}
                    className="p-5 rounded-3xl border-border/80 space-y-3 bg-card/60 flex flex-col justify-between hover:border-primary/40 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs font-semibold">
                            {DOCUMENT_TYPE_LABELS[doc.documentType] || doc.documentType}
                          </Badge>
                          {doc.isShared ? (
                            <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-bold py-0 flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" /> Shared with Crew
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] py-0 flex items-center gap-1">
                              <Lock className="h-3 w-3" /> Private
                            </Badge>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() => deleteDocMutation.mutate(doc.id)}
                          disabled={deleteDocMutation.isPending}
                          title="Remove document"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <h4 className="font-bold text-base text-foreground leading-snug">
                        {doc.title}
                      </h4>

                      {doc.fileName && (
                        <p className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-primary" />
                          <span>{doc.fileName}</span>
                        </p>
                      )}

                      {doc.notes && (
                        <p className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/50">
                          {doc.notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Added by{' '}
                        <b className="text-foreground">
                          {doc.uploadedBy?.displayName || 'Traveler'}
                        </b>
                      </span>

                      {expiry && (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Expires: {expiry}
                        </span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateAccommodationDialog
        open={showStayDialog}
        onOpenChange={setShowStayDialog}
        trip={trip}
      />

      <UploadDocumentDialog
        open={showDocDialog}
        onOpenChange={setShowDocDialog}
        trip={trip}
      />
    </div>
  );
}
