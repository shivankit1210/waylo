// ============================================================
// Waylo — Shared Constants (Enums & Categories)
// ============================================================

// ─── Trip Status Lifecycle ──────────────────────────────────
export enum TripStatus {
  DRAFT = 'DRAFT',
  PLANNED = 'PLANNED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED',
}

// ─── Trip Type ──────────────────────────────────────────────
export enum TripType {
  SOLO = 'SOLO',
  GROUP = 'GROUP',
  MOTORCYCLE = 'MOTORCYCLE',
  CAR_ROAD_TRIP = 'CAR_ROAD_TRIP',
  MULTI_VEHICLE = 'MULTI_VEHICLE',
  FAMILY = 'FAMILY',
  PUBLIC_TRANSPORT = 'PUBLIC_TRANSPORT',
  MULTI_CITY = 'MULTI_CITY',
  ONE_WAY = 'ONE_WAY',
  ROUND_TRIP = 'ROUND_TRIP',
  WEEKEND = 'WEEKEND',
  LONG_DURATION = 'LONG_DURATION',
}

// ─── Transport Mode ─────────────────────────────────────────
export enum TransportMode {
  MOTORCYCLE = 'MOTORCYCLE',
  CAR = 'CAR',
  BUS = 'BUS',
  TRAIN = 'TRAIN',
  FLIGHT = 'FLIGHT',
  BICYCLE = 'BICYCLE',
  WALKING = 'WALKING',
  FERRY = 'FERRY',
  OTHER = 'OTHER',
}

// ─── Trip Member Roles ──────────────────────────────────────
export enum TripRole {
  OWNER = 'OWNER',
  LEADER = 'LEADER',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

// ─── Trip Visibility ────────────────────────────────────────
export enum TripVisibility {
  PRIVATE = 'PRIVATE',
  MEMBERS_ONLY = 'MEMBERS_ONLY',
  INVITE_LINK = 'INVITE_LINK',
}

// ─── Invitation Status ──────────────────────────────────────
export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}

// ─── Packing Item Status ────────────────────────────────────
export enum PackingStatus {
  NOT_PACKED = 'NOT_PACKED',
  PACKED = 'PACKED',
  WORN = 'WORN',
  DIRTY = 'DIRTY',
  WASHED = 'WASHED',
  MISSING = 'MISSING',
  UNPACKED = 'UNPACKED',
}

// ─── Packing Categories ────────────────────────────────────
export enum PackingCategory {
  TOPS = 'TOPS',
  BOTTOMS = 'BOTTOMS',
  INNERWEAR = 'INNERWEAR',
  SLEEPWEAR = 'SLEEPWEAR',
  FOOTWEAR = 'FOOTWEAR',
  WEATHER_LAYERS = 'WEATHER_LAYERS',
  MOTORCYCLE_GEAR = 'MOTORCYCLE_GEAR',
  TOILETRIES = 'TOILETRIES',
  MEDICINES = 'MEDICINES',
  ELECTRONICS = 'ELECTRONICS',
  DOCUMENTS = 'DOCUMENTS',
  FOOD_WATER = 'FOOD_WATER',
  CAMPING = 'CAMPING',
  MISCELLANEOUS = 'MISCELLANEOUS',
}

// ─── Luggage Bag Type ───────────────────────────────────────
export enum LuggageBagType {
  BACKPACK = 'BACKPACK',
  SUITCASE = 'SUITCASE',
  DUFFEL = 'DUFFEL',
  SADDLEBAGS = 'SADDLEBAGS',
  TANK_BAG = 'TANK_BAG',
  TOP_BOX = 'TOP_BOX',
  DAYPACK = 'DAYPACK',
  OTHER = 'OTHER',
}

// ─── Vehicle Type ───────────────────────────────────────────
export enum VehicleType {
  MOTORCYCLE = 'MOTORCYCLE',
  CAR = 'CAR',
  SUV = 'SUV',
  VAN = 'VAN',
  BICYCLE = 'BICYCLE',
  RENTAL = 'RENTAL',
  OTHER = 'OTHER',
}

// ─── Fuel / Energy Type ─────────────────────────────────────
export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
  CNG = 'CNG',
  OTHER = 'OTHER',
}

// ─── Expense Categories ─────────────────────────────────────
export enum ExpenseCategory {
  FUEL = 'FUEL',
  ACCOMMODATION = 'ACCOMMODATION',
  FOOD = 'FOOD',
  TOLLS = 'TOLLS',
  PARKING = 'PARKING',
  TICKETS = 'TICKETS',
  VEHICLE_RENTAL = 'VEHICLE_RENTAL',
  REPAIRS = 'REPAIRS',
  SHOPPING = 'SHOPPING',
  CONNECTIVITY = 'CONNECTIVITY',
  MISCELLANEOUS = 'MISCELLANEOUS',
}

