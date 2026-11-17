import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/errors.js';
import type {
  CreateItineraryDayInput,
  UpdateItineraryDayInput,
  BatchGenerateDaysInput,
  CreateItineraryItemInput,
  UpdateItineraryItemInput,
  ItineraryDayWithItems,
} from '@waylo/shared';

// ─── Fetch Complete Trip Itinerary ──────────────────────────
export async function getTripItinerary(tripId: string): Promise<ItineraryDayWithItems[]> {
  const days = await prisma.itineraryDay.findMany({
    where: { tripId },
    orderBy: { dayNumber: 'asc' },
    include: {
      items: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });

  return days as unknown as ItineraryDayWithItems[];
}

// ─── Create Single Itinerary Day ────────────────────────────
export async function createDay(
  tripId: string,
  data: CreateItineraryDayInput
) {
  // Check if dayNumber already exists
  const existing = await prisma.itineraryDay.findUnique({
    where: {
      tripId_dayNumber: {
        tripId,
        dayNumber: data.dayNumber,
      },
    },
  });

  if (existing) {
    throw AppError.conflict(`Day ${data.dayNumber} already exists for this trip`);
  }

  const day = await prisma.itineraryDay.create({
    data: {
      tripId,
      dayNumber: data.dayNumber,
      date: data.date ? new Date(data.date) : null,
      title: data.title,
      startLocation: data.startLocation,
      endLocation: data.endLocation,
      plannedDeparture: data.plannedDeparture,
      plannedArrival: data.plannedArrival,
      actualDeparture: data.actualDeparture,
      actualArrival: data.actualArrival,
      plannedDistanceKm: data.plannedDistanceKm,
      actualDistanceKm: data.actualDistanceKm,
      notes: data.notes,
    },
    include: {
      items: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });

  return day;
}

// ─── Auto Batch Generate Days ───────────────────────────────
export async function batchGenerateDays(
  tripId: string,
  data: BatchGenerateDaysInput
) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    throw AppError.notFound('Trip not found');
  }

  // Calculate day count
  let count = data.dayCount;
  const startDate = data.startDate ? new Date(data.startDate) : trip.startDate;
  const endDate = data.endDate ? new Date(data.endDate) : trip.endDate;

  if (!count && startDate && endDate) {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    count = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  // Default to 3 days if no duration specified
  count = Math.min(Math.max(count || 3, 1), 60);

  // Find current max day number to append safely or start fresh
  const maxDay = await prisma.itineraryDay.findFirst({
    where: { tripId },
    orderBy: { dayNumber: 'desc' },
    select: { dayNumber: true },
  });

  const startDayNumber = (maxDay?.dayNumber ?? 0) + 1;

  const createdDays = await prisma.$transaction(async (tx) => {
    const days = [];
    for (let i = 0; i < count; i++) {
      const dayNum = startDayNumber + i;
      let dayDate: Date | null = null;

      if (startDate) {
        dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + (startDayNumber - 1) + i);
      }

      const defaultTitle =
        i === 0 && (data.startLocation || trip.startLocation)
          ? `Departure from ${data.startLocation || trip.startLocation}`
          : i === count - 1 && (data.destination || trip.destination)
          ? `Arrival at ${data.destination || trip.destination}`
          : `Day ${dayNum} Exploration`;

      const day = await tx.itineraryDay.create({
        data: {
          tripId,
          dayNumber: dayNum,
          date: dayDate,
          title: defaultTitle,
          startLocation: i === 0 ? data.startLocation || trip.startLocation : undefined,
          endLocation: i === count - 1 ? data.destination || trip.destination : undefined,
          plannedDeparture: '08:00',
          plannedArrival: '18:00',
        },
        include: {
          items: true,
        },
      });

      // Add a couple starter suggested items for day 1
      if (i === 0) {
        await tx.itineraryItem.createMany({
          data: [
            {
              dayId: day.id,
              title: 'Morning Briefing & Vehicle Check',
              itemType: 'ACTIVITY',
              orderIndex: 0,
              startTime: '08:00',
              endTime: '08:30',
              flexibility: 'FIXED',
              isCompleted: false,
              isOptional: false,
              notes: 'Check tyre pressures, chain lube, fluids, and pack essentials.',
            },
            {
              dayId: day.id,
              title: 'Departure & Cruise',
              itemType: 'TRAVEL',
              orderIndex: 1,
              startTime: '08:30',
              endTime: '12:30',
              flexibility: 'FLEXIBLE',
              isCompleted: false,
              isOptional: false,
            },
            {
              dayId: day.id,
              title: 'Lunch & Fuel Refill',
              itemType: 'MEAL',
              orderIndex: 2,
              startTime: '12:30',
              endTime: '13:30',
              flexibility: 'FLEXIBLE',
              isCompleted: false,
              isOptional: false,
            },
          ],
        });
      }

      days.push(day);
    }
    return days;
  });

  return getTripItinerary(tripId);
}

