import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/errors.js';
import type {
  CreateAccommodationInput,
  UpdateAccommodationInput,
} from '@waylo/shared';

export class AccommodationsService {
  /**
   * List all accommodations for a trip
   */
  async listAccommodations(tripId: string) {
    return prisma.accommodation.findMany({
      where: { tripId },
      orderBy: { checkInDate: 'asc' },
    });
  }

  /**
   * Get single accommodation details
   */
  async getAccommodation(accommodationId: string) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id: accommodationId },
    });

    if (!accommodation) {
      throw AppError.notFound('Accommodation not found');
    }

    return accommodation;
  }

  /**
   * Create accommodation booking record
   */
  async createAccommodation(tripId: string, data: CreateAccommodationInput) {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      throw AppError.notFound('Trip not found');
    }

    return prisma.accommodation.create({
      data: {
        tripId,
        name: data.name,
        type: data.type || 'HOTEL',
        location: data.location || null,
        checkInDate: new Date(data.checkInDate),
        checkOutDate: new Date(data.checkOutDate),
        checkInTime: data.checkInTime || null,
        checkOutTime: data.checkOutTime || null,
        confirmationCode: data.confirmationCode || null,
        totalCost: data.totalCost || null,
        currency: data.currency || trip.currency || 'INR',
        contactPhone: data.contactPhone || null,
        contactEmail: data.contactEmail || null,
        notes: data.notes || null,
        bookingStatus: data.bookingStatus || 'CONFIRMED',
      },
    });
  }

  /**
   * Update accommodation details
   */
  async updateAccommodation(accommodationId: string, data: UpdateAccommodationInput) {
    const existing = await prisma.accommodation.findUnique({
      where: { id: accommodationId },
    });

    if (!existing) {
      throw AppError.notFound('Accommodation not found');
    }

    return prisma.accommodation.update({
      where: { id: accommodationId },
      data: {
        name: data.name ?? undefined,
        type: data.type ?? undefined,
        location: data.location !== undefined ? data.location : undefined,
        checkInDate: data.checkInDate ? new Date(data.checkInDate) : undefined,
        checkOutDate: data.checkOutDate ? new Date(data.checkOutDate) : undefined,
        checkInTime: data.checkInTime !== undefined ? data.checkInTime : undefined,
        checkOutTime: data.checkOutTime !== undefined ? data.checkOutTime : undefined,
        confirmationCode: data.confirmationCode !== undefined ? data.confirmationCode : undefined,
        totalCost: data.totalCost !== undefined ? data.totalCost : undefined,
        currency: data.currency ?? undefined,
        contactPhone: data.contactPhone !== undefined ? data.contactPhone : undefined,
        contactEmail: data.contactEmail !== undefined ? data.contactEmail : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
        bookingStatus: data.bookingStatus ?? undefined,
      },
    });
  }

  /**
   * Delete accommodation booking
   */
  async deleteAccommodation(accommodationId: string) {
    const existing = await prisma.accommodation.findUnique({
      where: { id: accommodationId },
    });

    if (!existing) {
      throw AppError.notFound('Accommodation not found');
    }

    await prisma.accommodation.delete({ where: { id: accommodationId } });
    return { success: true, message: 'Accommodation deleted successfully' };
  }
}

export const accommodationsService = new AccommodationsService();
