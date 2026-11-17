import { apiClient } from '@/lib/api';
// In-memory fallback data for offline resilience and demonstration
let mockJournalEntries = {
    'trip-ladakh-2026': [
        {
            id: 'entry-1',
            tripId: 'trip-ladakh-2026',
            authorId: 'demo-user-123',
            dayNumber: 2,
            title: 'Conquering Rohtang Pass in Dense Fog',
            content: 'Left Manali early at 5:30 AM before tourist cabs flooded the switchbacks. The mist cleared suddenly at 13,050 ft to reveal snow-capped peaks of the Pir Panjal range. Freezing temperatures but spirits flying high!',
            location: 'Rohtang La, Himachal Pradesh',
            mood: 'ADVENTUROUS',
            weatherNote: '5°C, Chilly mist & clear skies atop pass',
            mediaUrls: [
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
            ],
            createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            author: {
                id: 'demo-user-123',
                displayName: 'Alex Rivers',
                email: 'alex@waylo.app',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
            },
        },
        {
            id: 'entry-2',
            tripId: 'trip-ladakh-2026',
            authorId: 'demo-user-123',
            dayNumber: 5,
            title: 'Sunset over Pangong Tso: The Changing Blues',
            content: 'Witnessing the lake shift from cobalt to turquoise and finally deep emerald as the sun dipped behind the jagged peaks. Pure silence except for the Himalayan breeze rippling across the water.',
            location: 'Spangmik, Pangong Tso',
            mood: 'PEACEFUL',
            weatherNote: '-1°C, Crisp starlit night',
            mediaUrls: [
                'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
            ],
            createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
            author: {
                id: 'demo-user-123',
                displayName: 'Alex Rivers',
                email: 'alex@waylo.app',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
            },
        },
    ],
};
let mockHighlights = {
    'trip-ladakh-2026': [
        {
            id: 'hl-1',
            tripId: 'trip-ladakh-2026',
            title: 'Khardung La Summit (17,982 ft)',
            description: 'One of the highest motorable passes on Earth conquered on two wheels with zero breakdowns.',
            category: 'EPIC_RIDE',
            location: 'Khardung La, Ladakh',
            rating: 5,
            photoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: 'hl-2',
            tripId: 'trip-ladakh-2026',
            title: 'Campfire under Milky Way in Nubra Valley',
            description: 'Hot butter tea, apricot jams, and counting shooting stars next to the double-humped camel dunes.',
            category: 'SUNSET',
            location: 'Hunder Sand Dunes',
            rating: 5,
            photoUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ],
};
// ─── API Client Methods ───────────────────────────────────────
export async function getJournalEntries(tripId) {
    try {
        const res = await apiClient.get(`/trips/${tripId}/journal/entries`);
        if (res.data?.data)
            return res.data.data;
    }
    catch {
        // Fallback
    }
    return mockJournalEntries[tripId] || [];
}
export async function createJournalEntry(tripId, data) {
    try {
        const res = await apiClient.post(`/trips/${tripId}/journal/entries`, data);
        if (res.data?.data)
            return res.data.data;
    }
    catch {
        // Fallback
    }
    const newEntry = {
        id: `entry-${Date.now()}`,
        tripId,
        authorId: 'demo-user-123',
        dayNumber: data.dayNumber ?? null,
        title: data.title,
        content: data.content,
        location: data.location ?? null,
        mood: data.mood ?? null,
        weatherNote: data.weatherNote ?? null,
        mediaUrls: data.mediaUrls || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
            id: 'demo-user-123',
            displayName: 'Alex Rivers',
            email: 'alex@waylo.app',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        },
    };
    if (!mockJournalEntries[tripId])
        mockJournalEntries[tripId] = [];
    mockJournalEntries[tripId].unshift(newEntry);
    return newEntry;
}
export async function updateJournalEntry(tripId, entryId, data) {
    try {
        const res = await apiClient.patch(`/trips/${tripId}/journal/entries/${entryId}`, data);
        if (res.data?.data)
            return res.data.data;
    }
    catch {
        // Fallback
    }
    const list = mockJournalEntries[tripId] || [];
    const idx = list.findIndex((e) => e.id === entryId);
    if (idx !== -1) {
        list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
        return list[idx];
    }
    throw new Error('Entry not found');
}
export async function deleteJournalEntry(tripId, entryId) {
    try {
        await apiClient.delete(`/trips/${tripId}/journal/entries/${entryId}`);
    }
    catch {
        // Fallback
    }
    if (mockJournalEntries[tripId]) {
        mockJournalEntries[tripId] = mockJournalEntries[tripId].filter((e) => e.id !== entryId);
    }
}
// ─── Highlights ───────────────────────────────────────────────
export async function getTripHighlights(tripId) {
    try {
        const res = await apiClient.get(`/trips/${tripId}/journal/highlights`);
        if (res.data?.data)
            return res.data.data;
    }
    catch {
        // Fallback
    }
    return mockHighlights[tripId] || [];
}
export async function createTripHighlight(tripId, data) {
    try {
        const res = await apiClient.post(`/trips/${tripId}/journal/highlights`, data);
        if (res.data?.data)
            return res.data.data;
    }
    catch {
        // Fallback
    }
    const newHighlight = {
        id: `hl-${Date.now()}`,
        tripId,
        title: data.title,
        description: data.description ?? null,
        category: data.category,
        location: data.location ?? null,
        rating: data.rating ?? 5,
        photoUrl: data.photoUrl ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    if (!mockHighlights[tripId])
        mockHighlights[tripId] = [];
    mockHighlights[tripId].unshift(newHighlight);
    return newHighlight;
}
export async function deleteTripHighlight(tripId, highlightId) {
    try {
        await apiClient.delete(`/trips/${tripId}/journal/highlights/${highlightId}`);
    }
    catch {
        // Fallback
    }
    if (mockHighlights[tripId]) {
        mockHighlights[tripId] = mockHighlights[tripId].filter((h) => h.id !== highlightId);
    }
}
// ─── Analytics ────────────────────────────────────────────────
export async function getTripAnalytics(tripId) {
    try {
        const res = await apiClient.get(`/trips/${tripId}/journal/analytics`);
        if (res.data?.data)
            return res.data.data;
    }
    catch {
        // Fallback
    }
    // Realistic mock analytics for offline / development
    return {
        tripId,
        tripName: 'Ladakh High Passes Himalayan Expedition',
        totalDays: 14,
        totalDistancePlannedKm: 1480,
        totalDistanceLoggedKm: 1540,
        stopsCount: {
            total: 28,
            completed: 19,
            remaining: 9,
        },
        expenses: {
            totalSpent: 3850000, // 38,500 INR in paise/cents
            budgetEstimated: 4500000,
            budgetVariance: 650000,
            currency: 'INR',
            averagePerDay: 275000,
            averagePerPerson: 1283300,
            costPerKm: 25.0,
            categoryBreakdown: [
                { category: 'FUEL', amount: 1450000, percentage: 38, count: 6 },
                { category: 'ACCOMMODATION', amount: 1300000, percentage: 34, count: 4 },
                { category: 'FOOD', amount: 720000, percentage: 19, count: 12 },
                { category: 'TOLLS', amount: 180000, percentage: 5, count: 3 },
                { category: 'MISCELLANEOUS', amount: 200000, percentage: 4, count: 2 },
            ],
        },
        fuelAnalytics: {
            totalFuelLiters: 142.5,
            totalFuelCost: 1450000,
            averageKmPerLiter: 10.8,
            logsCount: 6,
        },
        crewStats: {
            totalMembers: 3,
            journalEntriesCount: mockJournalEntries[tripId]?.length || 2,
            highlightsCount: mockHighlights[tripId]?.length || 2,
            packingCompletionPercentage: 92,
        },
    };
}
//# sourceMappingURL=api.js.map