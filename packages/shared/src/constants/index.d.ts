export declare enum TripStatus {
    DRAFT = "DRAFT",
    PLANNED = "PLANNED",
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    ARCHIVED = "ARCHIVED"
}
export declare enum TripType {
    SOLO = "SOLO",
    GROUP = "GROUP",
    MOTORCYCLE = "MOTORCYCLE",
    CAR_ROAD_TRIP = "CAR_ROAD_TRIP",
    MULTI_VEHICLE = "MULTI_VEHICLE",
    FAMILY = "FAMILY",
    PUBLIC_TRANSPORT = "PUBLIC_TRANSPORT",
    MULTI_CITY = "MULTI_CITY",
    ONE_WAY = "ONE_WAY",
    ROUND_TRIP = "ROUND_TRIP",
    WEEKEND = "WEEKEND",
    LONG_DURATION = "LONG_DURATION"
}
export declare enum TransportMode {
    MOTORCYCLE = "MOTORCYCLE",
    CAR = "CAR",
    BUS = "BUS",
    TRAIN = "TRAIN",
    FLIGHT = "FLIGHT",
    BICYCLE = "BICYCLE",
    WALKING = "WALKING",
    FERRY = "FERRY",
    OTHER = "OTHER"
}
export declare enum TripRole {
    OWNER = "OWNER",
    LEADER = "LEADER",
    MEMBER = "MEMBER",
    VIEWER = "VIEWER"
}
export declare enum TripVisibility {
    PRIVATE = "PRIVATE",
    MEMBERS_ONLY = "MEMBERS_ONLY",
    INVITE_LINK = "INVITE_LINK"
}
export declare enum InvitationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED",
    EXPIRED = "EXPIRED",
    REVOKED = "REVOKED"
}
export declare enum PackingStatus {
    NOT_PACKED = "NOT_PACKED",
    PACKED = "PACKED",
    WORN = "WORN",
    DIRTY = "DIRTY",
    WASHED = "WASHED",
    MISSING = "MISSING",
    UNPACKED = "UNPACKED"
}
export declare enum PackingCategory {
    TOPS = "TOPS",
    BOTTOMS = "BOTTOMS",
    INNERWEAR = "INNERWEAR",
    SLEEPWEAR = "SLEEPWEAR",
    FOOTWEAR = "FOOTWEAR",
    WEATHER_LAYERS = "WEATHER_LAYERS",
    MOTORCYCLE_GEAR = "MOTORCYCLE_GEAR",
    TOILETRIES = "TOILETRIES",
    MEDICINES = "MEDICINES",
    ELECTRONICS = "ELECTRONICS",
    DOCUMENTS = "DOCUMENTS",
    FOOD_WATER = "FOOD_WATER",
    CAMPING = "CAMPING",
    MISCELLANEOUS = "MISCELLANEOUS"
}
export declare enum LuggageBagType {
    BACKPACK = "BACKPACK",
    SUITCASE = "SUITCASE",
    DUFFEL = "DUFFEL",
    SADDLEBAGS = "SADDLEBAGS",
    TANK_BAG = "TANK_BAG",
    TOP_BOX = "TOP_BOX",
    DAYPACK = "DAYPACK",
    OTHER = "OTHER"
}
export declare enum VehicleType {
    MOTORCYCLE = "MOTORCYCLE",
    CAR = "CAR",
    SUV = "SUV",
    VAN = "VAN",
    BICYCLE = "BICYCLE",
    RENTAL = "RENTAL",
    OTHER = "OTHER"
}
export declare enum FuelType {
    PETROL = "PETROL",
    DIESEL = "DIESEL",
    ELECTRIC = "ELECTRIC",
    HYBRID = "HYBRID",
    CNG = "CNG",
    OTHER = "OTHER"
}
export declare enum ExpenseCategory {
    FUEL = "FUEL",
    ACCOMMODATION = "ACCOMMODATION",
    FOOD = "FOOD",
    TOLLS = "TOLLS",
    PARKING = "PARKING",
    TICKETS = "TICKETS",
    VEHICLE_RENTAL = "VEHICLE_RENTAL",
    REPAIRS = "REPAIRS",
    SHOPPING = "SHOPPING",
    CONNECTIVITY = "CONNECTIVITY",
    MISCELLANEOUS = "MISCELLANEOUS"
}
export declare enum PaymentMethod {
    CASH = "CASH",
    UPI = "UPI",
    CARD = "CARD",
    BANK_TRANSFER = "BANK_TRANSFER",
    OTHER = "OTHER"
}
export declare enum ItineraryItemType {
    ACTIVITY = "ACTIVITY",
    MEAL = "MEAL",
    FUEL_STOP = "FUEL_STOP",
    REST = "REST",
    SIGHTSEEING = "SIGHTSEEING",
    CHECK_IN = "CHECK_IN",
    CHECK_OUT = "CHECK_OUT",
    TRAVEL = "TRAVEL",
    OTHER = "OTHER"
}
export declare enum ActivityFlexibility {
    FIXED = "FIXED",
    FLEXIBLE = "FLEXIBLE"
}
export declare enum BookingType {
    HOTEL = "HOTEL",
    HOSTEL = "HOSTEL",
    HOMESTAY = "HOMESTAY",
    CAMPSITE = "CAMPSITE",
    GUESTHOUSE = "GUESTHOUSE",
    FLIGHT = "FLIGHT",
    TRAIN = "TRAIN",
    BUS = "BUS",
    ATTRACTION = "ATTRACTION",
    ACTIVITY = "ACTIVITY",
    OTHER = "OTHER"
}
export declare enum BookingStatus {
    CONFIRMED = "CONFIRMED",
    TENTATIVE = "TENTATIVE",
    CANCELLED = "CANCELLED"
}
export declare enum DocumentType {
    DRIVING_LICENSE = "DRIVING_LICENSE",
    VEHICLE_RC = "VEHICLE_RC",
    INSURANCE_POLICY = "INSURANCE_POLICY",
    PUC_CERTIFICATE = "PUC_CERTIFICATE",
    HOTEL_VOUCHER = "HOTEL_VOUCHER",
    TICKETS = "TICKETS",
    PERMIT = "PERMIT",
    ID_PROOF = "ID_PROOF",
    PASSPORT = "PASSPORT",
    OTHER = "OTHER"
}
export declare enum SettlementStatus {
    PENDING = "PENDING",
    SETTLED = "SETTLED"
}
export declare enum ExpenseSplitType {
    EQUAL = "EQUAL",
    EXACT = "EXACT",
    PERCENTAGE = "PERCENTAGE"
}
export declare enum InspectionStatus {
    PASSED = "PASSED",
    ATTENTION_NEEDED = "ATTENTION_NEEDED",
    FAILED = "FAILED"
}
export declare enum RideSessionStatus {
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    ENDED = "ENDED"
}
export declare enum PingType {
    REGROUP = "REGROUP",
    MECHANICAL_STOP = "MECHANICAL_STOP",
    FUEL_STOP = "FUEL_STOP",
    PHOTO_STOP = "PHOTO_STOP",
    SOS_EMERGENCY = "SOS_EMERGENCY",
    CUSTOM = "CUSTOM"
}
export declare enum JournalMood {
    EXCELLENT = "EXCELLENT",
    ADVENTUROUS = "ADVENTUROUS",
    TIRED = "TIRED",
    PEACEFUL = "PEACEFUL",
    CHALLENGING = "CHALLENGING"
}
export declare enum HighlightCategory {
    SCENIC_VIEW = "SCENIC_VIEW",
    FOOD_SPOT = "FOOD_SPOT",
    EPIC_RIDE = "EPIC_RIDE",
    CULTURE = "CULTURE",
    SUNSET = "SUNSET",
    WILDLIFE = "WILDLIFE",
    OTHER = "OTHER"
}
export declare const SUPPORTED_CURRENCIES: readonly ["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED", "THB", "JPY", "MYR", "IDR", "PHP", "VND", "KRW", "CHF", "SEK", "NOK", "DKK", "NZD"];
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
export declare enum ErrorCode {
    VALIDATION_ERROR = "VALIDATION_ERROR",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    NOT_FOUND = "NOT_FOUND",
    CONFLICT = "CONFLICT",
    RATE_LIMITED = "RATE_LIMITED",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    BAD_REQUEST = "BAD_REQUEST"
}
export declare const DEFAULT_PAGE_SIZE = 20;
export declare const MAX_PAGE_SIZE = 100;
//# sourceMappingURL=index.d.ts.map