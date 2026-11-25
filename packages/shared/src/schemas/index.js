// ============================================================
// Waylo — Shared Zod Validation Schemas
// ============================================================
// Used by backend for request validation and by frontend
// for form validation via @hookform/resolvers/zod.
// ============================================================
import { z } from 'zod';
import { TripStatus, TripType, TransportMode, TripRole, TripVisibility, SUPPORTED_CURRENCIES, ItineraryItemType, ActivityFlexibility, PackingStatus, PackingCategory, LuggageBagType, VehicleType, FuelType, ExpenseCategory, PaymentMethod, ExpenseSplitType, InspectionStatus, BookingType, BookingStatus, DocumentType, PingType, JournalMood, HighlightCategory, } from '../constants/index.js';
// ─── Auth Schemas ───────────────────────────────────────────
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be at most 128 characters'),
    displayName: z
        .string()
        .min(2, 'Display name must be at least 2 characters')
        .max(50, 'Display name must be at most 50 characters')
        .trim(),
});
// ─── User Schemas ───────────────────────────────────────────
export const updateProfileSchema = z.object({
    displayName: z.string().min(2).max(50).trim().optional(),
    avatarUrl: z.string().url().nullable().optional(),
    timezone: z.string().optional(),
    preferredCurrency: z.enum(SUPPORTED_CURRENCIES).optional(),
    bio: z.string().max(500).nullable().optional(),
    budgetStyle: z.string().max(50).nullable().optional(),
    preferredPace: z.string().max(50).nullable().optional(),
    accommodationType: z.string().max(50).nullable().optional(),
    interests: z.array(z.string().max(50)).max(20).optional(),
    dietaryPreferences: z.array(z.string().max(50)).max(10).optional(),
});
// ─── Trip Schemas ───────────────────────────────────────────
export const createTripSchema = z.object({
    name: z
        .string()
        .min(1, 'Trip name is required')
        .max(100, 'Trip name must be at most 100 characters')
        .trim(),
    description: z.string().max(2000).nullable().optional(),
    tripType: z.nativeEnum(TripType).default(TripType.SOLO),
    transportModes: z
        .array(z.nativeEnum(TransportMode))
        .min(1, 'Select at least one transport mode')
        .default([TransportMode.CAR]),
    startDate: z.string().datetime({ offset: true }).nullable().optional(),
    endDate: z.string().datetime({ offset: true }).nullable().optional(),
    startLocation: z.string().max(200).nullable().optional(),
    destination: z.string().max(200).nullable().optional(),
    returnLocation: z.string().max(200).nullable().optional(),
    currency: z.enum(SUPPORTED_CURRENCIES).default('INR'),
    estimatedBudget: z.number().int().nonnegative().nullable().optional(),
    visibility: z.nativeEnum(TripVisibility).default(TripVisibility.PRIVATE),
    tags: z.array(z.string().max(30)).max(10).default([]),
    coverImageUrl: z.string().url().nullable().optional(),
});
export const updateTripSchema = createTripSchema.partial().extend({
    status: z.nativeEnum(TripStatus).optional(),
});
// ─── Trip Member Schemas ────────────────────────────────────
export const addMemberSchema = z.object({
    email: z.string().email('Invalid email address'),
    role: z.nativeEnum(TripRole).default(TripRole.MEMBER),
});
export const updateMemberRoleSchema = z.object({
    role: z.nativeEnum(TripRole),
});
// ─── Trip Invitation Schemas ────────────────────────────────
export const createInvitationSchema = z.object({
    role: z.nativeEnum(TripRole).default(TripRole.MEMBER),
    invitedEmail: z.string().email().nullable().optional(),
    expiresInHours: z.number().int().min(1).max(168).default(48), // 1h to 7 days
});
// ─── Pagination Schema ──────────────────────────────────────
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().max(100).optional(),
    sortBy: z.string().max(50).optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
