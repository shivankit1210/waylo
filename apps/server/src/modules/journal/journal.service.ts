import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/errors.js';
import type {
  CreateJournalEntryInput,
  UpdateJournalEntryInput,
  CreateTripHighlightInput,
  UpdateTripHighlightInput,
  TripAnalytics,
  CategoryExpenseSummary,
  ExpenseCategory,
  SupportedCurrency,
} from '@waylo/shared';

export class JournalService {
  // ─── Journal Entries ────────────────────────────────────────

  static async listJournalEntries(tripId: string) {
    return prisma.journalEntry.findMany({
      where: { tripId },
      orderBy: [{ dayNumber: 'asc' }, { createdAt: 'desc' }],
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });
  }

  static async getJournalEntry(tripId: string, entryId: string) {
    const entry = await prisma.journalEntry.findFirst({
      where: { id: entryId, tripId },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });

    if (!entry) throw AppError.notFound('Journal entry not found');
    return entry;
  }

  static async createJournalEntry(tripId: string, userId: string, data: CreateJournalEntryInput) {
    return prisma.journalEntry.create({
      data: {
        tripId,
        authorId: userId,
        dayNumber: data.dayNumber ?? null,
        title: data.title,
        content: data.content,
        location: data.location ?? null,
        mood: data.mood ?? null,
        weatherNote: data.weatherNote ?? null,
        mediaUrls: data.mediaUrls || [],
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });
  }

  static async updateJournalEntry(tripId: string, entryId: string, data: UpdateJournalEntryInput) {
    await this.getJournalEntry(tripId, entryId);

    return prisma.journalEntry.update({
      where: { id: entryId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.dayNumber !== undefined && { dayNumber: data.dayNumber }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.mood !== undefined && { mood: data.mood }),
        ...(data.weatherNote !== undefined && { weatherNote: data.weatherNote }),
        ...(data.mediaUrls !== undefined && { mediaUrls: data.mediaUrls }),
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });
  }

  static async deleteJournalEntry(tripId: string, entryId: string) {
    await this.getJournalEntry(tripId, entryId);
    await prisma.journalEntry.delete({ where: { id: entryId } });
  }

  // ─── Trip Highlights ────────────────────────────────────────

  static async listHighlights(tripId: string) {
    return prisma.tripHighlight.findMany({
      where: { tripId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createHighlight(tripId: string, data: CreateTripHighlightInput) {
    return prisma.tripHighlight.create({
      data: {
        tripId,
        title: data.title,
        description: data.description ?? null,
        category: data.category,
        location: data.location ?? null,
        rating: data.rating ?? 5,
        photoUrl: data.photoUrl ?? null,
      },
    });
  }

  static async updateHighlight(tripId: string, highlightId: string, data: UpdateTripHighlightInput) {
    const highlight = await prisma.tripHighlight.findFirst({
      where: { id: highlightId, tripId },
    });
    if (!highlight) throw AppError.notFound('Highlight not found');

    return prisma.tripHighlight.update({
      where: { id: highlightId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
      },
    });
  }

  static async deleteHighlight(tripId: string, highlightId: string) {
    const highlight = await prisma.tripHighlight.findFirst({
      where: { id: highlightId, tripId },
    });
    if (!highlight) throw AppError.notFound('Highlight not found');

    await prisma.tripHighlight.delete({ where: { id: highlightId } });
  }

  // ─── Analytics Engine ───────────────────────────────────────

  static async getTripAnalytics(tripId: string): Promise<TripAnalytics> {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        members: true,
        itineraryDays: {
          include: {
            items: true,
          },
        },
        expenses: true,
        fuelLogs: true,
        journalEntries: true,
        highlights: true,
        packingLists: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!trip) throw AppError.notFound('Trip not found');

    // Days count
    const totalDays = trip.itineraryDays.length || 1;

    // Distance calculation
    let totalDistancePlannedKm = 0;
    let totalDistanceLoggedKm = 0;
    let totalStops = 0;
    let completedStops = 0;

    for (const day of trip.itineraryDays) {
      if (day.plannedDistanceKm) totalDistancePlannedKm += day.plannedDistanceKm;
      if (day.actualDistanceKm) totalDistanceLoggedKm += day.actualDistanceKm;
      for (const item of day.items) {
        totalStops += 1;
        if (item.isCompleted) completedStops += 1;
      }
    }

    // Fuel Logs calculation
    let totalFuelLiters = 0;
    let totalFuelCost = 0;
    for (const fuel of trip.fuelLogs) {
      totalFuelLiters += fuel.litersOrKwh;
      if (fuel.cost) totalFuelCost += fuel.cost;
    }

    // If odometer logged across fuel refills
    if (trip.fuelLogs.length >= 2) {
      const sortedLogs = [...trip.fuelLogs].sort((a, b) => a.odometer - b.odometer);
      const diffKm = sortedLogs[sortedLogs.length - 1].odometer - sortedLogs[0].odometer;
      if (diffKm > 0) totalDistanceLoggedKm = diffKm;
    } else if (totalDistancePlannedKm > 0) {
      totalDistanceLoggedKm = totalDistancePlannedKm;
    }

    const averageKmPerLiter =
      totalFuelLiters > 0 && totalDistanceLoggedKm > 0
        ? parseFloat((totalDistanceLoggedKm / totalFuelLiters).toFixed(1))
        : 0;

    // Expenses calculation
    let totalSpentCents = 0;
    const categoryTotals: Record<string, { amount: number; count: number }> = {};

    for (const expense of trip.expenses) {
      totalSpentCents += expense.amount;
      const cat = expense.category;
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = { amount: 0, count: 0 };
      }
      categoryTotals[cat].amount += expense.amount;
      categoryTotals[cat].count += 1;
    }

    const categoryBreakdown: CategoryExpenseSummary[] = Object.entries(categoryTotals).map(
      ([cat, data]) => ({
        category: cat as ExpenseCategory,
        amount: data.amount,
        percentage:
          totalSpentCents > 0 ? Math.round((data.amount / totalSpentCents) * 100) : 0,
        count: data.count,
      })
    );

    // Sort categories descending by amount
    categoryBreakdown.sort((a, b) => b.amount - a.amount);

    const budgetEstimated = trip.estimatedBudget || 0;
    const budgetVariance = budgetEstimated - totalSpentCents;
    const membersCount = trip.members.length || 1;
    const averagePerDay = Math.round(totalSpentCents / totalDays);
    const averagePerPerson = Math.round(totalSpentCents / membersCount);
    const costPerKm =
      totalDistanceLoggedKm > 0
        ? parseFloat((totalSpentCents / 100 / totalDistanceLoggedKm).toFixed(2))
        : 0;

    // Packing completion
    let allPackingItems = 0;
    let packedItems = 0;
    for (const list of trip.packingLists) {
      for (const item of list.items) {
        allPackingItems += 1;
        if (item.status === 'PACKED' || item.status === 'WORN') {
          packedItems += 1;
        }
      }
    }
    const packingCompletionPercentage =
      allPackingItems > 0 ? Math.round((packedItems / allPackingItems) * 100) : 100;

    return {
      tripId: trip.id,
      tripName: trip.name,
      totalDays,
      totalDistancePlannedKm,
      totalDistanceLoggedKm,
      stopsCount: {
        total: totalStops,
        completed: completedStops,
        remaining: totalStops - completedStops,
      },
      expenses: {
        totalSpent: totalSpentCents,
        budgetEstimated,
        budgetVariance,
        currency: (trip.currency || 'INR') as SupportedCurrency,
        averagePerDay,
        averagePerPerson,
        costPerKm,
        categoryBreakdown,
      },
      fuelAnalytics: {
        totalFuelLiters: parseFloat(totalFuelLiters.toFixed(1)),
        totalFuelCost,
        averageKmPerLiter,
        logsCount: trip.fuelLogs.length,
      },
      crewStats: {
        totalMembers: membersCount,
        journalEntriesCount: trip.journalEntries.length,
        highlightsCount: trip.highlights.length,
        packingCompletionPercentage,
      },
    };
  }
}