// ─── Update Itinerary Day ───────────────────────────────────
export async function updateDay(
  tripId: string,
  dayId: string,
  data: UpdateItineraryDayInput
) {
  const day = await prisma.itineraryDay.findFirst({
    where: { id: dayId, tripId },
  });

  if (!day) {
    throw AppError.notFound('Itinerary day not found');
  }

  // If changing dayNumber, check for conflicts
  if (data.dayNumber !== undefined && data.dayNumber !== day.dayNumber) {
    const existing = await prisma.itineraryDay.findUnique({
      where: {
        tripId_dayNumber: {
          tripId,
          dayNumber: data.dayNumber,
        },
      },
    });

    if (existing) {
      throw AppError.conflict(`Day ${data.dayNumber} already exists`);
    }
  }

  const updated = await prisma.itineraryDay.update({
    where: { id: dayId },
    data: {
      dayNumber: data.dayNumber,
      date: data.date ? new Date(data.date) : data.date === null ? null : undefined,
      title: data.title,
      startLocation: data.startLocation,
      endLocation: data.endLocation,
      plannedDeparture: data.plannedDeparture,
      plannedArrival: data.plannedArrival,
      actualDeparture: data.actualDeparture,
      actualArrival: data.actualArrival,
      plannedDistanceKm: data.plannedDistanceKm,
      actualDistanceKm: data.actualDistanceKm,
      notes: data.notes,
    },
    include: {
      items: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });

  return updated;
}

// ─── Delete Itinerary Day ───────────────────────────────────
export async function deleteDay(tripId: string, dayId: string) {
  const day = await prisma.itineraryDay.findFirst({
    where: { id: dayId, tripId },
  });

  if (!day) {
    throw AppError.notFound('Itinerary day not found');
  }

  await prisma.$transaction(async (tx) => {
    // Delete the day (cascade deletes items)
    await tx.itineraryDay.delete({
      where: { id: dayId },
    });

    // Renumber subsequent days so day numbers remain continuous
    const subsequentDays = await tx.itineraryDay.findMany({
      where: {
        tripId,
        dayNumber: { gt: day.dayNumber },
      },
      orderBy: { dayNumber: 'asc' },
    });

    for (const d of subsequentDays) {
      await tx.itineraryDay.update({
        where: { id: d.id },
        data: { dayNumber: d.dayNumber - 1 },
      });
    }
  });

  return { deleted: true, dayNumber: day.dayNumber };
}

// ─── Create Itinerary Item / Stop ───────────────────────────
export async function createItem(
  tripId: string,
  dayId: string,
  data: CreateItineraryItemInput
) {
  const day = await prisma.itineraryDay.findFirst({
    where: { id: dayId, tripId },
  });

  if (!day) {
    throw AppError.notFound('Itinerary day not found for this trip');
  }

  // Determine orderIndex if not given or 0
  let orderIndex = data.orderIndex;
  if (!orderIndex) {
    const maxItem = await prisma.itineraryItem.findFirst({
      where: { dayId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });
    orderIndex = (maxItem?.orderIndex ?? -1) + 1;
  }

  const item = await prisma.itineraryItem.create({
    data: {
      dayId,
      title: data.title,
      description: data.description,
      itemType: data.itemType,
      orderIndex,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      flexibility: data.flexibility,
      isCompleted: data.isCompleted ?? false,
      isOptional: data.isOptional ?? false,
      cost: data.cost,
      currency: data.currency ?? 'INR',
      notes: data.notes,
      reminders: data.reminders ?? [],
    },
  });

  return item;
}

// ─── Update Itinerary Item ──────────────────────────────────
export async function updateItem(
  tripId: string,
  dayId: string,
  itemId: string,
  data: UpdateItineraryItemInput
) {
  const item = await prisma.itineraryItem.findFirst({
    where: {
      id: itemId,
      day: {
        id: dayId,
        tripId,
      },
    },
  });

  if (!item) {
    throw AppError.notFound('Itinerary item not found');
  }

  const updated = await prisma.itineraryItem.update({
    where: { id: itemId },
    data: {
      title: data.title,
      description: data.description,
      itemType: data.itemType,
      orderIndex: data.orderIndex,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      flexibility: data.flexibility,
      isCompleted: data.isCompleted,
      isOptional: data.isOptional,
      cost: data.cost,
      currency: data.currency,
      notes: data.notes,
      reminders: data.reminders,
    },
  });

  return updated;
}

// ─── Quick Toggle Item Completed ────────────────────────────
export async function toggleItemComplete(
  tripId: string,
  dayId: string,
  itemId: string
) {
  const item = await prisma.itineraryItem.findFirst({
    where: {
      id: itemId,
      day: {
        id: dayId,
        tripId,
      },
    },
  });

  if (!item) {
    throw AppError.notFound('Itinerary item not found');
  }

  const updated = await prisma.itineraryItem.update({
    where: { id: itemId },
    data: {
      isCompleted: !item.isCompleted,
    },
  });

  return updated;
}

// ─── Delete Itinerary Item ──────────────────────────────────
export async function deleteItem(
  tripId: string,
  dayId: string,
  itemId: string
) {
  const item = await prisma.itineraryItem.findFirst({
    where: {
      id: itemId,
      day: {
        id: dayId,
        tripId,
      },
    },
  });

  if (!item) {
    throw AppError.notFound('Itinerary item not found');
  }

  await prisma.$transaction(async (tx) => {
    await tx.itineraryItem.delete({
      where: { id: itemId },
    });

    // Re-index remaining items
    const remaining = await tx.itineraryItem.findMany({
      where: { dayId },
      orderBy: { orderIndex: 'asc' },
    });

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].orderIndex !== i) {
        await tx.itineraryItem.update({
          where: { id: remaining[i].id },
          data: { orderIndex: i },
        });
      }
    }
  });

  return { deleted: true };
}

// ─── Reorder Itinerary Items ────────────────────────────────
export async function reorderItems(
  tripId: string,
  dayId: string,
  items: { id: string; orderIndex: number }[]
) {
  const day = await prisma.itineraryDay.findFirst({
    where: { id: dayId, tripId },
  });

  if (!day) {
    throw AppError.notFound('Itinerary day not found for this trip');
  }

  await prisma.$transaction(
    items.map(({ id, orderIndex }) =>
      prisma.itineraryItem.update({
        where: { id },
        data: { orderIndex },
      })
    )
  );

  const updatedItems = await prisma.itineraryItem.findMany({
    where: { dayId },
    orderBy: { orderIndex: 'asc' },
  });

  return updatedItems;
}
