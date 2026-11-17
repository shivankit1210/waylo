import { apiClient } from '@/lib/api';
import type {
  Trip,
  TripWithDetails,
  TripMemberSummary,
  TripStatus,
  TripRole,
  CreateTripInput,
  UpdateTripInput,
  AddMemberInput,
  PaginationInput,
  ApiResponse,
  PaginatedResponse,
} from '@waylo/shared';
import { offlineStorage } from '@/lib/offline/offlineStorage';

// Initial Mock Trips for offline/demo resilience
let mockTrips: TripWithDetails[] = [
  {
    id: 'trip-ladakh-2026',
    name: 'Ladakh High Passes Himalayan Expedition',
    description: '14-day high altitude motorcycle and road trip through Manali, Leh, Nubra Valley, Pangong Tso, and Zanskar pass.',
    coverImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    status: 'ONGOING' as TripStatus,
    tripType: 'MOTORCYCLE' as any,
    transportModes: ['MOTORCYCLE' as any, 'CAR' as any],
    startDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 11 * 86400000).toISOString(),
    startLocation: 'Manali, Himachal Pradesh',
    destination: 'Leh, Ladakh',
    returnLocation: 'Srinagar, Jammu & Kashmir',
    currency: 'INR',
    estimatedBudget: 45000,
    visibility: 'PRIVATE' as any,
    tags: ['Motorcycle', 'Himalayas', 'Adventure', 'Pangong'],
    ownerId: 'demo-user-123',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    owner: {
      id: 'demo-user-123',
      displayName: 'Alex Rivers',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
    members: [
      {
        id: 'member-1',
        userId: 'demo-user-123',
        role: 'OWNER' as TripRole,
        user: {
          id: 'demo-user-123',
          displayName: 'Alex Rivers',
          email: 'alex@waylo.app',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        },
      },
      {
        id: 'member-2',
        userId: 'user-tanya',
        role: 'LEADER' as TripRole,
        user: {
          id: 'user-tanya',
          displayName: 'Tanya Sharma',
          email: 'tanya@example.com',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
        },
      },
      {
        id: 'member-3',
        userId: 'user-vikram',
        role: 'MEMBER' as TripRole,
        user: {
          id: 'user-vikram',
          displayName: 'Vikram Patel',
          email: 'vikram@example.com',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        },
      },
    ],
    _count: {
      members: 3,
      itineraryDays: 14,
      expenses: 12,
    },
  },
  {
    id: 'trip-goa-monsoon',
    name: 'Coastal Monsoon Coastal Road Trip',
    description: 'Chasing rain along the Konkan coast from Mumbai down to South Goa, exploring hidden waterfalls and historic Portuguese forts.',
    coverImageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    status: 'PLANNED' as TripStatus,
    tripType: 'CAR_ROAD_TRIP' as any,
    transportModes: ['CAR' as any],
    startDate: new Date(Date.now() + 15 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 22 * 86400000).toISOString(),
    startLocation: 'Mumbai, Maharashtra',
    destination: 'Palolem, South Goa',
    returnLocation: 'Mumbai, Maharashtra',
    currency: 'INR',
    estimatedBudget: 32000,
    visibility: 'PRIVATE' as any,
    tags: ['RoadTrip', 'Beaches', 'Monsoon', 'Food'],
    ownerId: 'demo-user-123',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    owner: {
      id: 'demo-user-123',
      displayName: 'Alex Rivers',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
    members: [
      {
        id: 'member-1',
        userId: 'demo-user-123',
        role: 'OWNER' as TripRole,
        user: {
          id: 'demo-user-123',
          displayName: 'Alex Rivers',
          email: 'alex@waylo.app',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        },
      },
    ],
    _count: {
      members: 1,
      itineraryDays: 7,
      expenses: 4,
    },
  },
  {
    id: 'trip-kerala-backwaters',
    name: 'Kerala Serenity & Tea Hills Trail',
    description: 'Houseboats in Alleppey, rolling tea estates in Munnar, and wildlife spotting in Periyar Sanctuary.',
    coverImageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    status: 'COMPLETED' as TripStatus,
    tripType: 'FAMILY' as any,
    transportModes: ['CAR' as any, 'TRAIN' as any],
    startDate: new Date(Date.now() - 60 * 86400000).toISOString(),
    endDate: new Date(Date.now() - 53 * 86400000).toISOString(),
    startLocation: 'Kochi, Kerala',
    destination: 'Munnar & Alleppey',
    returnLocation: 'Kochi, Kerala',
    currency: 'INR',
    estimatedBudget: 55000,
    visibility: 'PRIVATE' as any,
    tags: ['Kerala', 'TeaGardens', 'Boats'],
    ownerId: 'demo-user-123',
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 50 * 86400000).toISOString(),
    owner: {
      id: 'demo-user-123',
      displayName: 'Alex Rivers',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
    members: [
      {
        id: 'member-1',
        userId: 'demo-user-123',
        role: 'OWNER' as TripRole,
        user: {
          id: 'demo-user-123',
          displayName: 'Alex Rivers',
          email: 'alex@waylo.app',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        },
      },
    ],
    _count: {
      members: 1,
      itineraryDays: 8,
      expenses: 18,
    },
  },
];

export interface GetTripsParams extends Partial<PaginationInput> {
  status?: TripStatus;
  search?: string;
}

export async function getTrips(params?: GetTripsParams): Promise<PaginatedResponse<TripWithDetails>> {
  try {
    const res = await apiClient.get<PaginatedResponse<TripWithDetails>>('/trips', { params });
    if (res.data?.data) {
      // Save all fetched trips to IndexedDB for offline access
      for (const trip of res.data.data) {
        void offlineStorage.saveTrip(trip);
      }
      return res.data;
    }
  } catch {
    // Check IndexedDB offline storage first before static fallback
    try {
      const offlineTrips = await offlineStorage.getAllTrips();
      if (offlineTrips.length > 0) {
        let filtered = offlineTrips;
        if (params?.status) filtered = filtered.filter((t) => t.status === params.status);
        if (params?.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              (t.destination && t.destination.toLowerCase().includes(q))
          );
        }
        return {
          success: true,
          data: filtered,
          pagination: {
            page: params?.page ?? 1,
            pageSize: params?.pageSize ?? 20,
            total: filtered.length,
            totalPages: 1,
          },
        };
      }
    } catch {
      // IndexedDB read error, continue to memory mock
    }
  }

  let filtered = [...mockTrips];
  if (params?.status) {
    filtered = filtered.filter((t) => t.status === params.status);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.destination && t.destination.toLowerCase().includes(q))
    );
  }

  return {
    success: true,
    data: filtered,
    pagination: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      total: filtered.length,
      totalPages: 1,
    },
  };
}