// ─── Payment Methods ────────────────────────────────────────
export enum PaymentMethod {
  CASH = 'CASH',
  UPI = 'UPI',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  OTHER = 'OTHER',
}

// ─── Itinerary Item Type ────────────────────────────────────
export enum ItineraryItemType {
  ACTIVITY = 'ACTIVITY',
  MEAL = 'MEAL',
  FUEL_STOP = 'FUEL_STOP',
  REST = 'REST',
  SIGHTSEEING = 'SIGHTSEEING',
  CHECK_IN = 'CHECK_IN',
  CHECK_OUT = 'CHECK_OUT',
  TRAVEL = 'TRAVEL',
  OTHER = 'OTHER',
}

// ─── Activity Flexibility ───────────────────────────────────
export enum ActivityFlexibility {
  FIXED = 'FIXED',
  FLEXIBLE = 'FLEXIBLE',
}

// ─── Booking Type ───────────────────────────────────────────
export enum BookingType {
  HOTEL = 'HOTEL',
  HOSTEL = 'HOSTEL',
  HOMESTAY = 'HOMESTAY',
  CAMPSITE = 'CAMPSITE',
  GUESTHOUSE = 'GUESTHOUSE',
  FLIGHT = 'FLIGHT',
  TRAIN = 'TRAIN',
  BUS = 'BUS',
  ATTRACTION = 'ATTRACTION',
  ACTIVITY = 'ACTIVITY',
  OTHER = 'OTHER',
}

// ─── Booking Status ─────────────────────────────────────────
export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  TENTATIVE = 'TENTATIVE',
  CANCELLED = 'CANCELLED',
}

// ─── Travel Document Type ───────────────────────────────────
export enum DocumentType {
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  VEHICLE_RC = 'VEHICLE_RC',
  INSURANCE_POLICY = 'INSURANCE_POLICY',
  PUC_CERTIFICATE = 'PUC_CERTIFICATE',
  HOTEL_VOUCHER = 'HOTEL_VOUCHER',
  TICKETS = 'TICKETS',
  PERMIT = 'PERMIT',
  ID_PROOF = 'ID_PROOF',
  PASSPORT = 'PASSPORT',
  OTHER = 'OTHER',
}

// ─── Settlement Status ──────────────────────────────────────
export enum SettlementStatus {
  PENDING = 'PENDING',
  SETTLED = 'SETTLED',
}

// ─── Expense Split Type ─────────────────────────────────────
export enum ExpenseSplitType {
  EQUAL = 'EQUAL',
  EXACT = 'EXACT',
  PERCENTAGE = 'PERCENTAGE',
}

// ─── Vehicle Inspection Status ──────────────────────────────
export enum InspectionStatus {
  PASSED = 'PASSED',
  ATTENTION_NEEDED = 'ATTENTION_NEEDED',
  FAILED = 'FAILED',
}

// ─── Live Ride Session Status ──────────────────────────────
export enum RideSessionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
}

// ─── Crew Ping Alert Type ───────────────────────────────────
export enum PingType {
  REGROUP = 'REGROUP',
  MECHANICAL_STOP = 'MECHANICAL_STOP',
  FUEL_STOP = 'FUEL_STOP',
  PHOTO_STOP = 'PHOTO_STOP',
  SOS_EMERGENCY = 'SOS_EMERGENCY',
  CUSTOM = 'CUSTOM',
}

// ─── Journal Mood ──────────────────────────────────────────
export enum JournalMood {
  EXCELLENT = 'EXCELLENT',
  ADVENTUROUS = 'ADVENTUROUS',
  TIRED = 'TIRED',
  PEACEFUL = 'PEACEFUL',
  CHALLENGING = 'CHALLENGING',
}

// ─── Highlight Category ────────────────────────────────────
export enum HighlightCategory {
  SCENIC_VIEW = 'SCENIC_VIEW',
  FOOD_SPOT = 'FOOD_SPOT',
  EPIC_RIDE = 'EPIC_RIDE',
  CULTURE = 'CULTURE',
  SUNSET = 'SUNSET',
  WILDLIFE = 'WILDLIFE',
  OTHER = 'OTHER',
}

// ─── Currency Codes (common subset) ─────────────────────────
export const SUPPORTED_CURRENCIES = [
  'INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'AED', 'THB', 'JPY',
  'MYR', 'IDR', 'PHP', 'VND', 'KRW', 'CHF', 'SEK', 'NOK', 'DKK', 'NZD',
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

// ─── API Error Codes ────────────────────────────────────────
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
}

// ─── Pagination defaults ────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
