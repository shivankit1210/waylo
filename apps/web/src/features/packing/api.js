import { apiClient } from '@/lib/api';
// In-memory fallback mock for offline/demo resilience
const mockLists = {
    'trip-ladakh-2026': [
        {
            id: 'list-motorcycle-ladakh',
            tripId: 'trip-ladakh-2026',
            userId: 'demo-user-123',
            name: 'High-Altitude Riding & Camp Gear',
            description: 'Armored layers, thermal liners, toolkit roll, and cold-weather camping kit.',
            isTemplate: false,
            category: 'MOTORCYCLE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            items: [
                {
                    id: 'p-1',
                    listId: 'list-motorcycle-ladakh',
                    bagId: 'bag-tank',
                    name: 'DOT/ECE Full-Face Helmet with Anti-Fog Pinlock',
                    category: 'MOTORCYCLE_GEAR',
                    quantity: 1,
                    weightGrams: 1550,
                    status: 'PACKED',
                    isRequired: true,
                    isShared: false,
                    assignedTo: 'Lead Rider',
                    dayNumber: null,
                    notes: 'Visor cleaner in pouch',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: 'p-2',
                    listId: 'list-motorcycle-ladakh',
                    bagId: 'bag-saddle-left',
                    name: 'Armored Level 2 All-Weather Riding Jacket',
                    category: 'MOTORCYCLE_GEAR',
                    quantity: 1,
                    weightGrams: 2800,
                    status: 'WORN',
                    isRequired: true,
                    isShared: false,
                    assignedTo: null,
                    dayNumber: 1,
                    notes: 'Thermal and rain liners installed',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: 'p-3',
                    listId: 'list-motorcycle-ladakh',
                    bagId: 'bag-saddle-right',
                    name: 'Merino Wool Thermal Base Layer (Set of 2)',
                    category: 'WEATHER_LAYERS',
                    quantity: 2,
                    weightGrams: 420,
                    status: 'PACKED',
                    isRequired: true,
                    isShared: false,
                    assignedTo: null,
                    dayNumber: 2,
                    notes: 'Essential for Baralacha La pass summit',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: 'p-4',
                    listId: 'list-motorcycle-ladakh',
                    bagId: 'bag-tank',
                    name: 'Tubeless Tyre Repair Kit & Electric Air Inflator',
                    category: 'MISCELLANEOUS',
                    quantity: 1,
                    weightGrams: 850,
                    status: 'PACKED',
                    isRequired: true,
                    isShared: true,
                    assignedTo: null,
                    dayNumber: null,
                    notes: 'Keep in easily accessible tank bag',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: 'p-5',
                    listId: 'list-motorcycle-ladakh',
                    bagId: 'bag-tank',
                    name: 'Altitude Sickness Diamox, Painkillers & ORS',
                    category: 'MEDICINES',
                    quantity: 1,
                    weightGrams: 180,
                    status: 'NOT_PACKED',
                    isRequired: true,
                    isShared: true,
                    assignedTo: null,
                    dayNumber: null,
                    notes: 'Consult physician for dosage schedule',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: 'p-6',
                    listId: 'list-motorcycle-ladakh',
                    bagId: 'bag-saddle-left',
                    name: 'Action Camera Batteries & Lens Filters',
                    category: 'ELECTRONICS',
                    quantity: 3,
                    weightGrams: 240,
                    status: 'MISSING',
                    isRequired: false,
                    isShared: false,
                    assignedTo: null,
                    dayNumber: null,
                    notes: 'Needs to be bought before departure',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ],
            _count: {
                items: 6,
                packed: 2,
                missing: 1,
            },
        },
    ],
};
const mockBags = {
    'trip-ladakh-2026': [
        {
            id: 'bag-tank',
            tripId: 'trip-ladakh-2026',
            name: 'Magnetic Tank Bag (15L)',
            bagType: 'TANK_BAG',
            capacityLiters: 15,
            maxWeightKg: 5,
            color: 'Black / Orange',
            notes: 'Quick access items: documents, tyre kit, first aid',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: 'bag-saddle-left',
            tripId: 'trip-ladakh-2026',
            name: 'Left Waterproof Saddlebag (30L)',
            bagType: 'SADDLEBAGS',
            capacityLiters: 30,
            maxWeightKg: 12,
            color: 'Charcoal',
            notes: 'Clothing, rainwear, and spare footwear',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: 'bag-saddle-right',
            tripId: 'trip-ladakh-2026',
            name: 'Right Waterproof Saddlebag (30L)',
            bagType: 'SADDLEBAGS',
            capacityLiters: 30,
            maxWeightKg: 12,
            color: 'Charcoal',
            notes: 'Camping stove, tool roll, sleeping bag',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ],
};
// ─── Packing Lists ──────────────────────────────────────────
export async function getPackingLists(tripId) {
    try {
        const res = await apiClient.get(`/trips/${tripId}/packing`);
        if (res.data?.data) {
            mockLists[tripId] = res.data.data;
            return res.data.data;
        }
    }
    catch {
        // Fallback
    }
    return mockLists[tripId] || [];
}
export async function createPackingList(tripId, data) {
    try {
        const res = await apiClient.post(`/trips/${tripId}/packing`, data);
        if (res.data?.data) {
            if (!mockLists[tripId])
                mockLists[tripId] = [];
            mockLists[tripId].push(res.data.data);
            return res.data.data;
        }
    }
    catch {
        // Fallback
    }
    const newList = {
        id: `list-${Date.now()}`,
        tripId,
        userId: null,
        name: data.name,
        description: data.description || null,
        isTemplate: data.isTemplate ?? false,
        category: data.category || null,
        items: [],
        _count: { items: 0, packed: 0, missing: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    if (!mockLists[tripId])
        mockLists[tripId] = [];
    mockLists[tripId].push(newList);
    return newList;
}
export async function updatePackingList(tripId, listId, data) {
    try {
        const res = await apiClient.put(`/trips/${tripId}/packing/${listId}`, data);
        if (res.data?.data)
            return res.data.data;
    }
    catch {
        // Fallback
    }
    const list = mockLists[tripId]?.find((l) => l.id === listId);
    if (list) {
        Object.assign(list, data, { updatedAt: new Date().toISOString() });
        return list;
    }
    throw new Error('Packing list not found');
}
export async function deletePackingList(tripId, listId) {
    try {
        await apiClient.delete(`/trips/${tripId}/packing/${listId}`);
    }
    catch {
        // Fallback
    }
    if (mockLists[tripId]) {
        mockLists[tripId] = mockLists[tripId].filter((l) => l.id !== listId);
    }
    return { deleted: true };
}
export async function applyTemplate(tripId, templateKey, name) {
    try {
        const res = await apiClient.post(`/trips/${tripId}/packing/apply-template`, { templateKey, name });
        if (res.data?.data) {
            mockLists[tripId] = res.data.data;
            return res.data.data;
        }
    }
    catch {
        // Fallback
    }
    return getPackingLists(tripId);
}
// ─── Luggage Bags ───────────────────────────────────────────
export async function getLuggageBags(tripId) {
    try {
        const res = await apiClient.get(`/trips/${tripId}/packing/bags`);
        if (res.data?.data) {
            mockBags[tripId] = res.data.data;
            return res.data.data;
        }
    }
    catch {
        // Fallback
    }
    return mockBags[tripId] || [];
}
export async function createLuggageBag(tripId, data) {
    try {
        const res = await apiClient.post(`/trips/${tripId}/packing/bags`, data);
        if (res.data?.data)
            return res.data.data;
    }
    catch {
        // Fallback
    }
    const newBag = {
        id: `bag-${Date.now()}`,
        tripId,
        name: data.name,
        bagType: data.bagType,
        capacityLiters: data.capacityLiters || null,
        maxWeightKg: data.maxWeightKg || null,
        color: data.color || null,
        notes: data.notes || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    if (!mockBags[tripId])
        mockBags[tripId] = [];
    mockBags[tripId].push(newBag);
    return newBag;
}
export async function updateLuggageBag(tripId, bagId, data) {
    try {
        const res = await apiClient.put(`/trips/${tripId}/packing/bags/${bagId}`, data);
        if (res.data?.data)
            return res.data.data;
    }
    catch {
        // Fallback
    }
    const bag = mockBags[tripId]?.find((b) => b.id === bagId);
    if (bag) {
        Object.assign(bag, data, { updatedAt: new Date().toISOString() });
        return bag;
    }
    throw new Error('Luggage bag not found');
}
export async function deleteLuggageBag(tripId, bagId) {
    try {
        await apiClient.delete(`/trips/${tripId}/packing/bags/${bagId}`);
    }
    catch {
        // Fallback
    }
    if (mockBags[tripId]) {
        mockBags[tripId] = mockBags[tripId].filter((b) => b.id !== bagId);
    }
    return { deleted: true };
}
// ─── Items ──────────────────────────────────────────────────
export async function createPackingItem(tripId, listId, data) {
    try {
        const res = await apiClient.post(`/trips/${tripId}/packing/${listId}/items`, data);
        if (res.data?.data)
            return res.data.data;
    }
    catch {
        // Fallback
    }
    const newItem = {
        id: `item-${Date.now()}`,
        listId,
        bagId: data.bagId || null,
        name: data.name,
        category: data.category,
        quantity: data.quantity ?? 1,
        weightGrams: data.weightGrams || null,
        status: data.status ?? 'NOT_PACKED',
        isRequired: data.isRequired ?? true,
        isShared: data.isShared ?? false,
        assignedTo: data.assignedTo || null,
        dayNumber: data.dayNumber || null,
        notes: data.notes || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const list = mockLists[tripId]?.find((l) => l.id === listId);
    if (list) {
        list.items.push(newItem);
    }
    return newItem;
}
export async function updatePackingItem(tripId, itemId, data) {
    try {
        const res = await apiClient.put(`/trips/${tripId}/packing/items/${itemId}`, data);
        if (res.data?.data)
            return res.data.data;
    }
    catch {
        // Fallback
    }
    for (const list of mockLists[tripId] || []) {
        const it = list.items.find((i) => i.id === itemId);
        if (it) {
            Object.assign(it, data, { updatedAt: new Date().toISOString() });
            return it;
        }
    }
    throw new Error('Item not found');
}
export async function updateItemStatus(tripId, itemId, status) {
    try {
        const res = await apiClient.patch(`/trips/${tripId}/packing/items/${itemId}/status`, { status });
        if (res.data?.data)
            return res.data.data;
    }
    catch {
        // Fallback
    }
    for (const list of mockLists[tripId] || []) {
        const it = list.items.find((i) => i.id === itemId);
        if (it) {
            it.status = status;
            return it;
        }
    }
    throw new Error('Item not found');
}
export async function batchUpdateStatus(tripId, itemIds, status) {
    try {
        const res = await apiClient.post(`/trips/${tripId}/packing/items/batch-status`, { itemIds, status });
        if (res.data?.data)
            return res.data.data;
    }
    catch {
        // Fallback
    }
    const set = new Set(itemIds);
    for (const list of mockLists[tripId] || []) {
        for (const it of list.items) {
            if (set.has(it.id))
                it.status = status;
        }
    }
    return { updatedCount: itemIds.length, status };
}
export async function deletePackingItem(tripId, itemId) {
    try {
        await apiClient.delete(`/trips/${tripId}/packing/items/${itemId}`);
    }
    catch {
        // Fallback
    }
    for (const list of mockLists[tripId] || []) {
        list.items = list.items.filter((i) => i.id !== itemId);
    }
    return { deleted: true };
}
//# sourceMappingURL=api.js.map