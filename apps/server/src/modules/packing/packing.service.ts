import { prisma } from '../../config/database.js';
import { AppError } from '../../utils/errors.js';
import type {
  CreatePackingListInput,
  UpdatePackingListInput,
  CreateLuggageBagInput,
  UpdateLuggageBagInput,
  CreatePackingItemInput,
  UpdatePackingItemInput,
  PackingStatus,
  PackingCategory,
  LuggageBagType,
} from '@waylo/shared';

// ─── Default Pre-built Templates ────────────────────────────
export const PREBUILT_TEMPLATES: Record<
  string,
  {
    name: string;
    description: string;
    category: string;
    items: Array<{
      name: string;
      category: PackingCategory;
      quantity: number;
      isRequired: boolean;
      isShared: boolean;
      notes?: string;
    }>;
  }
> = {
  MOTORCYCLE_EXPEDITION: {
    name: 'Motorcycle Touring Expedition',
    description: 'Essential riding safety gear, weather armor, toolkits, and camp essentials.',
    category: 'MOTORCYCLE',
    items: [
      { name: 'DOT/ECE Full-face Helmet with Pinlock', category: 'MOTORCYCLE_GEAR' as PackingCategory, quantity: 1, isRequired: true, isShared: false, notes: 'Clean visor before departure' },
      { name: 'All-Weather Riding Jacket (Armored L2)', category: 'MOTORCYCLE_GEAR' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Abrasion-Resistant Riding Pants with Knee Armor', category: 'MOTORCYCLE_GEAR' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Gauntlet Touring Gloves + Rain Overgloves', category: 'MOTORCYCLE_GEAR' as PackingCategory, quantity: 2, isRequired: true, isShared: false },
      { name: 'Waterproof Touring Boots', category: 'MOTORCYCLE_GEAR' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Two-Piece High-Vis Rain Suit', category: 'WEATHER_LAYERS' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Thermal Base Layer (Top & Bottom)', category: 'WEATHER_LAYERS' as PackingCategory, quantity: 2, isRequired: false, isShared: false },
      { name: 'Chain Lube & Cleaner Spray', category: 'MISCELLANEOUS' as PackingCategory, quantity: 1, isRequired: true, isShared: true, notes: 'Lube chain every 500km' },
      { name: 'Tubeless Tyre Puncture Repair Kit & Inflator', category: 'MISCELLANEOUS' as PackingCategory, quantity: 1, isRequired: true, isShared: true },
      { name: 'Multi-tool & Metric Hex Key Set', category: 'MISCELLANEOUS' as PackingCategory, quantity: 1, isRequired: true, isShared: true },
      { name: 'Bungee Cords & Heavy-Duty ROK Straps', category: 'MISCELLANEOUS' as PackingCategory, quantity: 4, isRequired: true, isShared: false },
      { name: '20,000mAh Rugged Fast-Charge Power Bank', category: 'ELECTRONICS' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Motorcycle RAM Phone Mount with Vibration Dampener', category: 'ELECTRONICS' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'First Aid Kit (Bandages, Betadine, Painkillers, ORS)', category: 'MEDICINES' as PackingCategory, quantity: 1, isRequired: true, isShared: true },
      { name: 'Original Vehicle RC, Insurance & PUC Hardcopies', category: 'DOCUMENTS' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Hydration Bladder (2 Liters)', category: 'FOOD_WATER' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Microfiber Towel & Dry Bags', category: 'TOILETRIES' as PackingCategory, quantity: 2, isRequired: false, isShared: false },
    ],
  },
  ROAD_TRIP: {
    name: 'Road Trip Essentials',
    description: 'Road navigation, vehicle care, snacks, and casual travel comfort.',
    category: 'ROAD_TRIP',
    items: [
      { name: 'Driver License, Registration & Insurance', category: 'DOCUMENTS' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'FastTag & Emergency Cash Toll Stash', category: 'DOCUMENTS' as PackingCategory, quantity: 1, isRequired: true, isShared: true },
      { name: 'Car Multi-port Fast Charger & Type-C Cables', category: 'ELECTRONICS' as PackingCategory, quantity: 2, isRequired: true, isShared: true },
      { name: 'Magnetic Dashboard Phone Mount', category: 'ELECTRONICS' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Insulated Water Bottles & Thermos', category: 'FOOD_WATER' as PackingCategory, quantity: 2, isRequired: true, isShared: false },
      { name: 'Trail Mix, Energy Bars & Dry Snacks', category: 'FOOD_WATER' as PackingCategory, quantity: 4, isRequired: false, isShared: true },
      { name: 'Travel Pillow & Fleece Blanket', category: 'SLEEPWEAR' as PackingCategory, quantity: 2, isRequired: false, isShared: false },
      { name: 'Sunglasses & UV Arm Sleeves', category: 'MISCELLANEOUS' as PackingCategory, quantity: 1, isRequired: false, isShared: false },
      { name: 'Compact Emergency First Aid Pouch', category: 'MEDICINES' as PackingCategory, quantity: 1, isRequired: true, isShared: true },
      { name: 'Wet Wipes, Sanitizer & Tissues', category: 'TOILETRIES' as PackingCategory, quantity: 3, isRequired: true, isShared: true },
      { name: 'Light Windbreaker Jacket', category: 'WEATHER_LAYERS' as PackingCategory, quantity: 1, isRequired: false, isShared: false },
    ],
  },
  HIKING_CAMPING: {
    name: 'High-Altitude Trek & Camping',
    description: 'Backcountry tenting, alpine layers, trekking gear, and nourishment.',
    category: 'CAMPING',
    items: [
      { name: 'Waterproof 2-Person Dome Tent with Rainfly', category: 'CAMPING' as PackingCategory, quantity: 1, isRequired: true, isShared: true },
      { name: 'Sub-Zero Sleeping Bag (-5°C Rated)', category: 'CAMPING' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Insulated Inflatable Sleeping Mat', category: 'CAMPING' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Ankle-Support Waterproof Trekking Boots', category: 'FOOTWEAR' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Fleece Mid-Layer Jacket', category: 'WEATHER_LAYERS' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Waterproof Shell Pant & Jacket', category: 'WEATHER_LAYERS' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Headlamp with Spare Lithium Batteries', category: 'ELECTRONICS' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Water Purification Tablets / Filter Straw', category: 'FOOD_WATER' as PackingCategory, quantity: 1, isRequired: true, isShared: true },
      { name: 'Camp Stove, Butane Canister & Cookset', category: 'CAMPING' as PackingCategory, quantity: 1, isRequired: true, isShared: true },
      { name: 'Merino Wool Socks', category: 'INNERWEAR' as PackingCategory, quantity: 3, isRequired: true, isShared: false },
    ],
  },
  BEACH_HOLIDAY: {
    name: 'Beach & Coastal Holiday',
    description: 'Sun protection, lightweight breathable linens, and watersport gear.',
    category: 'BEACH',
    items: [
      { name: 'SPF 50+ Broad Spectrum Mineral Sunscreen', category: 'TOILETRIES' as PackingCategory, quantity: 1, isRequired: true, isShared: true },
      { name: 'UV Protective Sunglasses & Sun Hat', category: 'MISCELLANEOUS' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Quick-Dry Swimwear / Boardshorts', category: 'BOTTOMS' as PackingCategory, quantity: 2, isRequired: true, isShared: false },
      { name: 'Lightweight Linen Shirts & Cotton Tees', category: 'TOPS' as PackingCategory, quantity: 4, isRequired: true, isShared: false },
      { name: 'Comfortable Flip-Flops & Water Shoes', category: 'FOOTWEAR' as PackingCategory, quantity: 2, isRequired: true, isShared: false },
      { name: 'Waterproof Phone Pouch / Dry Bag (10L)', category: 'ELECTRONICS' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Sand-Resistant Microfiber Beach Towel', category: 'MISCELLANEOUS' as PackingCategory, quantity: 1, isRequired: false, isShared: false },
      { name: 'Aloe Vera After-Sun Gel', category: 'TOILETRIES' as PackingCategory, quantity: 1, isRequired: false, isShared: true },
    ],
  },
  WEEKEND_GETAWAY: {
    name: 'Weekend Getaway Capsule',
    description: 'Compact 48-hour duffel essentials for quick spontaneous trips.',
    category: 'GENERAL',
    items: [
      { name: 'Casual T-Shirts / Shirts', category: 'TOPS' as PackingCategory, quantity: 3, isRequired: true, isShared: false },
      { name: 'Denim Jeans & Comfortable Chinos', category: 'BOTTOMS' as PackingCategory, quantity: 2, isRequired: true, isShared: false },
      { name: 'Daily Underwear & Socks Set', category: 'INNERWEAR' as PackingCategory, quantity: 3, isRequired: true, isShared: false },
      { name: 'Comfortable Sneakers', category: 'FOOTWEAR' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Travel Size Toiletries & Toothbrush', category: 'TOILETRIES' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Phone Charger & Compact Power Bank', category: 'ELECTRONICS' as PackingCategory, quantity: 1, isRequired: true, isShared: false },
      { name: 'Light Casual Jacket / Shrug', category: 'WEATHER_LAYERS' as PackingCategory, quantity: 1, isRequired: false, isShared: false },
    ],
  },
};

// ─── Packing Lists & Summary ────────────────────────────────
export async function getTripPackingLists(tripId: string) {
  const lists = await prisma.packingList.findMany({
    where: { tripId },
    include: {
      items: {
        include: {
          bag: true,
        },
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return lists.map((list) => {
    const total = list.items.length;
    const packed = list.items.filter((i) => i.status === 'PACKED').length;
    const missing = list.items.filter((i) => i.status === 'MISSING').length;
    const dirty = list.items.filter((i) => i.status === 'DIRTY').length;
    const worn = list.items.filter((i) => i.status === 'WORN').length;

    return {
      ...list,
      _count: {
        items: total,
        packed,
        missing,
        dirty,
        worn,
      },
    };
  });
}

export async function createPackingList(tripId: string, data: CreatePackingListInput) {
  const list = await prisma.packingList.create({
    data: {
      tripId,
      name: data.name,
      description: data.description,
      isTemplate: data.isTemplate ?? false,
      category: data.category,
    },
    include: {
      items: true,
    },
  });

  return list;
}

export async function updatePackingList(listId: string, data: UpdatePackingListInput) {
  const updated = await prisma.packingList.update({
    where: { id: listId },
    data,
    include: {
      items: true,
    },
  });
  return updated;
}

export async function deletePackingList(listId: string) {
  await prisma.packingList.delete({
    where: { id: listId },
  });
  return { deleted: true };
}

// ─── Apply Template to Trip ─────────────────────────────────
export async function applyTemplate(
  tripId: string,
  templateKey: string,
  listName?: string
) {
  const template = PREBUILT_TEMPLATES[templateKey];
  if (!template) {
    throw AppError.badRequest(`Unknown template key: ${templateKey}`);
  }

  const name = listName || `${template.name} Checklist`;

  const createdList = await prisma.$transaction(async (tx) => {
    const list = await tx.packingList.create({
      data: {
        tripId,
        name,
        description: template.description,
        isTemplate: false,
        category: template.category,
      },
    });

    if (template.items.length > 0) {
      await tx.packingItem.createMany({
        data: template.items.map((it) => ({
          listId: list.id,
          name: it.name,
          category: it.category,
          quantity: it.quantity,
          status: 'NOT_PACKED',
          isRequired: it.isRequired,
          isShared: it.isShared,
          notes: it.notes || null,
        })),
      });
    }

    return list;
  });

  return getTripPackingLists(tripId);
}

// ─── Luggage Bags ───────────────────────────────────────────
export async function getLuggageBags(tripId: string) {
  const bags = await prisma.luggageBag.findMany({
    where: { tripId },
    include: {
      _count: {
        select: { items: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return bags;
}

export async function createLuggageBag(tripId: string, data: CreateLuggageBagInput) {
  const bag = await prisma.luggageBag.create({
    data: {
      tripId,
      name: data.name,
      bagType: data.bagType,
      capacityLiters: data.capacityLiters,
      maxWeightKg: data.maxWeightKg,
      color: data.color,
      notes: data.notes,
    },
  });
  return bag;
}

export async function updateLuggageBag(bagId: string, data: UpdateLuggageBagInput) {
  const updated = await prisma.luggageBag.update({
    where: { id: bagId },
    data,
  });
  return updated;
}

export async function deleteLuggageBag(bagId: string) {
  await prisma.luggageBag.delete({
    where: { id: bagId },
  });
  return { deleted: true };
}

// ─── Packing Items ──────────────────────────────────────────
export async function createPackingItem(listId: string, data: CreatePackingItemInput) {
  const item = await prisma.packingItem.create({
    data: {
      listId,
      bagId: data.bagId || null,
      name: data.name,
      category: data.category,
      quantity: data.quantity ?? 1,
      weightGrams: data.weightGrams,
      status: data.status ?? 'NOT_PACKED',
      isRequired: data.isRequired ?? true,
      isShared: data.isShared ?? false,
      assignedTo: data.assignedTo || null,
      dayNumber: data.dayNumber || null,
      notes: data.notes || null,
    },
    include: {
      bag: true,
    },
  });
  return item;
}

export async function updatePackingItem(itemId: string, data: UpdatePackingItemInput) {
  const updated = await prisma.packingItem.update({
    where: { id: itemId },
    data: {
      name: data.name,
      category: data.category,
      quantity: data.quantity,
      weightGrams: data.weightGrams,
      status: data.status,
      isRequired: data.isRequired,
      isShared: data.isShared,
      assignedTo: data.assignedTo,
      bagId: data.bagId === null ? null : data.bagId,
      dayNumber: data.dayNumber,
      notes: data.notes,
    },
    include: {
      bag: true,
    },
  });
  return updated;
}

export async function updateItemStatus(itemId: string, status: PackingStatus) {
  const updated = await prisma.packingItem.update({
    where: { id: itemId },
    data: { status },
    include: {
      bag: true,
    },
  });
  return updated;
}

export async function batchUpdateStatus(itemIds: string[], status: PackingStatus) {
  await prisma.packingItem.updateMany({
    where: {
      id: { in: itemIds },
    },
    data: { status },
  });

  return { updatedCount: itemIds.length, status };
}

export async function deletePackingItem(itemId: string) {
  await prisma.packingItem.delete({
    where: { id: itemId },
  });
  return { deleted: true };
}