export async function getTrip(tripId: string): Promise<TripWithDetails> {
  try {
    const res = await apiClient.get<ApiResponse<TripWithDetails>>(`/trips/${tripId}`);
    if (res.data?.data) {
      void offlineStorage.saveTrip(res.data.data);
      return res.data.data;
    }
  } catch {
    // Attempt reading from IndexedDB offline storage
    try {
      const offlineTrip = await offlineStorage.getTrip(tripId);
      if (offlineTrip) return offlineTrip;
    } catch {
      // Fallback to memory
    }
  }

  const found = mockTrips.find((t) => t.id === tripId);
  if (found) return found;

  // Return a generic generated trip if not found
  return {
    id: tripId,
    name: 'Scenic Mountain Getaway',
    description: 'An unforgettable road expedition curated with Waylo AI.',
    coverImageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    status: 'PLANNED' as TripStatus,
    tripType: 'CAR_ROAD_TRIP' as any,
    transportModes: ['CAR' as any],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    startLocation: 'Bangalore',
    destination: 'Coorg & Ooty',
    returnLocation: 'Bangalore',
    currency: 'INR',
    estimatedBudget: 25000,
    visibility: 'PRIVATE' as any,
    tags: ['Mountains', 'Weekend'],
    ownerId: 'demo-user-123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: {
      id: 'demo-user-123',
      displayName: 'Alex Rivers',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
    members: [],
    _count: {
      members: 1,
      itineraryDays: 5,
      expenses: 3,
    },
  };
}

