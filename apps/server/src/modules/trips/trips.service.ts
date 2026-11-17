import {
  TripStatus,
  TripType,
  TripRole,
  TransportMode,
  TripVisibility,
  type CreateTripInput,
  type UpdateTripInput,
  type PaginationInput,
  type TripWithDetails,
} from '@waylo/shared';
import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/errors.js';
import type { PaginationMeta } from '../../utils/apiResponse.js';

interface RawTripWithRelations {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  status: string;
  tripType: string;
  transportModes: string[];
  startDate: Date | null;
  endDate: Date | null;
  startLocation: string | null;
  destination: string | null;
  returnLocation: string | null;
  currency: string;
  estimatedBudget: number | null;
  visibility: string;
  tags: string[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
  members?: Array<{
    id: string;
    userId: string;
    role: string;
    user: {
      id: string;
      displayName: string;
      avatarUrl: string | null;
      email: string;
    };
  }>;
  _count?: {
    members: number;
    itineraryDays: number;
    expenses: number;
  };
}

export function formatTripWithDetails(trip: RawTripWithRelations): TripWithDetails {
  return {
    id: trip.id,
    name: trip.name,
    description: trip.description,
    coverImageUrl: trip.coverImageUrl,
    status: trip.status as TripStatus,
    tripType: trip.tripType as TripType,
    transportModes: trip.transportModes as TransportMode[],
    startDate: trip.startDate ? trip.startDate.toISOString() : null,
    endDate: trip.endDate ? trip.endDate.toISOString() : null,
    startLocation: trip.startLocation,
    destination: trip.destination,
    returnLocation: trip.returnLocation,
    currency: trip.currency as TripWithDetails['currency'],
    estimatedBudget: trip.estimatedBudget,
    visibility: trip.visibility as TripVisibility,
    tags: trip.tags,
    ownerId: trip.ownerId,
    createdAt: trip.createdAt.toISOString(),
    updatedAt: trip.updatedAt.toISOString(),
    owner: {
      id: trip.owner.id,
      displayName: trip.owner.displayName,
      avatarUrl: trip.owner.avatarUrl,
    },
    members: (trip.members ?? []).map((m) => ({
      id: m.id,
      userId: m.userId,
      role: m.role as TripRole,
      user: {
        id: m.user.id,
        displayName: m.user.displayName,
        avatarUrl: m.user.avatarUrl,
        email: m.user.email,
      },
    })),
    _count: trip._count,
  };
}

const VALID_TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  [TripStatus.DRAFT]: [TripStatus.PLANNED, TripStatus.CANCELLED, TripStatus.ARCHIVED],
  [TripStatus.PLANNED]: [TripStatus.ONGOING, TripStatus.CANCELLED, TripStatus.ARCHIVED, TripStatus.DRAFT],
  [TripStatus.ONGOING]: [TripStatus.COMPLETED, TripStatus.CANCELLED],
  [TripStatus.COMPLETED]: [TripStatus.ARCHIVED],
  [TripStatus.CANCELLED]: [TripStatus.ARCHIVED, TripStatus.DRAFT],
  [TripStatus.ARCHIVED]: [TripStatus.DRAFT],
};

export async function listTrips(
  userId: string,
  filters: PaginationInput & { status?: string }
): Promise<{ trips: TripWithDetails[]; pagination: PaginationMeta }> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20));
  const skip = (page - 1) * pageSize;

  const whereClause: any = {
    members: {
      some: {
        userId,
      },
    },
  };

  if (filters.status) {
    whereClause.status = filters.status;
  }

  if (filters.search && filters.search.trim().length > 0) {
    whereClause.name = {
      contains: filters.search.trim(),
      mode: 'insensitive',
    };
  }

  const allowedSortFields = ['createdAt', 'updatedAt', 'startDate', 'name'];
  const sortBy = allowedSortFields.includes(filters.sortBy ?? '')
    ? filters.sortBy!
    : 'updatedAt';
  const sortOrder = filters.sortOrder === 'asc' ? 'asc' : 'desc';

  const [total, rawTrips] = await Promise.all([
    prisma.trip.count({ where: whereClause }),
    prisma.trip.findMany({
      where: whereClause,
      skip,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            itineraryDays: true,
            expenses: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    trips: rawTrips.map(formatTripWithDetails),
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}

export async function createTrip(
  userId: string,
  data: CreateTripInput
): Promise<TripWithDetails> {
  const createdTrip = await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        coverImageUrl: data.coverImageUrl ?? null,
        status: TripStatus.DRAFT,
        tripType: data.tripType ?? TripType.SOLO,
        transportModes: data.transportModes ?? [TransportMode.CAR],
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        startLocation: data.startLocation ?? null,
        destination: data.destination ?? null,
        returnLocation: data.returnLocation ?? null,
        currency: data.currency ?? 'INR',
        estimatedBudget: data.estimatedBudget ?? null,
        visibility: data.visibility ?? TripVisibility.PRIVATE,
        tags: data.tags ?? [],
        ownerId: userId,
        members: {
          create: {
            userId,
            role: TripRole.OWNER,
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            itineraryDays: true,
            expenses: true,
          },
        },
      },
    });

    return trip;
  });

  return formatTripWithDetails(createdTrip);
}

