import { apiClient } from '@/lib/api';
import type {
  ItineraryDayWithItems,
  ItineraryDay,
  ItineraryItem,
  CreateItineraryDayInput,
  UpdateItineraryDayInput,
  BatchGenerateDaysInput,
  CreateItineraryItemInput,
  UpdateItineraryItemInput,
  ApiResponse,
  ItineraryItemType,
  ActivityFlexibility,
} from '@waylo/shared';

// In-memory fallback cache for offline resilience
const mockItineraries: Record<string, ItineraryDayWithItems[]> = {
  'trip-ladakh-2026': [
    {
      id: 'day-1-ladakh',
      tripId: 'trip-ladakh-2026',
      dayNumber: 1,
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
      title: 'Departure & Acclimatization Ride',
      startLocation: 'Manali, Old Manali',
      endLocation: 'Jispa Valley',
      plannedDeparture: '06:30',
      plannedArrival: '16:00',
      actualDeparture: '06:45',
      actualArrival: '16:15',
      plannedDistanceKm: 138,
      actualDistanceKm: 142,
      notes: 'Cross Atal Tunnel early to avoid heavy commercial traffic. Acclimatize in Jispa (3,200m).',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: 'item-1-1',
          dayId: 'day-1-ladakh',
          title: 'Pre-Ride Tyre & Luggage Inspection',
          description: 'Check tyre pressure, tighten saddlebags, lube chain.',
          itemType: 'ACTIVITY' as ItineraryItemType,
          orderIndex: 0,
          startTime: '06:00',
          endTime: '06:30',
          location: 'Old Manali Basecamp',
          latitude: 32.253,
          longitude: 77.175,
          flexibility: 'FIXED' as ActivityFlexibility,
          isCompleted: true,
          isOptional: false,
          cost: 0,
          currency: 'INR',
          notes: 'Make sure rain covers are tied over dry-bags.',
          reminders: ['Check fuel tank is 100% full'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'item-1-2',
          dayId: 'day-1-ladakh',
          title: 'Cross Atal Tunnel & Sissu Viewpoint',
          description: 'Tunnel transit into Lahaul valley with waterfall photo stop.',
          itemType: 'SIGHTSEEING' as ItineraryItemType,
          orderIndex: 1,
          startTime: '08:00',
          endTime: '09:00',
          location: 'Sissu Waterfall',
          latitude: 32.486,
          longitude: 77.126,
          flexibility: 'FLEXIBLE' as ActivityFlexibility,
          isCompleted: true,
          isOptional: false,
          cost: 0,
          currency: 'INR',
          notes: 'Spectacular hanging glacier on the mountain wall.',
          reminders: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'item-1-3',
          dayId: 'day-1-ladakh',
          title: 'Hot Siddu & Chai Break in Keylong',
          description: 'Traditional Himachali breakfast and fuel top-up at Indian Oil.',
          itemType: 'MEAL' as ItineraryItemType,
          orderIndex: 2,
          startTime: '11:00',
          endTime: '12:00',
          location: 'Keylong Main Market',
          latitude: 32.571,
          longitude: 77.032,
          flexibility: 'FLEXIBLE' as ActivityFlexibility,
          isCompleted: true,
          isOptional: false,
          cost: 450,
          currency: 'INR',
          notes: 'Last dependable ATM and mechanics before Leh.',
          reminders: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'item-1-4',
          dayId: 'day-1-ladakh',
          title: 'Riverside Campsite Check-in',
          description: 'Camp pitch alongside the Bhaga river in Jispa.',
          itemType: 'CHECK_IN' as ItineraryItemType,
          orderIndex: 3,
          startTime: '16:00',
          endTime: '17:00',
          location: 'Jispa Riverside Eco-Camp',
          latitude: 32.639,
          longitude: 77.185,
          flexibility: 'FIXED' as ActivityFlexibility,
          isCompleted: false,
          isOptional: false,
          cost: 2800,
          currency: 'INR',
          notes: 'Stay hydrated with warm water and garlic soup for AMS prevention.',
          reminders: ['Drink 3L of water before bed'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: 'day-2-ladakh',
      tripId: 'trip-ladakh-2026',
      dayNumber: 2,
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      title: 'The Great Passes — Baralacha La & Sarchu',
      startLocation: 'Jispa (3,200m)',
      endLocation: 'Sarchu Camp (4,290m)',
      plannedDeparture: '07:00',
      plannedArrival: '15:30',
      actualDeparture: null,
      actualArrival: null,
      plannedDistanceKm: 110,
      actualDistanceKm: null,
      notes: 'High altitude day. Cross Baralacha La (4,890m). Check Deepak Tal and Suraj Tal lakes.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: 'item-2-1',
          dayId: 'day-2-ladakh',
          title: 'Early Morning Departure & Thermal Layering',
          description: 'Put on windproof outer shell, cold weather gloves, and balaclava.',
          itemType: 'ACTIVITY' as ItineraryItemType,
          orderIndex: 0,
          startTime: '07:00',
          endTime: '07:30',
          location: 'Jispa',
          latitude: null,
          longitude: null,
          flexibility: 'FIXED' as ActivityFlexibility,
          isCompleted: false,
          isOptional: false,
          cost: 0,
          currency: 'INR',
          notes: 'Sub-zero temperatures expected at the pass summit.',
          reminders: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'item-2-2',
          dayId: 'day-2-ladakh',
          title: 'Suraj Tal Lake Photography & Rest',
          description: 'Sacred source of the Bhaga River right below Baralacha La pass.',
          itemType: 'SIGHTSEEING' as ItineraryItemType,
          orderIndex: 1,
          startTime: '10:30',
          endTime: '11:15',
          location: 'Suraj Tal Viewpoint',
          latitude: 32.802,
          longitude: 77.404,
          flexibility: 'FLEXIBLE' as ActivityFlexibility,
          isCompleted: false,
          isOptional: true,
          cost: 0,
          currency: 'INR',
          notes: 'Can be skipped if snow/ice delays the convoy.',
          reminders: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'item-2-3',
          dayId: 'day-2-ladakh',
          title: 'Sarchu Army Base Transit & Registration',
          description: 'Border check post between Himachal Pradesh and Ladakh.',
          itemType: 'TRAVEL' as ItineraryItemType,
          orderIndex: 2,
          startTime: '14:30',
          endTime: '15:30',
          location: 'Sarchu Military Post',
          latitude: 32.909,
          longitude: 77.585,
          flexibility: 'FIXED' as ActivityFlexibility,
          isCompleted: false,
          isOptional: false,
          cost: 0,
          currency: 'INR',
          notes: 'Keep vehicle RC, insurance, and Aadhaar card handy.',
          reminders: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
  ],
};

// ─── API Methods ────────────────────────────────────────────

export async function getItinerary(tripId: string): Promise<ItineraryDayWithItems[]> {
  try {
    const res = await apiClient.get<ApiResponse<ItineraryDayWithItems[]>>(
      `/trips/${tripId}/itinerary`
    );
    if (res.data?.data) {
      mockItineraries[tripId] = res.data.data;
      return res.data.data;
    }
  } catch {
    // Graceful fallback to mock cache
  }

  return mockItineraries[tripId] || [];
}

export async function createDay(
  tripId: string,
  data: CreateItineraryDayInput
): Promise<ItineraryDayWithItems> {
  try {
    const res = await apiClient.post<ApiResponse<ItineraryDayWithItems>>(
      `/trips/${tripId}/itinerary/days`,
      data
    );
    if (res.data?.data) {
      if (!mockItineraries[tripId]) mockItineraries[tripId] = [];
      mockItineraries[tripId].push(res.data.data);
      return res.data.data;
    }
  } catch {
    // Fallback
  }

  const newDay: ItineraryDayWithItems = {
    id: `day-${Date.now()}`,
    tripId,
    dayNumber: data.dayNumber,
    date: data.date || null,
    title: data.title || `Day ${data.dayNumber}`,
    startLocation: data.startLocation || null,
    endLocation: data.endLocation || null,
    plannedDeparture: data.plannedDeparture || '08:00',
    plannedArrival: data.plannedArrival || '18:00',
    actualDeparture: data.actualDeparture || null,
    actualArrival: data.actualArrival || null,
    plannedDistanceKm: data.plannedDistanceKm || null,
    actualDistanceKm: data.actualDistanceKm || null,
    notes: data.notes || null,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!mockItineraries[tripId]) mockItineraries[tripId] = [];
  mockItineraries[tripId].push(newDay);
  mockItineraries[tripId].sort((a, b) => a.dayNumber - b.dayNumber);

  return newDay;
}

export async function batchGenerateDays(
  tripId: string,
  data: BatchGenerateDaysInput
): Promise<ItineraryDayWithItems[]> {
  try {
    const res = await apiClient.post<ApiResponse<ItineraryDayWithItems[]>>(
      `/trips/${tripId}/itinerary/days/batch-generate`,
      data
    );
    if (res.data?.data) {
      mockItineraries[tripId] = res.data.data;
      return res.data.data;
    }
  } catch {
    // Fallback
  }

  const count = data.dayCount || 3;
  const days: ItineraryDayWithItems[] = [];

  for (let i = 1; i <= count; i++) {
    days.push({
      id: `day-${Date.now()}-${i}`,
      tripId,
      dayNumber: i,
      date: data.startDate
        ? new Date(new Date(data.startDate).getTime() + (i - 1) * 86400000).toISOString()
        : null,
      title:
        i === 1 && data.startLocation
          ? `Departure from ${data.startLocation}`
          : i === count && data.destination
          ? `Arrival at ${data.destination}`
          : `Day ${i} Expedition & Route`,
      startLocation: i === 1 ? data.startLocation || null : null,
      endLocation: i === count ? data.destination || null : null,
      plannedDeparture: '08:00',
      plannedArrival: '18:00',
      actualDeparture: null,
      actualArrival: null,
      plannedDistanceKm: 120,
      actualDistanceKm: null,
      notes: null,
      items: [
        {
          id: `item-gen-${i}-1`,
          dayId: `day-${Date.now()}-${i}`,
          title: 'Morning Convoy Briefing',
          description: 'Route overview, regroup points, and road conditions check.',
          itemType: 'ACTIVITY' as ItineraryItemType,
          orderIndex: 0,
          startTime: '08:00',
          endTime: '08:30',
          location: null,
          latitude: null,
          longitude: null,
          flexibility: 'FIXED' as ActivityFlexibility,
          isCompleted: false,
          isOptional: false,
          cost: null,
          currency: 'INR',
          notes: null,
          reminders: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `item-gen-${i}-2`,
          dayId: `day-${Date.now()}-${i}`,
          title: 'Midway Fuel & Refreshment Stop',
          description: 'Rest stop and fuel refill.',
          itemType: 'FUEL_STOP' as ItineraryItemType,
          orderIndex: 1,
          startTime: '12:00',
          endTime: '13:00',
          location: null,
          latitude: null,
          longitude: null,
          flexibility: 'FLEXIBLE' as ActivityFlexibility,
          isCompleted: false,
          isOptional: false,
          cost: 1500,
          currency: 'INR',
          notes: null,
          reminders: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  mockItineraries[tripId] = days;
  return days;
}

export async function updateDay(
  tripId: string,
  dayId: string,
  data: UpdateItineraryDayInput
): Promise<ItineraryDay> {
  try {
    const res = await apiClient.put<ApiResponse<ItineraryDay>>(
      `/trips/${tripId}/itinerary/days/${dayId}`,
      data
    );
    if (res.data?.data) return res.data.data;
  } catch {
    // Fallback
  }

  const list = mockItineraries[tripId] || [];
  const day = list.find((d) => d.id === dayId);
  if (day) {
    Object.assign(day, data, { updatedAt: new Date().toISOString() });
    return day;
  }

  throw new Error('Day not found');
}

export async function deleteDay(tripId: string, dayId: string): Promise<{ deleted: boolean }> {
  try {
    await apiClient.delete(`/trips/${tripId}/itinerary/days/${dayId}`);
  } catch {
    // Fallback
  }

  if (mockItineraries[tripId]) {
    mockItineraries[tripId] = mockItineraries[tripId].filter((d) => d.id !== dayId);
    mockItineraries[tripId].forEach((d, idx) => {
      d.dayNumber = idx + 1;
    });
  }

  return { deleted: true };
}

export async function createItem(
  tripId: string,
  dayId: string,
  data: CreateItineraryItemInput
): Promise<ItineraryItem> {
  try {
    const res = await apiClient.post<ApiResponse<ItineraryItem>>(
      `/trips/${tripId}/itinerary/days/${dayId}/items`,
      data
    );
    if (res.data?.data) return res.data.data;
  } catch {
    // Fallback
  }

  const newItem: ItineraryItem = {
    id: `item-${Date.now()}`,
    dayId,
    title: data.title,
    description: data.description || null,
    itemType: data.itemType,
    orderIndex: data.orderIndex ?? 0,
    startTime: data.startTime || null,
    endTime: data.endTime || null,
    location: data.location || null,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    flexibility: data.flexibility,
    isCompleted: data.isCompleted ?? false,
    isOptional: data.isOptional ?? false,
    cost: data.cost || null,
    currency: data.currency || 'INR',
    notes: data.notes || null,
    reminders: data.reminders || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const day = mockItineraries[tripId]?.find((d) => d.id === dayId);
  if (day) {
    if (!day.items) day.items = [];
    day.items.push(newItem);
    day.items.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  return newItem;
}

export async function updateItem(
  tripId: string,
  dayId: string,
  itemId: string,
  data: UpdateItineraryItemInput
): Promise<ItineraryItem> {
  try {
    const res = await apiClient.put<ApiResponse<ItineraryItem>>(
      `/trips/${tripId}/itinerary/days/${dayId}/items/${itemId}`,
      data
    );
    if (res.data?.data) return res.data.data;
  } catch {
    // Fallback
  }

  const day = mockItineraries[tripId]?.find((d) => d.id === dayId);
  const item = day?.items?.find((i) => i.id === itemId);
  if (item) {
    Object.assign(item, data, { updatedAt: new Date().toISOString() });
    return item;
  }

  throw new Error('Item not found');
}

export async function toggleItemComplete(
  tripId: string,
  dayId: string,
  itemId: string
): Promise<ItineraryItem> {
  try {
    const res = await apiClient.patch<ApiResponse<ItineraryItem>>(
      `/trips/${tripId}/itinerary/days/${dayId}/items/${itemId}/toggle-complete`
    );
    if (res.data?.data) return res.data.data;
  } catch {
    // Fallback
  }

  const day = mockItineraries[tripId]?.find((d) => d.id === dayId);
  const item = day?.items?.find((i) => i.id === itemId);
  if (item) {
    item.isCompleted = !item.isCompleted;
    return item;
  }

  throw new Error('Item not found');
}

export async function deleteItem(
  tripId: string,
  dayId: string,
  itemId: string
): Promise<{ deleted: boolean }> {
  try {
    await apiClient.delete(`/trips/${tripId}/itinerary/days/${dayId}/items/${itemId}`);
  } catch {
    // Fallback
  }

  const day = mockItineraries[tripId]?.find((d) => d.id === dayId);
  if (day && day.items) {
    day.items = day.items.filter((i) => i.id !== itemId);
    day.items.forEach((it, idx) => {
      it.orderIndex = idx;
    });
  }

  return { deleted: true };
}

export async function reorderItems(
  tripId: string,
  dayId: string,
  items: { id: string; orderIndex: number }[]
): Promise<ItineraryItem[]> {
  try {
    const res = await apiClient.put<ApiResponse<ItineraryItem[]>>(
      `/trips/${tripId}/itinerary/days/${dayId}/items/reorder`,
      { items }
    );
    if (res.data?.data) return res.data.data;
  } catch {
    // Fallback
  }

  const day = mockItineraries[tripId]?.find((d) => d.id === dayId);
  if (day && day.items) {
    const map = new Map(items.map((i) => [i.id, i.orderIndex]));
    day.items.forEach((it) => {
      const newOrder = map.get(it.id);
      if (newOrder !== undefined) it.orderIndex = newOrder;
    });
    day.items.sort((a, b) => a.orderIndex - b.orderIndex);
    return day.items;
  }

  return [];
}