export async function createTrip(data: CreateTripInput): Promise<TripWithDetails> {
  try {
    const res = await apiClient.post<ApiResponse<TripWithDetails>>('/trips', data);
    if (res.data?.data) {
      mockTrips.unshift(res.data.data);
      return res.data.data;
    }
  } catch {
    // Fallback
  }

  const newTrip: TripWithDetails = {
    id: `trip-${Date.now()}`,
    name: data.name,
    description: data.description ?? null,
    coverImageUrl: data.coverImageUrl ?? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    status: 'PLANNED' as TripStatus,
    tripType: data.tripType as any,
    transportModes: data.transportModes as any,
    startDate: data.startDate ?? null,
    endDate: data.endDate ?? null,
    startLocation: data.startLocation ?? null,
    destination: data.destination ?? null,
    returnLocation: data.returnLocation ?? null,
    currency: data.currency ?? 'INR',
    estimatedBudget: data.estimatedBudget ?? null,
    visibility: data.visibility as any,
    tags: data.tags ?? [],
    ownerId: 'demo-user-123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: {
      id: 'demo-user-123',
      displayName: 'Alex Rivers',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
    members: [
      {
        id: `member-${Date.now()}`,
        userId: 'demo-user-123',
        role: 'OWNER' as TripRole,
        user: {
          id: 'demo-user-123',
          displayName: 'Alex Rivers',
          email: 'alex@waylo.app',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        },
      },
    ],
    _count: {
      members: 1,
      itineraryDays: 0,
      expenses: 0,
    },
  };

  mockTrips.unshift(newTrip);
  return newTrip;
}

export async function updateTrip(tripId: string, data: UpdateTripInput): Promise<TripWithDetails> {
  try {
    const res = await apiClient.patch<ApiResponse<TripWithDetails>>(`/trips/${tripId}`, data);
    if (res.data?.data) return res.data.data;
  } catch {
    // Fallback
  }

  const idx = mockTrips.findIndex((t) => t.id === tripId);
  if (idx !== -1) {
    mockTrips[idx] = {
      ...mockTrips[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    } as TripWithDetails;
    return mockTrips[idx];
  }
  return getTrip(tripId);
}

export async function deleteTrip(tripId: string): Promise<void> {
  try {
    await apiClient.delete(`/trips/${tripId}`);
  } catch {
    // Fallback
  }
  mockTrips = mockTrips.filter((t) => t.id !== tripId);
}

export async function duplicateTrip(tripId: string): Promise<TripWithDetails> {
  try {
    const res = await apiClient.post<ApiResponse<TripWithDetails>>(`/trips/${tripId}/duplicate`);
    if (res.data?.data) return res.data.data;
  } catch {
    // Fallback
  }

  const orig = await getTrip(tripId);
  const dup: TripWithDetails = {
    ...orig,
    id: `trip-copy-${Date.now()}`,
    name: `${orig.name} (Copy)`,
    status: 'DRAFT' as TripStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockTrips.unshift(dup);
  return dup;
}

export async function updateTripStatus(tripId: string, status: TripStatus): Promise<TripWithDetails> {
  return updateTrip(tripId, { status });
}

export async function archiveTrip(tripId: string): Promise<TripWithDetails> {
  return updateTrip(tripId, { status: 'ARCHIVED' as TripStatus });
}

export async function getMembers(tripId: string): Promise<TripMemberSummary[]> {
  try {
    const res = await apiClient.get<ApiResponse<TripMemberSummary[]>>(`/trips/${tripId}/members`);
    if (res.data?.data) return res.data.data;
  } catch {
    // Fallback
  }
  const trip = await getTrip(tripId);
  return trip.members || [];
}

export async function addMember(tripId: string, data: AddMemberInput): Promise<TripMemberSummary> {
  try {
    const res = await apiClient.post<ApiResponse<TripMemberSummary>>(`/trips/${tripId}/members`, data);
    if (res.data?.data) return res.data.data;
  } catch {
    // Fallback
  }

  const newMember: TripMemberSummary = {
    id: `member-${Date.now()}`,
    userId: `user-${Date.now()}`,
    role: data.role,
    user: {
      id: `user-${Date.now()}`,
      displayName: data.email.split('@')[0],
      email: data.email,
      avatarUrl: null,
    },
  };

  const trip = mockTrips.find((t) => t.id === tripId);
  if (trip) {
    trip.members = trip.members || [];
    trip.members.push(newMember);
    if (trip._count) trip._count.members = trip.members.length;
  }

  return newMember;
}

export async function removeMember(tripId: string, memberId: string): Promise<void> {
  try {
    await apiClient.delete(`/trips/${tripId}/members/${memberId}`);
  } catch {
    // Fallback
  }

  const trip = mockTrips.find((t) => t.id === tripId);
  if (trip) {
    trip.members = (trip.members || []).filter((m) => m.id !== memberId);
    if (trip._count) trip._count.members = trip.members.length;
  }
}