export async function getTrip(tripId: string): Promise<TripWithDetails> {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      owner: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          members: true,
          itineraryDays: true,
          expenses: true,
        },
      },
    },
  });

  if (!trip) {
    throw AppError.notFound('Trip not found');
  }

  return formatTripWithDetails(trip);
}

export async function updateTrip(
  tripId: string,
  data: UpdateTripInput
): Promise<TripWithDetails> {
  const existing = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!existing) {
    throw AppError.notFound('Trip not found');
  }

  const updatedTrip = await prisma.trip.update({
    where: { id: tripId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.coverImageUrl !== undefined && { coverImageUrl: data.coverImageUrl }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.tripType !== undefined && { tripType: data.tripType }),
      ...(data.transportModes !== undefined && { transportModes: data.transportModes }),
      ...(data.startDate !== undefined && {
        startDate: data.startDate ? new Date(data.startDate) : null,
      }),
      ...(data.endDate !== undefined && {
        endDate: data.endDate ? new Date(data.endDate) : null,
      }),
      ...(data.startLocation !== undefined && { startLocation: data.startLocation }),
      ...(data.destination !== undefined && { destination: data.destination }),
      ...(data.returnLocation !== undefined && { returnLocation: data.returnLocation }),
      ...(data.currency !== undefined && { currency: data.currency }),
      ...(data.estimatedBudget !== undefined && { estimatedBudget: data.estimatedBudget }),
      ...(data.visibility !== undefined && { visibility: data.visibility }),
      ...(data.tags !== undefined && { tags: data.tags }),
    },
    include: {
      owner: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          members: true,
          itineraryDays: true,
          expenses: true,
        },
      },
    },
  });

  return formatTripWithDetails(updatedTrip);
}

export async function deleteTrip(tripId: string): Promise<void> {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    throw AppError.notFound('Trip not found');
  }

  await prisma.trip.delete({
    where: { id: tripId },
  });
}

export async function duplicateTrip(
  userId: string,
  tripId: string
): Promise<TripWithDetails> {
  const original = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!original) {
    throw AppError.notFound('Original trip not found');
  }

  const cloned = await prisma.$transaction(async (tx) => {
    return tx.trip.create({
      data: {
        name: `[Copy] ${original.name}`,
        description: original.description,
        coverImageUrl: original.coverImageUrl,
        status: TripStatus.DRAFT,
        tripType: original.tripType,
        transportModes: original.transportModes,
        startDate: null,
        endDate: null,
        startLocation: original.startLocation,
        destination: original.destination,
        returnLocation: original.returnLocation,
        currency: original.currency,
        estimatedBudget: original.estimatedBudget,
        visibility: TripVisibility.PRIVATE,
        tags: original.tags,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: TripRole.OWNER,
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            itineraryDays: true,
            expenses: true,
          },
        },
      },
    });
  });

  return formatTripWithDetails(cloned);
}

export async function updateStatus(
  tripId: string,
  newStatus: TripStatus
): Promise<TripWithDetails> {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    throw AppError.notFound('Trip not found');
  }

  const currentStatus = trip.status as TripStatus;
  if (currentStatus === newStatus) {
    return getTrip(tripId);
  }

  const allowedNext = VALID_TRANSITIONS[currentStatus] ?? [];
  if (!allowedNext.includes(newStatus)) {
    throw AppError.badRequest(
      `Invalid status transition: cannot transition from ${currentStatus} to ${newStatus}`
    );
  }

  return updateTrip(tripId, { status: newStatus });
}

export async function archiveTrip(tripId: string): Promise<TripWithDetails> {
  return updateStatus(tripId, TripStatus.ARCHIVED);
}
