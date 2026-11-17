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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BookingType,
  BookingStatus,
  type TripWithDetails,
} from '@waylo/shared';
import { useCreateAccommodation } from './hooks';

interface CreateAccommodationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripWithDetails | any;
}

export const BOOKING_TYPE_LABELS: Record<string, string> = {
  [BookingType.HOTEL]: '🏨 Hotel',
  [BookingType.HOMESTAY]: '🏡 Homestay / Villa',
  [BookingType.HOSTEL]: '🎒 Backpacker Hostel',
  [BookingType.CAMPSITE]: '⛺ Campsite / Glamping',
  [BookingType.GUESTHOUSE]: '🏠 Guest House',
  [BookingType.OTHER]: '✨ Other Stay',
};

export function CreateAccommodationDialog({
  open,
  onOpenChange,
  trip,
}: CreateAccommodationDialogProps) {
  const createMutation = useCreateAccommodation(trip.id);

  const [name, setName] = useState('');
  const [type, setType] = useState<BookingType>(BookingType.HOMESTAY);
  const [location, setLocation] = useState(trip.destination || '');
  const [checkInDate, setCheckInDate] = useState(
    trip.startDate ? trip.startDate.split('T')[0] : ''
  );
  const [checkOutDate, setCheckOutDate] = useState(
    trip.endDate ? trip.endDate.split('T')[0] : ''
  );
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutTime, setCheckOutTime] = useState('11:00');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [displayCost, setDisplayCost] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>(BookingStatus.CONFIRMED);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !checkInDate || !checkOutDate) return;

    const totalCostCents = displayCost ? Math.round(parseFloat(displayCost) * 100) : null;

    await createMutation.mutateAsync({
      name: name.trim(),
      type,
      location: location.trim() || null,
      checkInDate,
      checkOutDate,
      checkInTime: checkInTime.trim() || null,
      checkOutTime: checkOutTime.trim() || null,
      confirmationCode: confirmationCode.trim().toUpperCase() || null,
      totalCost: totalCostCents,
      currency: (trip.currency || 'INR') as any,
      contactPhone: contactPhone.trim() || null,
      contactEmail: contactEmail.trim() || null,
      notes: notes.trim() || null,
      bookingStatus,
    });

    setName('');
    setConfirmationCode('');
    setDisplayCost('');
    setContactPhone('');
    setContactEmail('');
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Stay & Accommodation</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Save hotel, villa, or campsite booking details, confirmation vouchers, and check-in times.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Stay Name */}
          <div className="space-y-1.5">
            <Label htmlFor="acc-name" className="text-xs font-semibold">
              Stay Name *
            </Label>
            <Input
              id="acc-name"
              placeholder="e.g. Morjim Beach Villa, Zostel Vagator"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Accommodation Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as BookingType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BookingType.HOMESTAY}>🏡 Homestay / Villa</SelectItem>
                  <SelectItem value={BookingType.HOTEL}>🏨 Hotel</SelectItem>
                  <SelectItem value={BookingType.HOSTEL}>🎒 Hostel</SelectItem>
                  <SelectItem value={BookingType.CAMPSITE}>⛺ Campsite</SelectItem>
                  <SelectItem value={BookingType.GUESTHOUSE}>🏠 Guest House</SelectItem>
                  <SelectItem value={BookingType.OTHER}>✨ Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Booking Status</Label>
              <Select
                value={bookingStatus}
                onValueChange={(v) => setBookingStatus(v as BookingStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BookingStatus.CONFIRMED}>🟢 Confirmed</SelectItem>
                  <SelectItem value={BookingStatus.TENTATIVE}>🟡 Tentative / Holding</SelectItem>
                  <SelectItem value={BookingStatus.CANCELLED}>🔴 Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label htmlFor="acc-loc" className="text-xs font-semibold">
              Location / Address
            </Label>
            <Input
              id="acc-loc"
              placeholder="e.g. Morjim Beach Road, North Goa"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="acc-checkin" className="text-xs font-semibold">
                Check-in Date *
              </Label>
              <Input
                id="acc-checkin"
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="acc-checkout" className="text-xs font-semibold">
                Check-out Date *
              </Label>
              <Input
                id="acc-checkout"
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="acc-intime" className="text-xs font-semibold">
                Check-in Time
              </Label>
              <Input
                id="acc-intime"
                placeholder="14:00"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="acc-outtime" className="text-xs font-semibold">
                Check-out Time
              </Label>
              <Input
                id="acc-outtime"
                placeholder="11:00"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
              />
            </div>
          </div>

          {/* Confirmation Code & Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="acc-code" className="text-xs font-semibold">
                Confirmation / Booking Ref #
              </Label>
              <Input
                id="acc-code"
                placeholder="e.g. BKG-883921"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="acc-cost" className="text-xs font-semibold">
                Total Cost ({trip.currency || 'INR'})
              </Label>
              <Input
                id="acc-cost"
                type="number"
                step="0.01"
                placeholder="e.g. 8500"
                value={displayCost}
                onChange={(e) => setDisplayCost(e.target.value)}
              />
            </div>
          </div>

          {/* Contact Phone & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="acc-phone" className="text-xs font-semibold">
                Contact Phone / WhatsApp
              </Label>
              <Input
                id="acc-phone"
                placeholder="+91 98221 44556"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="acc-email" className="text-xs font-semibold">
                Contact Email
              </Label>
              <Input
                id="acc-email"
                type="email"
                placeholder="stay@host.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="acc-notes" className="text-xs font-semibold">
              Notes / Amenities
            </Label>
            <Textarea
              id="acc-notes"
              placeholder="e.g. Gated parking, WiFi password, pool access, breakfast included."
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
              disabled={createMutation.isPending || !name.trim()}
              className="rounded-xl font-bold"
            >
              {createMutation.isPending ? 'Saving...' : 'Save Stay'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