// ─── Itinerary Day Schemas ──────────────────────────────────
export const createItineraryDaySchema = z.object({
    dayNumber: z.number().int().positive('Day number must be at least 1'),
    date: z.string().datetime({ offset: true }).nullable().optional(),
    title: z.string().max(100).nullable().optional(),
    startLocation: z.string().max(200).nullable().optional(),
    endLocation: z.string().max(200).nullable().optional(),
    plannedDeparture: z.string().max(20).nullable().optional(),
    plannedArrival: z.string().max(20).nullable().optional(),
    actualDeparture: z.string().max(20).nullable().optional(),
    actualArrival: z.string().max(20).nullable().optional(),
    plannedDistanceKm: z.number().nonnegative().nullable().optional(),
    actualDistanceKm: z.number().nonnegative().nullable().optional(),
    notes: z.string().max(2000).nullable().optional(),
});
export const updateItineraryDaySchema = createItineraryDaySchema.partial();
export const batchGenerateDaysSchema = z.object({
    startDate: z.string().datetime({ offset: true }).nullable().optional(),
    endDate: z.string().datetime({ offset: true }).nullable().optional(),
    dayCount: z.number().int().min(1).max(60).optional(),
    startLocation: z.string().max(200).nullable().optional(),
    destination: z.string().max(200).nullable().optional(),
});
// ─── Itinerary Item Schemas ─────────────────────────────────
export const createItineraryItemSchema = z.object({
    title: z.string().min(1, 'Title is required').max(150).trim(),
    description: z.string().max(1000).nullable().optional(),
    itemType: z.nativeEnum(ItineraryItemType).default(ItineraryItemType.ACTIVITY),
    orderIndex: z.number().int().nonnegative().default(0),
    startTime: z.string().max(20).nullable().optional(),
    endTime: z.string().max(20).nullable().optional(),
    location: z.string().max(200).nullable().optional(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    flexibility: z.nativeEnum(ActivityFlexibility).default(ActivityFlexibility.FLEXIBLE),
    isCompleted: z.boolean().default(false),
    isOptional: z.boolean().default(false),
    cost: z.number().int().nonnegative().nullable().optional(),
    currency: z.enum(SUPPORTED_CURRENCIES).default('INR'),
    notes: z.string().max(1000).nullable().optional(),
    reminders: z.array(z.string().max(100)).max(10).default([]),
});
export const updateItineraryItemSchema = createItineraryItemSchema.partial();
export const reorderItineraryItemsSchema = z.object({
    items: z.array(z.object({
        id: z.string().uuid(),
        orderIndex: z.number().int().nonnegative(),
    })).min(1, 'Must provide items to reorder'),
});
// ─── Packing & Luggage Schemas ──────────────────────────────
export const createPackingListSchema = z.object({
    name: z.string().min(1, 'List name is required').max(100).trim(),
    description: z.string().max(500).nullable().optional(),
    isTemplate: z.boolean().default(false),
    category: z.string().max(50).nullable().optional(),
});
export const updatePackingListSchema = createPackingListSchema.partial();
export const createLuggageBagSchema = z.object({
    name: z.string().min(1, 'Bag name is required').max(100).trim(),
    bagType: z.nativeEnum(LuggageBagType).default(LuggageBagType.BACKPACK),
    capacityLiters: z.number().positive().nullable().optional(),
    maxWeightKg: z.number().positive().nullable().optional(),
    color: z.string().max(30).nullable().optional(),
    notes: z.string().max(300).nullable().optional(),
});
export const updateLuggageBagSchema = createLuggageBagSchema.partial();
export const createPackingItemSchema = z.object({
    name: z.string().min(1, 'Item name is required').max(150).trim(),
    category: z.nativeEnum(PackingCategory).default(PackingCategory.MISCELLANEOUS),
    quantity: z.number().int().min(1).default(1),
    weightGrams: z.number().int().nonnegative().nullable().optional(),
    status: z.nativeEnum(PackingStatus).default(PackingStatus.NOT_PACKED),
    isRequired: z.boolean().default(true),
    isShared: z.boolean().default(false),
    assignedTo: z.string().max(100).nullable().optional(),
    bagId: z.string().uuid().nullable().optional(),
    dayNumber: z.number().int().positive().nullable().optional(),
    notes: z.string().max(500).nullable().optional(),
});
export const updatePackingItemSchema = createPackingItemSchema.partial();
export const batchUpdateItemStatusSchema = z.object({
    itemIds: z.array(z.string().uuid()).min(1),
    status: z.nativeEnum(PackingStatus),
});
export const applyPackingTemplateSchema = z.object({
    templateId: z.string().uuid().optional(),
    templateKey: z
        .enum([
        'ROAD_TRIP',
        'MOTORCYCLE_EXPEDITION',
        'WEEKEND_GETAWAY',
        'BEACH_HOLIDAY',
        'HIKING_CAMPING',
    ])
        .optional(),
});
// ─── Vehicle Schemas ────────────────────────────────────────
export const createVehicleSchema = z.object({
    name: z.string().min(1, 'Vehicle name is required').max(100).trim(),
    type: z.nativeEnum(VehicleType).default(VehicleType.MOTORCYCLE),
    make: z.string().max(50).nullable().optional(),
    model: z.string().max(50).nullable().optional(),
    year: z.number().int().min(1950).max(2030).nullable().optional(),
    registrationNumber: z.string().max(30).nullable().optional(),
    fuelType: z.nativeEnum(FuelType).default(FuelType.PETROL),
    tankCapacityLiters: z.number().positive().nullable().optional(),
    initialOdometer: z.number().nonnegative().nullable().optional(),
    currentOdometer: z.number().nonnegative().nullable().optional(),
    tripId: z.string().uuid().nullable().optional(),
});
export const updateVehicleSchema = createVehicleSchema.partial();
export const createFuelLogSchema = z.object({
    vehicleId: z.string().uuid(),
    date: z.string().datetime({ offset: true }).optional(),
    odometer: z.number().nonnegative('Odometer reading must be non-negative'),
    litersOrKwh: z.number().positive('Fuel volume or kWh must be positive'),
    cost: z.number().int().nonnegative('Cost must be positive'),
    currency: z.enum(SUPPORTED_CURRENCIES).default('INR'),
    isFullTank: z.boolean().default(true),
    fuelPricePerUnit: z.number().positive().nullable().optional(),
    stationLocation: z.string().max(200).nullable().optional(),
    notes: z.string().max(500).nullable().optional(),
});
export const createInspectionSchema = z.object({
    vehicleId: z.string().uuid(),
    status: z.nativeEnum(InspectionStatus).default(InspectionStatus.PASSED),
    checklist: z.record(z.boolean()),
    notes: z.string().max(500).nullable().optional(),
    odometer: z.number().nonnegative().nullable().optional(),
});
// ─── Expense & Split Schemas ────────────────────────────────
export const expenseSplitItemSchema = z.object({
    userId: z.string().uuid(),
    amount: z.number().int().nonnegative(),
    percentage: z.number().min(0).max(100).optional(),
});
export const createExpenseSchema = z.object({
    title: z.string().min(1, 'Expense title is required').max(150).trim(),
    amount: z.number().int().positive('Amount must be greater than zero'),
    currency: z.enum(SUPPORTED_CURRENCIES).default('INR'),
    category: z.nativeEnum(ExpenseCategory).default(ExpenseCategory.MISCELLANEOUS),
    paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.UPI),
    date: z.string().datetime({ offset: true }).optional(),
    paidById: z.string().uuid().optional(),
    splitType: z.nativeEnum(ExpenseSplitType).default(ExpenseSplitType.EQUAL),
    splits: z.array(expenseSplitItemSchema).optional(),
    notes: z.string().max(500).nullable().optional(),
    receiptUrl: z.string().url().nullable().optional(),
});
export const updateExpenseSchema = createExpenseSchema.partial();
export const settleExpenseSplitSchema = z.object({
    splitId: z.string().uuid(),
    isSettled: z.boolean().default(true),
});
// ─── Accommodation & Stays Schemas ──────────────────────────
export const createAccommodationSchema = z.object({
    name: z.string().min(1, 'Accommodation name is required').max(150).trim(),
    type: z.nativeEnum(BookingType).default(BookingType.HOTEL),
    location: z.string().max(250).nullable().optional(),
    checkInDate: z.string().min(1, 'Check-in date is required'),
    checkOutDate: z.string().min(1, 'Check-out date is required'),
    checkInTime: z.string().max(20).nullable().optional(),
    checkOutTime: z.string().max(20).nullable().optional(),
    confirmationCode: z.string().max(100).nullable().optional(),
    totalCost: z.number().int().nonnegative().nullable().optional(),
    currency: z.enum(SUPPORTED_CURRENCIES).default('INR'),
    contactPhone: z.string().max(30).nullable().optional(),
    contactEmail: z.string().email().nullable().optional().or(z.literal('')),
    notes: z.string().max(500).nullable().optional(),
    bookingStatus: z.nativeEnum(BookingStatus).default(BookingStatus.CONFIRMED),
});
export const updateAccommodationSchema = createAccommodationSchema.partial();
// ─── Documents Vault Schemas ────────────────────────────────
export const createDocumentSchema = z.object({
    title: z.string().min(1, 'Document title is required').max(150).trim(),
    documentType: z.nativeEnum(DocumentType).default(DocumentType.OTHER),
    fileUrl: z.string().max(1000).nullable().optional(),
    fileName: z.string().max(255).nullable().optional(),
    fileSize: z.number().int().nonnegative().nullable().optional(),
    expiryDate: z.string().nullable().optional(),
    isShared: z.boolean().default(true),
    notes: z.string().max(500).nullable().optional(),
});
export const updateDocumentSchema = createDocumentSchema.partial();
// ─── AI Trip Planner & Copilot Schemas ──────────────────────
export const generateItinerarySchema = z.object({
    destination: z.string().min(1, 'Destination is required').max(200).trim(),
    origin: z.string().max(200).trim().optional(),
    daysCount: z.number().int().min(1).max(30).default(3),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    tripType: z.nativeEnum(TripType).default(TripType.MOTORCYCLE),
    travelPace: z.enum(['RELAXED', 'MODERATE', 'PACKED']).default('MODERATE'),
    budget: z.enum(['BUDGET', 'MODERATE', 'LUXURY']).default('MODERATE'),
    interests: z.array(z.string()).optional(),
    preferences: z.string().max(500).optional(),
});
export const applyAIItinerarySchema = z.object({
    tripId: z.string().uuid(),
    itinerary: z.object({
        tripTitle: z.string().optional(),
        summary: z.string().optional(),
        highlights: z.array(z.string()).optional(),
        days: z.array(z.object({
            dayNumber: z.number().int(),
            title: z.string(),
            startLocation: z.string().nullable().optional(),
            endLocation: z.string().nullable().optional(),
            notes: z.string().nullable().optional(),
            stops: z.array(z.object({
                title: z.string(),
                itemType: z.nativeEnum(ItineraryItemType).default(ItineraryItemType.SIGHTSEEING),
                location: z.string().nullable().optional(),
                plannedStartTime: z.string().nullable().optional(),
                plannedEndTime: z.string().nullable().optional(),
                plannedDistanceKm: z.number().nullable().optional(),
                flexibility: z.nativeEnum(ActivityFlexibility).default(ActivityFlexibility.FLEXIBLE),
                isOptional: z.boolean().default(false),
                notes: z.string().nullable().optional(),
            })),
        })),
    }),
});
export const generatePackingSchema = z.object({
    destination: z.string().min(1, 'Destination is required').trim(),
    tripType: z.nativeEnum(TripType).default(TripType.CAR_ROAD_TRIP),
    daysCount: z.number().int().min(1).max(60).default(3),
    climate: z.string().max(100).optional(),
    includeRidingGear: z.boolean().default(false),
    tripId: z.string().uuid().optional(),
});
export const applyAIPackingSchema = z.object({
    tripId: z.string().uuid(),
    items: z.array(z.object({
        name: z.string().min(1).trim(),
        category: z.nativeEnum(PackingCategory),
        quantity: z.number().int().positive().default(1),
        isRequired: z.boolean().default(false),
        notes: z.string().nullable().optional(),
    })),
});
export const chatCopilotSchema = z.object({
    message: z.string().min(1, 'Message is required').max(2000).trim(),
    history: z
        .array(z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
    }))
        .optional(),
    tripId: z.string().uuid().optional(),
    tripContext: z.record(z.any()).optional(),
});
// ─── Group Ride & Live Tracking Schemas ─────────────────────
export const startRideSessionSchema = z.object({
    tripId: z.string().uuid(),
    name: z.string().min(1, 'Session name is required').max(100).trim(),
});
export const updateRiderLocationSchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    altitude: z.number().nullable().optional(),
    speedKmh: z.number().min(0).max(350).nullable().optional(),
    headingDeg: z.number().min(0).max(360).nullable().optional(),
    batteryPercent: z.number().min(0).max(100).nullable().optional(),
});
export const sendCrewPingSchema = z.object({
    tripId: z.string().uuid(),
    pingType: z.nativeEnum(PingType).default(PingType.REGROUP),
    message: z.string().max(200).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
});
// ─── Journal & Highlight Schemas ───────────────────────────
export const createJournalEntrySchema = z.object({
    dayNumber: z.number().int().positive().optional().nullable(),
    title: z.string().min(1, 'Title is required').max(150),
    content: z.string().min(1, 'Content is required'),
    location: z.string().max(150).optional().nullable(),
    mood: z.nativeEnum(JournalMood).optional().nullable(),
    weatherNote: z.string().max(100).optional().nullable(),
    mediaUrls: z.array(z.string()).default([]),
});
export const updateJournalEntrySchema = createJournalEntrySchema.partial();
export const createTripHighlightSchema = z.object({
    title: z.string().min(1, 'Highlight title is required').max(120),
    description: z.string().max(500).optional().nullable(),
    category: z.nativeEnum(HighlightCategory).default(HighlightCategory.SCENIC_VIEW),
    location: z.string().max(150).optional().nullable(),
    rating: z.number().int().min(1).max(5).default(5),
    photoUrl: z.string().optional().nullable(),
});
export const updateTripHighlightSchema = createTripHighlightSchema.partial();
//# sourceMappingURL=index.js.map