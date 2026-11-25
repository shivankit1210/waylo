import { z } from 'zod';
import { TripStatus, TripType, TransportMode, TripRole, TripVisibility, ItineraryItemType, ActivityFlexibility, PackingStatus, PackingCategory, LuggageBagType, VehicleType, FuelType, ExpenseCategory, PaymentMethod, ExpenseSplitType, InspectionStatus, BookingType, BookingStatus, DocumentType, PingType, JournalMood, HighlightCategory } from '../constants/index.js';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    displayName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    displayName: string;
    email: string;
    password: string;
}, {
    displayName: string;
    email: string;
    password: string;
}>;
export declare const updateProfileSchema: z.ZodObject<{
    displayName: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    timezone: z.ZodOptional<z.ZodString>;
    preferredCurrency: z.ZodOptional<z.ZodEnum<["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "THB", "JPY", "MYR", "IDR", "PHP", "VND", "KRW", "CHF", "SEK", "NOK", "DKK", "NZD"]>>;
    bio: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    budgetStyle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    preferredPace: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    accommodationType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    dietaryPreferences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    displayName?: string | undefined;
    avatarUrl?: string | null | undefined;
    timezone?: string | undefined;
    preferredCurrency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    bio?: string | null | undefined;
    budgetStyle?: string | null | undefined;
    preferredPace?: string | null | undefined;
    accommodationType?: string | null | undefined;
    interests?: string[] | undefined;
    dietaryPreferences?: string[] | undefined;
}, {
    displayName?: string | undefined;
    avatarUrl?: string | null | undefined;
    timezone?: string | undefined;
    preferredCurrency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    bio?: string | null | undefined;
    budgetStyle?: string | null | undefined;
    preferredPace?: string | null | undefined;
    accommodationType?: string | null | undefined;
    interests?: string[] | undefined;
    dietaryPreferences?: string[] | undefined;
}>;
export declare const createTripSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tripType: z.ZodDefault<z.ZodNativeEnum<typeof TripType>>;
    transportModes: z.ZodDefault<z.ZodArray<z.ZodNativeEnum<typeof TransportMode>, "many">>;
    startDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    startLocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    destination: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    returnLocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    currency: z.ZodDefault<z.ZodEnum<["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "THB", "JPY", "MYR", "IDR", "PHP", "VND", "KRW", "CHF", "SEK", "NOK", "DKK", "NZD"]>>;
    estimatedBudget: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    visibility: z.ZodDefault<z.ZodNativeEnum<typeof TripVisibility>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    coverImageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    tripType: TripType;
    transportModes: TransportMode[];
    currency: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD";
    visibility: TripVisibility;
    tags: string[];
    description?: string | null | undefined;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
    startLocation?: string | null | undefined;
    destination?: string | null | undefined;
    returnLocation?: string | null | undefined;
    estimatedBudget?: number | null | undefined;
    coverImageUrl?: string | null | undefined;
}, {
    name: string;
    description?: string | null | undefined;
    tripType?: TripType | undefined;
    transportModes?: TransportMode[] | undefined;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
    startLocation?: string | null | undefined;
    destination?: string | null | undefined;
    returnLocation?: string | null | undefined;
    currency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    estimatedBudget?: number | null | undefined;
    visibility?: TripVisibility | undefined;
    tags?: string[] | undefined;
    coverImageUrl?: string | null | undefined;
}>;
export declare const updateTripSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    tripType: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof TripType>>>;
    transportModes: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodNativeEnum<typeof TransportMode>, "many">>>;
    startDate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    startLocation: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    destination: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    returnLocation: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    currency: z.ZodOptional<z.ZodDefault<z.ZodEnum<["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "THB", "JPY", "MYR", "IDR", "PHP", "VND", "KRW", "CHF", "SEK", "NOK", "DKK", "NZD"]>>>;
    estimatedBudget: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    visibility: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof TripVisibility>>>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    coverImageUrl: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
} & {
    status: z.ZodOptional<z.ZodNativeEnum<typeof TripStatus>>;
}, "strip", z.ZodTypeAny, {
    status?: TripStatus | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    tripType?: TripType | undefined;
    transportModes?: TransportMode[] | undefined;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
    startLocation?: string | null | undefined;
    destination?: string | null | undefined;
    returnLocation?: string | null | undefined;
    currency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    estimatedBudget?: number | null | undefined;
    visibility?: TripVisibility | undefined;
    tags?: string[] | undefined;
    coverImageUrl?: string | null | undefined;
}, {
    status?: TripStatus | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    tripType?: TripType | undefined;
    transportModes?: TransportMode[] | undefined;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
    startLocation?: string | null | undefined;
    destination?: string | null | undefined;
    returnLocation?: string | null | undefined;
    currency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    estimatedBudget?: number | null | undefined;
    visibility?: TripVisibility | undefined;
    tags?: string[] | undefined;
    coverImageUrl?: string | null | undefined;
}>;
export declare const addMemberSchema: z.ZodObject<{
    email: z.ZodString;
    role: z.ZodDefault<z.ZodNativeEnum<typeof TripRole>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    role: TripRole;
}, {
    email: string;
    role?: TripRole | undefined;
}>;
export declare const updateMemberRoleSchema: z.ZodObject<{
    role: z.ZodNativeEnum<typeof TripRole>;
}, "strip", z.ZodTypeAny, {
    role: TripRole;
}, {
    role: TripRole;
}>;
export declare const createInvitationSchema: z.ZodObject<{
    role: z.ZodDefault<z.ZodNativeEnum<typeof TripRole>>;
    invitedEmail: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    expiresInHours: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    role: TripRole;
    expiresInHours: number;
    invitedEmail?: string | null | undefined;
}, {
    role?: TripRole | undefined;
    invitedEmail?: string | null | undefined;
    expiresInHours?: number | undefined;
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
    sortOrder: "asc" | "desc";
    search?: string | undefined;
    sortBy?: string | undefined;
}, {
    page?: number | undefined;
    pageSize?: number | undefined;
    search?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export declare const createItineraryDaySchema: z.ZodObject<{
    dayNumber: z.ZodNumber;
    date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    startLocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    endLocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    plannedDeparture: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    plannedArrival: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    actualDeparture: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    actualArrival: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    plannedDistanceKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    actualDistanceKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    dayNumber: number;
    date?: string | null | undefined;
    startLocation?: string | null | undefined;
    title?: string | null | undefined;
    endLocation?: string | null | undefined;
    plannedDeparture?: string | null | undefined;
    plannedArrival?: string | null | undefined;
    actualDeparture?: string | null | undefined;
    actualArrival?: string | null | undefined;
    plannedDistanceKm?: number | null | undefined;
    actualDistanceKm?: number | null | undefined;
    notes?: string | null | undefined;
}, {
    dayNumber: number;
    date?: string | null | undefined;
    startLocation?: string | null | undefined;
    title?: string | null | undefined;
    endLocation?: string | null | undefined;
    plannedDeparture?: string | null | undefined;
    plannedArrival?: string | null | undefined;
    actualDeparture?: string | null | undefined;
    actualArrival?: string | null | undefined;
    plannedDistanceKm?: number | null | undefined;
    actualDistanceKm?: number | null | undefined;
    notes?: string | null | undefined;
}>;
export declare const updateItineraryDaySchema: z.ZodObject<{
    dayNumber: z.ZodOptional<z.ZodNumber>;
    date: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    title: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    startLocation: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    endLocation: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    plannedDeparture: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    plannedArrival: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    actualDeparture: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    actualArrival: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    plannedDistanceKm: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    actualDistanceKm: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    date?: string | null | undefined;
    startLocation?: string | null | undefined;
    dayNumber?: number | undefined;
    title?: string | null | undefined;
    endLocation?: string | null | undefined;
    plannedDeparture?: string | null | undefined;
    plannedArrival?: string | null | undefined;
    actualDeparture?: string | null | undefined;
    actualArrival?: string | null | undefined;
    plannedDistanceKm?: number | null | undefined;
    actualDistanceKm?: number | null | undefined;
    notes?: string | null | undefined;
}, {
    date?: string | null | undefined;
    startLocation?: string | null | undefined;
    dayNumber?: number | undefined;
    title?: string | null | undefined;
    endLocation?: string | null | undefined;
    plannedDeparture?: string | null | undefined;
    plannedArrival?: string | null | undefined;
    actualDeparture?: string | null | undefined;
    actualArrival?: string | null | undefined;
    plannedDistanceKm?: number | null | undefined;
    actualDistanceKm?: number | null | undefined;
    notes?: string | null | undefined;
}>;
export declare const batchGenerateDaysSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dayCount: z.ZodOptional<z.ZodNumber>;
    startLocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    destination: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
    startLocation?: string | null | undefined;
    destination?: string | null | undefined;
    dayCount?: number | undefined;
}, {
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
    startLocation?: string | null | undefined;
    destination?: string | null | undefined;
    dayCount?: number | undefined;
}>;
export declare const createItineraryItemSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    itemType: z.ZodDefault<z.ZodNativeEnum<typeof ItineraryItemType>>;
    orderIndex: z.ZodDefault<z.ZodNumber>;
    startTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    endTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    latitude: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    longitude: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    flexibility: z.ZodDefault<z.ZodNativeEnum<typeof ActivityFlexibility>>;
    isCompleted: z.ZodDefault<z.ZodBoolean>;
    isOptional: z.ZodDefault<z.ZodBoolean>;
    cost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    currency: z.ZodDefault<z.ZodEnum<["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "THB", "JPY", "MYR", "IDR", "PHP", "VND", "KRW", "CHF", "SEK", "NOK", "DKK", "NZD"]>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reminders: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    currency: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD";
    title: string;
    itemType: ItineraryItemType;
    orderIndex: number;
    flexibility: ActivityFlexibility;
    isCompleted: boolean;
    isOptional: boolean;
    reminders: string[];
    description?: string | null | undefined;
    notes?: string | null | undefined;
    startTime?: string | null | undefined;
    endTime?: string | null | undefined;
    location?: string | null | undefined;
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
    cost?: number | null | undefined;
}, {
    title: string;
    description?: string | null | undefined;
    currency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    notes?: string | null | undefined;
    itemType?: ItineraryItemType | undefined;
    orderIndex?: number | undefined;
    startTime?: string | null | undefined;
    endTime?: string | null | undefined;
    location?: string | null | undefined;
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
    flexibility?: ActivityFlexibility | undefined;
    isCompleted?: boolean | undefined;
    isOptional?: boolean | undefined;
    cost?: number | null | undefined;
    reminders?: string[] | undefined;
}>;
export declare const updateItineraryItemSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    itemType: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof ItineraryItemType>>>;
    orderIndex: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    startTime: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    endTime: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    location: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    latitude: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    longitude: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    flexibility: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof ActivityFlexibility>>>;
    isCompleted: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    isOptional: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    cost: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    currency: z.ZodOptional<z.ZodDefault<z.ZodEnum<["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "THB", "JPY", "MYR", "IDR", "PHP", "VND", "KRW", "CHF", "SEK", "NOK", "DKK", "NZD"]>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    reminders: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    description?: string | null | undefined;
    currency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    title?: string | undefined;
    notes?: string | null | undefined;
    itemType?: ItineraryItemType | undefined;
    orderIndex?: number | undefined;
    startTime?: string | null | undefined;
    endTime?: string | null | undefined;
    location?: string | null | undefined;
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
    flexibility?: ActivityFlexibility | undefined;
    isCompleted?: boolean | undefined;
    isOptional?: boolean | undefined;
    cost?: number | null | undefined;
    reminders?: string[] | undefined;
}, {
    description?: string | null | undefined;
    currency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    title?: string | undefined;
    notes?: string | null | undefined;
    itemType?: ItineraryItemType | undefined;
    orderIndex?: number | undefined;
    startTime?: string | null | undefined;
    endTime?: string | null | undefined;
    location?: string | null | undefined;
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
    flexibility?: ActivityFlexibility | undefined;
    isCompleted?: boolean | undefined;
    isOptional?: boolean | undefined;
    cost?: number | null | undefined;
    reminders?: string[] | undefined;
}>;
export declare const reorderItineraryItemsSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orderIndex: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        orderIndex: number;
    }, {
        id: string;
        orderIndex: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        id: string;
        orderIndex: number;
    }[];
}, {
    items: {
        id: string;
        orderIndex: number;
    }[];
}>;
export declare const createPackingListSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isTemplate: z.ZodDefault<z.ZodBoolean>;
    category: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    isTemplate: boolean;
    description?: string | null | undefined;
    category?: string | null | undefined;
}, {
    name: string;
    description?: string | null | undefined;
    isTemplate?: boolean | undefined;
    category?: string | null | undefined;
}>;
export declare const updatePackingListSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    isTemplate: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    category: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | null | undefined;
    isTemplate?: boolean | undefined;
    category?: string | null | undefined;
}, {
    name?: string | undefined;
    description?: string | null | undefined;
    isTemplate?: boolean | undefined;
    category?: string | null | undefined;
}>;
export declare const createLuggageBagSchema: z.ZodObject<{
    name: z.ZodString;
    bagType: z.ZodDefault<z.ZodNativeEnum<typeof LuggageBagType>>;
    capacityLiters: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    maxWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    bagType: LuggageBagType;
    notes?: string | null | undefined;
    capacityLiters?: number | null | undefined;
    maxWeightKg?: number | null | undefined;
    color?: string | null | undefined;
}, {
    name: string;
    notes?: string | null | undefined;
    bagType?: LuggageBagType | undefined;
    capacityLiters?: number | null | undefined;
    maxWeightKg?: number | null | undefined;
    color?: string | null | undefined;
}>;
export declare const updateLuggageBagSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    bagType: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof LuggageBagType>>>;
    capacityLiters: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    maxWeightKg: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    color: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    notes?: string | null | undefined;
    bagType?: LuggageBagType | undefined;
    capacityLiters?: number | null | undefined;
    maxWeightKg?: number | null | undefined;
    color?: string | null | undefined;
}, {
    name?: string | undefined;
    notes?: string | null | undefined;
    bagType?: LuggageBagType | undefined;
    capacityLiters?: number | null | undefined;
    maxWeightKg?: number | null | undefined;
    color?: string | null | undefined;
}>;
export declare const createPackingItemSchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodDefault<z.ZodNativeEnum<typeof PackingCategory>>;
    quantity: z.ZodDefault<z.ZodNumber>;
    weightGrams: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    status: z.ZodDefault<z.ZodNativeEnum<typeof PackingStatus>>;
    isRequired: z.ZodDefault<z.ZodBoolean>;
    isShared: z.ZodDefault<z.ZodBoolean>;
    assignedTo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bagId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dayNumber: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: PackingStatus;
    name: string;
    category: PackingCategory;
    quantity: number;
    isRequired: boolean;
    isShared: boolean;
    dayNumber?: number | null | undefined;
    notes?: string | null | undefined;
    weightGrams?: number | null | undefined;
    assignedTo?: string | null | undefined;
    bagId?: string | null | undefined;
}, {
    name: string;
    status?: PackingStatus | undefined;
    dayNumber?: number | null | undefined;
    notes?: string | null | undefined;
    category?: PackingCategory | undefined;
    quantity?: number | undefined;
    weightGrams?: number | null | undefined;
    isRequired?: boolean | undefined;
    isShared?: boolean | undefined;
    assignedTo?: string | null | undefined;
    bagId?: string | null | undefined;
}>;
export declare const updatePackingItemSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof PackingCategory>>>;
    quantity: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    weightGrams: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof PackingStatus>>>;
    isRequired: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    isShared: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    assignedTo: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    bagId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    dayNumber: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    status?: PackingStatus | undefined;
    name?: string | undefined;
    dayNumber?: number | null | undefined;
    notes?: string | null | undefined;
    category?: PackingCategory | undefined;
    quantity?: number | undefined;
    weightGrams?: number | null | undefined;
    isRequired?: boolean | undefined;
    isShared?: boolean | undefined;
    assignedTo?: string | null | undefined;
    bagId?: string | null | undefined;
}, {
    status?: PackingStatus | undefined;
    name?: string | undefined;
    dayNumber?: number | null | undefined;
    notes?: string | null | undefined;
    category?: PackingCategory | undefined;
    quantity?: number | undefined;
    weightGrams?: number | null | undefined;
    isRequired?: boolean | undefined;
    isShared?: boolean | undefined;
    assignedTo?: string | null | undefined;
    bagId?: string | null | undefined;
}>;
export declare const batchUpdateItemStatusSchema: z.ZodObject<{
    itemIds: z.ZodArray<z.ZodString, "many">;
    status: z.ZodNativeEnum<typeof PackingStatus>;
}, "strip", z.ZodTypeAny, {
    status: PackingStatus;
    itemIds: string[];
}, {
    status: PackingStatus;
    itemIds: string[];
}>;
export declare const applyPackingTemplateSchema: z.ZodObject<{
    templateId: z.ZodOptional<z.ZodString>;
    templateKey: z.ZodOptional<z.ZodEnum<["ROAD_TRIP", "MOTORCYCLE_EXPEDITION", "WEEKEND_GETAWAY", "BEACH_HOLIDAY", "HIKING_CAMPING"]>>;
}, "strip", z.ZodTypeAny, {
    templateId?: string | undefined;
    templateKey?: "ROAD_TRIP" | "MOTORCYCLE_EXPEDITION" | "WEEKEND_GETAWAY" | "BEACH_HOLIDAY" | "HIKING_CAMPING" | undefined;
}, {
    templateId?: string | undefined;
    templateKey?: "ROAD_TRIP" | "MOTORCYCLE_EXPEDITION" | "WEEKEND_GETAWAY" | "BEACH_HOLIDAY" | "HIKING_CAMPING" | undefined;
}>;
export declare const createVehicleSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodDefault<z.ZodNativeEnum<typeof VehicleType>>;
    make: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    model: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    year: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    registrationNumber: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fuelType: z.ZodDefault<z.ZodNativeEnum<typeof FuelType>>;
    tankCapacityLiters: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    initialOdometer: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    currentOdometer: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    tripId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    type: VehicleType;
    name: string;
    fuelType: FuelType;
    make?: string | null | undefined;
    model?: string | null | undefined;
    year?: number | null | undefined;
    registrationNumber?: string | null | undefined;
    tankCapacityLiters?: number | null | undefined;
    initialOdometer?: number | null | undefined;
    currentOdometer?: number | null | undefined;
    tripId?: string | null | undefined;
}, {
    name: string;
    type?: VehicleType | undefined;
    make?: string | null | undefined;
    model?: string | null | undefined;
    year?: number | null | undefined;
    registrationNumber?: string | null | undefined;
    fuelType?: FuelType | undefined;
    tankCapacityLiters?: number | null | undefined;
    initialOdometer?: number | null | undefined;
    currentOdometer?: number | null | undefined;
    tripId?: string | null | undefined;
}>;
export declare const updateVehicleSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof VehicleType>>>;
    make: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    model: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    year: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    registrationNumber: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    fuelType: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof FuelType>>>;
    tankCapacityLiters: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    initialOdometer: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    currentOdometer: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    tripId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    type?: VehicleType | undefined;
    name?: string | undefined;
    make?: string | null | undefined;
    model?: string | null | undefined;
    year?: number | null | undefined;
    registrationNumber?: string | null | undefined;
    fuelType?: FuelType | undefined;
    tankCapacityLiters?: number | null | undefined;
    initialOdometer?: number | null | undefined;
    currentOdometer?: number | null | undefined;
    tripId?: string | null | undefined;
}, {
    type?: VehicleType | undefined;
    name?: string | undefined;
    make?: string | null | undefined;
    model?: string | null | undefined;
    year?: number | null | undefined;
    registrationNumber?: string | null | undefined;
    fuelType?: FuelType | undefined;
    tankCapacityLiters?: number | null | undefined;
    initialOdometer?: number | null | undefined;
    currentOdometer?: number | null | undefined;
    tripId?: string | null | undefined;
}>;
export declare const createFuelLogSchema: z.ZodObject<{
    vehicleId: z.ZodString;
    date: z.ZodOptional<z.ZodString>;
    odometer: z.ZodNumber;
    litersOrKwh: z.ZodNumber;
    cost: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "THB", "JPY", "MYR", "IDR", "PHP", "VND", "KRW", "CHF", "SEK", "NOK", "DKK", "NZD"]>>;
    isFullTank: z.ZodDefault<z.ZodBoolean>;
    fuelPricePerUnit: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    stationLocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    currency: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD";
    cost: number;
    vehicleId: string;
    odometer: number;
    litersOrKwh: number;
    isFullTank: boolean;
    date?: string | undefined;
    notes?: string | null | undefined;
    fuelPricePerUnit?: number | null | undefined;
    stationLocation?: string | null | undefined;
}, {
    cost: number;
    vehicleId: string;
    odometer: number;
    litersOrKwh: number;
    date?: string | undefined;
    currency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    notes?: string | null | undefined;
    isFullTank?: boolean | undefined;
    fuelPricePerUnit?: number | null | undefined;
    stationLocation?: string | null | undefined;
}>;
export declare const createInspectionSchema: z.ZodObject<{
    vehicleId: z.ZodString;
    status: z.ZodDefault<z.ZodNativeEnum<typeof InspectionStatus>>;
    checklist: z.ZodRecord<z.ZodString, z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    odometer: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    status: InspectionStatus;
    vehicleId: string;
    checklist: Record<string, boolean>;
    notes?: string | null | undefined;
    odometer?: number | null | undefined;
}, {
    vehicleId: string;
    checklist: Record<string, boolean>;
    status?: InspectionStatus | undefined;
    notes?: string | null | undefined;
    odometer?: number | null | undefined;
}>;
export declare const expenseSplitItemSchema: z.ZodObject<{
    userId: z.ZodString;
    amount: z.ZodNumber;
    percentage: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    amount: number;
    percentage?: number | undefined;
}, {
    userId: string;
    amount: number;
    percentage?: number | undefined;
}>;
export declare const createExpenseSchema: z.ZodObject<{
    title: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "THB", "JPY", "MYR", "IDR", "PHP", "VND", "KRW", "CHF", "SEK", "NOK", "DKK", "NZD"]>>;
    category: z.ZodDefault<z.ZodNativeEnum<typeof ExpenseCategory>>;
    paymentMethod: z.ZodDefault<z.ZodNativeEnum<typeof PaymentMethod>>;
    date: z.ZodOptional<z.ZodString>;
    paidById: z.ZodOptional<z.ZodString>;
    splitType: z.ZodDefault<z.ZodNativeEnum<typeof ExpenseSplitType>>;
    splits: z.ZodOptional<z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        amount: z.ZodNumber;
        percentage: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        amount: number;
        percentage?: number | undefined;
    }, {
        userId: string;
        amount: number;
        percentage?: number | undefined;
    }>, "many">>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    receiptUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    currency: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD";
    title: string;
    category: ExpenseCategory;
    amount: number;
    paymentMethod: PaymentMethod;
    splitType: ExpenseSplitType;
    date?: string | undefined;
    notes?: string | null | undefined;
    paidById?: string | undefined;
    splits?: {
        userId: string;
        amount: number;
        percentage?: number | undefined;
    }[] | undefined;
    receiptUrl?: string | null | undefined;
}, {
    title: string;
    amount: number;
    date?: string | undefined;
    currency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    notes?: string | null | undefined;
    category?: ExpenseCategory | undefined;
    paymentMethod?: PaymentMethod | undefined;
    paidById?: string | undefined;
    splitType?: ExpenseSplitType | undefined;
    splits?: {
        userId: string;
        amount: number;
        percentage?: number | undefined;
    }[] | undefined;
    receiptUrl?: string | null | undefined;
}>;
export declare const updateExpenseSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodDefault<z.ZodEnum<["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "THB", "JPY", "MYR", "IDR", "PHP", "VND", "KRW", "CHF", "SEK", "NOK", "DKK", "NZD"]>>>;
    category: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof ExpenseCategory>>>;
    paymentMethod: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof PaymentMethod>>>;
    date: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    paidById: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    splitType: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof ExpenseSplitType>>>;
    splits: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        amount: z.ZodNumber;
        percentage: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        amount: number;
        percentage?: number | undefined;
    }, {
        userId: string;
        amount: number;
        percentage?: number | undefined;
    }>, "many">>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    receiptUrl: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    date?: string | undefined;
    currency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    title?: string | undefined;
    notes?: string | null | undefined;
    category?: ExpenseCategory | undefined;
    amount?: number | undefined;
    paymentMethod?: PaymentMethod | undefined;
    paidById?: string | undefined;
    splitType?: ExpenseSplitType | undefined;
    splits?: {
        userId: string;
        amount: number;
        percentage?: number | undefined;
    }[] | undefined;
    receiptUrl?: string | null | undefined;
}, {
    date?: string | undefined;
    currency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    title?: string | undefined;
    notes?: string | null | undefined;
    category?: ExpenseCategory | undefined;
    amount?: number | undefined;
    paymentMethod?: PaymentMethod | undefined;
    paidById?: string | undefined;
    splitType?: ExpenseSplitType | undefined;
    splits?: {
        userId: string;
        amount: number;
        percentage?: number | undefined;
    }[] | undefined;
    receiptUrl?: string | null | undefined;
}>;
export declare const settleExpenseSplitSchema: z.ZodObject<{
    splitId: z.ZodString;
    isSettled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    splitId: string;
    isSettled: boolean;
}, {
    splitId: string;
    isSettled?: boolean | undefined;
}>;
export declare const createAccommodationSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodDefault<z.ZodNativeEnum<typeof BookingType>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkInDate: z.ZodString;
    checkOutDate: z.ZodString;
    checkInTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    checkOutTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    confirmationCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    totalCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    currency: z.ZodDefault<z.ZodEnum<["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "THB", "JPY", "MYR", "IDR", "PHP", "VND", "KRW", "CHF", "SEK", "NOK", "DKK", "NZD"]>>;
    contactPhone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    contactEmail: z.ZodUnion<[z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodLiteral<"">]>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bookingStatus: z.ZodDefault<z.ZodNativeEnum<typeof BookingStatus>>;
}, "strip", z.ZodTypeAny, {
    type: BookingType;
    name: string;
    currency: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD";
    checkInDate: string;
    checkOutDate: string;
    bookingStatus: BookingStatus;
    notes?: string | null | undefined;
    location?: string | null | undefined;
    checkInTime?: string | null | undefined;
    checkOutTime?: string | null | undefined;
    confirmationCode?: string | null | undefined;
    totalCost?: number | null | undefined;
    contactPhone?: string | null | undefined;
    contactEmail?: string | null | undefined;
}, {
    name: string;
    checkInDate: string;
    checkOutDate: string;
    type?: BookingType | undefined;
    currency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    notes?: string | null | undefined;
    location?: string | null | undefined;
    checkInTime?: string | null | undefined;
    checkOutTime?: string | null | undefined;
    confirmationCode?: string | null | undefined;
    totalCost?: number | null | undefined;
    contactPhone?: string | null | undefined;
    contactEmail?: string | null | undefined;
    bookingStatus?: BookingStatus | undefined;
}>;
export declare const updateAccommodationSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof BookingType>>>;
    location: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    checkInDate: z.ZodOptional<z.ZodString>;
    checkOutDate: z.ZodOptional<z.ZodString>;
    checkInTime: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    checkOutTime: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    confirmationCode: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    totalCost: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    currency: z.ZodOptional<z.ZodDefault<z.ZodEnum<["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "THB", "JPY", "MYR", "IDR", "PHP", "VND", "KRW", "CHF", "SEK", "NOK", "DKK", "NZD"]>>>;
    contactPhone: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    contactEmail: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodLiteral<"">]>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    bookingStatus: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof BookingStatus>>>;
}, "strip", z.ZodTypeAny, {
    type?: BookingType | undefined;
    name?: string | undefined;
    currency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    notes?: string | null | undefined;
    location?: string | null | undefined;
    checkInDate?: string | undefined;
    checkOutDate?: string | undefined;
    checkInTime?: string | null | undefined;
    checkOutTime?: string | null | undefined;
    confirmationCode?: string | null | undefined;
    totalCost?: number | null | undefined;
    contactPhone?: string | null | undefined;
    contactEmail?: string | null | undefined;
    bookingStatus?: BookingStatus | undefined;
}, {
    type?: BookingType | undefined;
    name?: string | undefined;
    currency?: "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED" | "THB" | "JPY" | "MYR" | "IDR" | "PHP" | "VND" | "KRW" | "CHF" | "SEK" | "NOK" | "DKK" | "NZD" | undefined;
    notes?: string | null | undefined;
    location?: string | null | undefined;
    checkInDate?: string | undefined;
    checkOutDate?: string | undefined;
    checkInTime?: string | null | undefined;
    checkOutTime?: string | null | undefined;
    confirmationCode?: string | null | undefined;
    totalCost?: number | null | undefined;
    contactPhone?: string | null | undefined;
    contactEmail?: string | null | undefined;
    bookingStatus?: BookingStatus | undefined;
}>;
export declare const createDocumentSchema: z.ZodObject<{
    title: z.ZodString;
    documentType: z.ZodDefault<z.ZodNativeEnum<typeof DocumentType>>;
    fileUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fileName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fileSize: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    expiryDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isShared: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    isShared: boolean;
    documentType: DocumentType;
    notes?: string | null | undefined;
    fileUrl?: string | null | undefined;
    fileName?: string | null | undefined;
    fileSize?: number | null | undefined;
    expiryDate?: string | null | undefined;
}, {
    title: string;
    notes?: string | null | undefined;
    isShared?: boolean | undefined;
    documentType?: DocumentType | undefined;
    fileUrl?: string | null | undefined;
    fileName?: string | null | undefined;
    fileSize?: number | null | undefined;
    expiryDate?: string | null | undefined;
}>;
export declare const updateDocumentSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    documentType: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof DocumentType>>>;
    fileUrl: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    fileName: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    fileSize: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    expiryDate: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    isShared: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    notes?: string | null | undefined;
    isShared?: boolean | undefined;
    documentType?: DocumentType | undefined;
    fileUrl?: string | null | undefined;
    fileName?: string | null | undefined;
    fileSize?: number | null | undefined;
    expiryDate?: string | null | undefined;
}, {
    title?: string | undefined;
    notes?: string | null | undefined;
    isShared?: boolean | undefined;
    documentType?: DocumentType | undefined;
    fileUrl?: string | null | undefined;
    fileName?: string | null | undefined;
    fileSize?: number | null | undefined;
    expiryDate?: string | null | undefined;
}>;
export declare const generateItinerarySchema: z.ZodObject<{
    destination: z.ZodString;
    origin: z.ZodOptional<z.ZodString>;
    daysCount: z.ZodDefault<z.ZodNumber>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    tripType: z.ZodDefault<z.ZodNativeEnum<typeof TripType>>;
    travelPace: z.ZodDefault<z.ZodEnum<["RELAXED", "MODERATE", "PACKED"]>>;
    budget: z.ZodDefault<z.ZodEnum<["BUDGET", "MODERATE", "LUXURY"]>>;
    interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    preferences: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tripType: TripType;
    destination: string;
    daysCount: number;
    travelPace: "PACKED" | "RELAXED" | "MODERATE";
    budget: "MODERATE" | "BUDGET" | "LUXURY";
    interests?: string[] | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    origin?: string | undefined;
    preferences?: string | undefined;
}, {
    destination: string;
    interests?: string[] | undefined;
    tripType?: TripType | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    origin?: string | undefined;
    daysCount?: number | undefined;
    travelPace?: "PACKED" | "RELAXED" | "MODERATE" | undefined;
    budget?: "MODERATE" | "BUDGET" | "LUXURY" | undefined;
    preferences?: string | undefined;
}>;
export declare const applyAIItinerarySchema: z.ZodObject<{
    tripId: z.ZodString;
    itinerary: z.ZodObject<{
        tripTitle: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        highlights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        days: z.ZodArray<z.ZodObject<{
            dayNumber: z.ZodNumber;
            title: z.ZodString;
            startLocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            endLocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            stops: z.ZodArray<z.ZodObject<{
                title: z.ZodString;
                itemType: z.ZodDefault<z.ZodNativeEnum<typeof ItineraryItemType>>;
                location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                plannedStartTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                plannedEndTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                plannedDistanceKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                flexibility: z.ZodDefault<z.ZodNativeEnum<typeof ActivityFlexibility>>;
                isOptional: z.ZodDefault<z.ZodBoolean>;
                notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, "strip", z.ZodTypeAny, {
                title: string;
                itemType: ItineraryItemType;
                flexibility: ActivityFlexibility;
                isOptional: boolean;
                plannedDistanceKm?: number | null | undefined;
                notes?: string | null | undefined;
                location?: string | null | undefined;
                plannedStartTime?: string | null | undefined;
                plannedEndTime?: string | null | undefined;
            }, {
                title: string;
                plannedDistanceKm?: number | null | undefined;
                notes?: string | null | undefined;
                itemType?: ItineraryItemType | undefined;
                location?: string | null | undefined;
                flexibility?: ActivityFlexibility | undefined;
                isOptional?: boolean | undefined;
                plannedStartTime?: string | null | undefined;
                plannedEndTime?: string | null | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            dayNumber: number;
            title: string;
            stops: {
                title: string;
                itemType: ItineraryItemType;
                flexibility: ActivityFlexibility;
                isOptional: boolean;
                plannedDistanceKm?: number | null | undefined;
                notes?: string | null | undefined;
                location?: string | null | undefined;
                plannedStartTime?: string | null | undefined;
                plannedEndTime?: string | null | undefined;
            }[];
            startLocation?: string | null | undefined;
            endLocation?: string | null | undefined;
            notes?: string | null | undefined;
        }, {
            dayNumber: number;
            title: string;
            stops: {
                title: string;
                plannedDistanceKm?: number | null | undefined;
                notes?: string | null | undefined;
                itemType?: ItineraryItemType | undefined;
                location?: string | null | undefined;
                flexibility?: ActivityFlexibility | undefined;
                isOptional?: boolean | undefined;
                plannedStartTime?: string | null | undefined;
                plannedEndTime?: string | null | undefined;
            }[];
            startLocation?: string | null | undefined;
            endLocation?: string | null | undefined;
            notes?: string | null | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        days: {
            dayNumber: number;
            title: string;
            stops: {
                title: string;
                itemType: ItineraryItemType;
                flexibility: ActivityFlexibility;
                isOptional: boolean;
                plannedDistanceKm?: number | null | undefined;
                notes?: string | null | undefined;
                location?: string | null | undefined;
                plannedStartTime?: string | null | undefined;
                plannedEndTime?: string | null | undefined;
            }[];
            startLocation?: string | null | undefined;
            endLocation?: string | null | undefined;
            notes?: string | null | undefined;
        }[];
        tripTitle?: string | undefined;
        summary?: string | undefined;
        highlights?: string[] | undefined;
    }, {
        days: {
            dayNumber: number;
            title: string;
            stops: {
                title: string;
                plannedDistanceKm?: number | null | undefined;
                notes?: string | null | undefined;
                itemType?: ItineraryItemType | undefined;
                location?: string | null | undefined;
                flexibility?: ActivityFlexibility | undefined;
                isOptional?: boolean | undefined;
                plannedStartTime?: string | null | undefined;
                plannedEndTime?: string | null | undefined;
            }[];
            startLocation?: string | null | undefined;
            endLocation?: string | null | undefined;
            notes?: string | null | undefined;
        }[];
        tripTitle?: string | undefined;
        summary?: string | undefined;
        highlights?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    tripId: string;
    itinerary: {
        days: {
            dayNumber: number;
            title: string;
            stops: {
                title: string;
                itemType: ItineraryItemType;
                flexibility: ActivityFlexibility;
                isOptional: boolean;
                plannedDistanceKm?: number | null | undefined;
                notes?: string | null | undefined;
                location?: string | null | undefined;
                plannedStartTime?: string | null | undefined;
                plannedEndTime?: string | null | undefined;
            }[];
            startLocation?: string | null | undefined;
            endLocation?: string | null | undefined;
            notes?: string | null | undefined;
        }[];
        tripTitle?: string | undefined;
        summary?: string | undefined;
        highlights?: string[] | undefined;
    };
}, {
    tripId: string;
    itinerary: {
        days: {
            dayNumber: number;
            title: string;
            stops: {
                title: string;
                plannedDistanceKm?: number | null | undefined;
                notes?: string | null | undefined;
                itemType?: ItineraryItemType | undefined;
                location?: string | null | undefined;
                flexibility?: ActivityFlexibility | undefined;
                isOptional?: boolean | undefined;
                plannedStartTime?: string | null | undefined;
                plannedEndTime?: string | null | undefined;
            }[];
            startLocation?: string | null | undefined;
            endLocation?: string | null | undefined;
            notes?: string | null | undefined;
        }[];
        tripTitle?: string | undefined;
        summary?: string | undefined;
        highlights?: string[] | undefined;
    };
}>;
export declare const generatePackingSchema: z.ZodObject<{
    destination: z.ZodString;
    tripType: z.ZodDefault<z.ZodNativeEnum<typeof TripType>>;
    daysCount: z.ZodDefault<z.ZodNumber>;
    climate: z.ZodOptional<z.ZodString>;
    includeRidingGear: z.ZodDefault<z.ZodBoolean>;
    tripId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tripType: TripType;
    destination: string;
    daysCount: number;
    includeRidingGear: boolean;
    tripId?: string | undefined;
    climate?: string | undefined;
}, {
    destination: string;
    tripType?: TripType | undefined;
    tripId?: string | undefined;
    daysCount?: number | undefined;
    climate?: string | undefined;
    includeRidingGear?: boolean | undefined;
}>;
export declare const applyAIPackingSchema: z.ZodObject<{
    tripId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        category: z.ZodNativeEnum<typeof PackingCategory>;
        quantity: z.ZodDefault<z.ZodNumber>;
        isRequired: z.ZodDefault<z.ZodBoolean>;
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        category: PackingCategory;
        quantity: number;
        isRequired: boolean;
        notes?: string | null | undefined;
    }, {
        name: string;
        category: PackingCategory;
        notes?: string | null | undefined;
        quantity?: number | undefined;
        isRequired?: boolean | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        name: string;
        category: PackingCategory;
        quantity: number;
        isRequired: boolean;
        notes?: string | null | undefined;
    }[];
    tripId: string;
}, {
    items: {
        name: string;
        category: PackingCategory;
        notes?: string | null | undefined;
        quantity?: number | undefined;
        isRequired?: boolean | undefined;
    }[];
    tripId: string;
}>;
export declare const chatCopilotSchema: z.ZodObject<{
    message: z.ZodString;
    history: z.ZodOptional<z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "assistant", "system"]>;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: "user" | "assistant" | "system";
        content: string;
    }, {
        role: "user" | "assistant" | "system";
        content: string;
    }>, "many">>;
    tripId: z.ZodOptional<z.ZodString>;
    tripContext: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    message: string;
    tripId?: string | undefined;
    history?: {
        role: "user" | "assistant" | "system";
        content: string;
    }[] | undefined;
    tripContext?: Record<string, any> | undefined;
}, {
    message: string;
    tripId?: string | undefined;
    history?: {
        role: "user" | "assistant" | "system";
        content: string;
    }[] | undefined;
    tripContext?: Record<string, any> | undefined;
}>;
export declare const startRideSessionSchema: z.ZodObject<{
    tripId: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    tripId: string;
}, {
    name: string;
    tripId: string;
}>;
export declare const updateRiderLocationSchema: z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    altitude: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    speedKmh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    headingDeg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    batteryPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    latitude: number;
    longitude: number;
    altitude?: number | null | undefined;
    speedKmh?: number | null | undefined;
    headingDeg?: number | null | undefined;
    batteryPercent?: number | null | undefined;
}, {
    latitude: number;
    longitude: number;
    altitude?: number | null | undefined;
    speedKmh?: number | null | undefined;
    headingDeg?: number | null | undefined;
    batteryPercent?: number | null | undefined;
}>;
export declare const sendCrewPingSchema: z.ZodObject<{
    tripId: z.ZodString;
    pingType: z.ZodDefault<z.ZodNativeEnum<typeof PingType>>;
    message: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodNumber>;
    longitude: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    tripId: string;
    pingType: PingType;
    message?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
}, {
    tripId: string;
    message?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    pingType?: PingType | undefined;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type CreateItineraryDayInput = z.infer<typeof createItineraryDaySchema>;
export type UpdateItineraryDayInput = z.infer<typeof updateItineraryDaySchema>;
export type BatchGenerateDaysInput = z.infer<typeof batchGenerateDaysSchema>;
export type CreateItineraryItemInput = z.infer<typeof createItineraryItemSchema>;
export type UpdateItineraryItemInput = z.infer<typeof updateItineraryItemSchema>;
export type ReorderItineraryItemsInput = z.infer<typeof reorderItineraryItemsSchema>;
export type CreatePackingListInput = z.infer<typeof createPackingListSchema>;
export type UpdatePackingListInput = z.infer<typeof updatePackingListSchema>;
export type CreateLuggageBagInput = z.infer<typeof createLuggageBagSchema>;
export type UpdateLuggageBagInput = z.infer<typeof updateLuggageBagSchema>;
export type CreatePackingItemInput = z.infer<typeof createPackingItemSchema>;
export type UpdatePackingItemInput = z.infer<typeof updatePackingItemSchema>;
export type BatchUpdateItemStatusInput = z.infer<typeof batchUpdateItemStatusSchema>;
export type ApplyPackingTemplateInput = z.infer<typeof applyPackingTemplateSchema>;
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type CreateFuelLogInput = z.infer<typeof createFuelLogSchema>;
export type CreateInspectionInput = z.infer<typeof createInspectionSchema>;
export type ExpenseSplitItem = z.infer<typeof expenseSplitItemSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type SettleExpenseSplitInput = z.infer<typeof settleExpenseSplitSchema>;
export type CreateAccommodationInput = z.infer<typeof createAccommodationSchema>;
export type UpdateAccommodationInput = z.infer<typeof updateAccommodationSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type GenerateItineraryInput = z.infer<typeof generateItinerarySchema>;
export type ApplyAIItineraryInput = z.infer<typeof applyAIItinerarySchema>;
export type GeneratePackingInput = z.infer<typeof generatePackingSchema>;
export type ApplyAIPackingInput = z.infer<typeof applyAIPackingSchema>;
export type ChatCopilotInput = z.infer<typeof chatCopilotSchema>;
export type StartRideSessionInput = z.infer<typeof startRideSessionSchema>;
export type UpdateRiderLocationInput = z.infer<typeof updateRiderLocationSchema>;
export type SendCrewPingInput = z.infer<typeof sendCrewPingSchema>;
export declare const createJournalEntrySchema: z.ZodObject<{
    dayNumber: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    title: z.ZodString;
    content: z.ZodString;
    location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    mood: z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof JournalMood>>>;
    weatherNote: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    mediaUrls: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    mediaUrls: string[];
    dayNumber?: number | null | undefined;
    location?: string | null | undefined;
    mood?: JournalMood | null | undefined;
    weatherNote?: string | null | undefined;
}, {
    title: string;
    content: string;
    dayNumber?: number | null | undefined;
    location?: string | null | undefined;
    mood?: JournalMood | null | undefined;
    weatherNote?: string | null | undefined;
    mediaUrls?: string[] | undefined;
}>;
export declare const updateJournalEntrySchema: z.ZodObject<{
    dayNumber: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    mood: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNativeEnum<typeof JournalMood>>>>;
    weatherNote: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    mediaUrls: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    dayNumber?: number | null | undefined;
    title?: string | undefined;
    location?: string | null | undefined;
    content?: string | undefined;
    mood?: JournalMood | null | undefined;
    weatherNote?: string | null | undefined;
    mediaUrls?: string[] | undefined;
}, {
    dayNumber?: number | null | undefined;
    title?: string | undefined;
    location?: string | null | undefined;
    content?: string | undefined;
    mood?: JournalMood | null | undefined;
    weatherNote?: string | null | undefined;
    mediaUrls?: string[] | undefined;
}>;
export declare const createTripHighlightSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    category: z.ZodDefault<z.ZodNativeEnum<typeof HighlightCategory>>;
    location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    rating: z.ZodDefault<z.ZodNumber>;
    photoUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    category: HighlightCategory;
    rating: number;
    description?: string | null | undefined;
    location?: string | null | undefined;
    photoUrl?: string | null | undefined;
}, {
    title: string;
    description?: string | null | undefined;
    location?: string | null | undefined;
    category?: HighlightCategory | undefined;
    rating?: number | undefined;
    photoUrl?: string | null | undefined;
}>;
export declare const updateTripHighlightSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    category: z.ZodOptional<z.ZodDefault<z.ZodNativeEnum<typeof HighlightCategory>>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    rating: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    photoUrl: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    description?: string | null | undefined;
    title?: string | undefined;
    location?: string | null | undefined;
    category?: HighlightCategory | undefined;
    rating?: number | undefined;
    photoUrl?: string | null | undefined;
}, {
    description?: string | null | undefined;
    title?: string | undefined;
    location?: string | null | undefined;
    category?: HighlightCategory | undefined;
    rating?: number | undefined;
    photoUrl?: string | null | undefined;
}>;
export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;
export type UpdateJournalEntryInput = z.infer<typeof updateJournalEntrySchema>;
export type CreateTripHighlightInput = z.infer<typeof createTripHighlightSchema>;
export type UpdateTripHighlightInput = z.infer<typeof updateTripHighlightSchema>;
//# sourceMappingURL=index.d.ts.map