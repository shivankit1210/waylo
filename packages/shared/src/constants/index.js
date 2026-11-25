// ============================================================
// Waylo — Shared Constants (Enums & Categories)
// ============================================================
// ─── Trip Status Lifecycle ──────────────────────────────────
export var TripStatus;
(function (TripStatus) {
    TripStatus["DRAFT"] = "DRAFT";
    TripStatus["PLANNED"] = "PLANNED";
    TripStatus["ONGOING"] = "ONGOING";
    TripStatus["COMPLETED"] = "COMPLETED";
    TripStatus["CANCELLED"] = "CANCELLED";
    TripStatus["ARCHIVED"] = "ARCHIVED";
})(TripStatus || (TripStatus = {}));
// ─── Trip Type ──────────────────────────────────────────────
export var TripType;
(function (TripType) {
    TripType["SOLO"] = "SOLO";
    TripType["GROUP"] = "GROUP";
    TripType["MOTORCYCLE"] = "MOTORCYCLE";
    TripType["CAR_ROAD_TRIP"] = "CAR_ROAD_TRIP";
    TripType["MULTI_VEHICLE"] = "MULTI_VEHICLE";
    TripType["FAMILY"] = "FAMILY";
    TripType["PUBLIC_TRANSPORT"] = "PUBLIC_TRANSPORT";
    TripType["MULTI_CITY"] = "MULTI_CITY";
    TripType["ONE_WAY"] = "ONE_WAY";
    TripType["ROUND_TRIP"] = "ROUND_TRIP";
    TripType["WEEKEND"] = "WEEKEND";
    TripType["LONG_DURATION"] = "LONG_DURATION";
})(TripType || (TripType = {}));
// ─── Transport Mode ─────────────────────────────────────────
export var TransportMode;
(function (TransportMode) {
    TransportMode["MOTORCYCLE"] = "MOTORCYCLE";
    TransportMode["CAR"] = "CAR";
    TransportMode["BUS"] = "BUS";
    TransportMode["TRAIN"] = "TRAIN";
    TransportMode["FLIGHT"] = "FLIGHT";
    TransportMode["BICYCLE"] = "BICYCLE";
    TransportMode["WALKING"] = "WALKING";
    TransportMode["FERRY"] = "FERRY";
    TransportMode["OTHER"] = "OTHER";
})(TransportMode || (TransportMode = {}));
// ─── Trip Member Roles ──────────────────────────────────────
export var TripRole;
(function (TripRole) {
    TripRole["OWNER"] = "OWNER";
    TripRole["LEADER"] = "LEADER";
    TripRole["MEMBER"] = "MEMBER";
    TripRole["VIEWER"] = "VIEWER";
})(TripRole || (TripRole = {}));
// ─── Trip Visibility ────────────────────────────────────────
export var TripVisibility;
(function (TripVisibility) {
    TripVisibility["PRIVATE"] = "PRIVATE";
    TripVisibility["MEMBERS_ONLY"] = "MEMBERS_ONLY";
    TripVisibility["INVITE_LINK"] = "INVITE_LINK";
})(TripVisibility || (TripVisibility = {}));
// ─── Invitation Status ──────────────────────────────────────
export var InvitationStatus;
(function (InvitationStatus) {
    InvitationStatus["PENDING"] = "PENDING";
    InvitationStatus["ACCEPTED"] = "ACCEPTED";
    InvitationStatus["DECLINED"] = "DECLINED";
    InvitationStatus["EXPIRED"] = "EXPIRED";
    InvitationStatus["REVOKED"] = "REVOKED";
})(InvitationStatus || (InvitationStatus = {}));
// ─── Packing Item Status ────────────────────────────────────
export var PackingStatus;
(function (PackingStatus) {
    PackingStatus["NOT_PACKED"] = "NOT_PACKED";
    PackingStatus["PACKED"] = "PACKED";
    PackingStatus["WORN"] = "WORN";
    PackingStatus["DIRTY"] = "DIRTY";
    PackingStatus["WASHED"] = "WASHED";
    PackingStatus["MISSING"] = "MISSING";
    PackingStatus["UNPACKED"] = "UNPACKED";
})(PackingStatus || (PackingStatus = {}));
// ─── Packing Categories ────────────────────────────────────
export var PackingCategory;
(function (PackingCategory) {
    PackingCategory["TOPS"] = "TOPS";
    PackingCategory["BOTTOMS"] = "BOTTOMS";
    PackingCategory["INNERWEAR"] = "INNERWEAR";
    PackingCategory["SLEEPWEAR"] = "SLEEPWEAR";
    PackingCategory["FOOTWEAR"] = "FOOTWEAR";
    PackingCategory["WEATHER_LAYERS"] = "WEATHER_LAYERS";
    PackingCategory["MOTORCYCLE_GEAR"] = "MOTORCYCLE_GEAR";
    PackingCategory["TOILETRIES"] = "TOILETRIES";
    PackingCategory["MEDICINES"] = "MEDICINES";
    PackingCategory["ELECTRONICS"] = "ELECTRONICS";
    PackingCategory["DOCUMENTS"] = "DOCUMENTS";
    PackingCategory["FOOD_WATER"] = "FOOD_WATER";
    PackingCategory["CAMPING"] = "CAMPING";
    PackingCategory["MISCELLANEOUS"] = "MISCELLANEOUS";
})(PackingCategory || (PackingCategory = {}));
// ─── Luggage Bag Type ───────────────────────────────────────
export var LuggageBagType;
(function (LuggageBagType) {
    LuggageBagType["BACKPACK"] = "BACKPACK";
    LuggageBagType["SUITCASE"] = "SUITCASE";
    LuggageBagType["DUFFEL"] = "DUFFEL";
    LuggageBagType["SADDLEBAGS"] = "SADDLEBAGS";
    LuggageBagType["TANK_BAG"] = "TANK_BAG";
    LuggageBagType["TOP_BOX"] = "TOP_BOX";
    LuggageBagType["DAYPACK"] = "DAYPACK";
    LuggageBagType["OTHER"] = "OTHER";
})(LuggageBagType || (LuggageBagType = {}));
// ─── Vehicle Type ───────────────────────────────────────────
export var VehicleType;
(function (VehicleType) {
    VehicleType["MOTORCYCLE"] = "MOTORCYCLE";
    VehicleType["CAR"] = "CAR";
    VehicleType["SUV"] = "SUV";
    VehicleType["VAN"] = "VAN";
    VehicleType["BICYCLE"] = "BICYCLE";
    VehicleType["RENTAL"] = "RENTAL";
    VehicleType["OTHER"] = "OTHER";
})(VehicleType || (VehicleType = {}));
// ─── Fuel / Energy Type ─────────────────────────────────────
export var FuelType;
(function (FuelType) {
    FuelType["PETROL"] = "PETROL";
    FuelType["DIESEL"] = "DIESEL";
    FuelType["ELECTRIC"] = "ELECTRIC";
    FuelType["HYBRID"] = "HYBRID";
    FuelType["CNG"] = "CNG";
    FuelType["OTHER"] = "OTHER";
})(FuelType || (FuelType = {}));
// ─── Expense Categories ─────────────────────────────────────
export var ExpenseCategory;
(function (ExpenseCategory) {
    ExpenseCategory["FUEL"] = "FUEL";
    ExpenseCategory["ACCOMMODATION"] = "ACCOMMODATION";
    ExpenseCategory["FOOD"] = "FOOD";
    ExpenseCategory["TOLLS"] = "TOLLS";
    ExpenseCategory["PARKING"] = "PARKING";
    ExpenseCategory["TICKETS"] = "TICKETS";
    ExpenseCategory["VEHICLE_RENTAL"] = "VEHICLE_RENTAL";
    ExpenseCategory["REPAIRS"] = "REPAIRS";
    ExpenseCategory["SHOPPING"] = "SHOPPING";
    ExpenseCategory["CONNECTIVITY"] = "CONNECTIVITY";
    ExpenseCategory["MISCELLANEOUS"] = "MISCELLANEOUS";
})(ExpenseCategory || (ExpenseCategory = {}));
// ─── Payment Methods ────────────────────────────────────────
export var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["UPI"] = "UPI";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethod["OTHER"] = "OTHER";
})(PaymentMethod || (PaymentMethod = {}));
// ─── Itinerary Item Type ────────────────────────────────────
export var ItineraryItemType;
(function (ItineraryItemType) {
    ItineraryItemType["ACTIVITY"] = "ACTIVITY";
    ItineraryItemType["MEAL"] = "MEAL";
    ItineraryItemType["FUEL_STOP"] = "FUEL_STOP";
    ItineraryItemType["REST"] = "REST";
    ItineraryItemType["SIGHTSEEING"] = "SIGHTSEEING";
    ItineraryItemType["CHECK_IN"] = "CHECK_IN";
    ItineraryItemType["CHECK_OUT"] = "CHECK_OUT";
    ItineraryItemType["TRAVEL"] = "TRAVEL";
    ItineraryItemType["OTHER"] = "OTHER";
})(ItineraryItemType || (ItineraryItemType = {}));
// ─── Activity Flexibility ───────────────────────────────────
export var ActivityFlexibility;
(function (ActivityFlexibility) {
    ActivityFlexibility["FIXED"] = "FIXED";
    ActivityFlexibility["FLEXIBLE"] = "FLEXIBLE";
})(ActivityFlexibility || (ActivityFlexibility = {}));
// ─── Booking Type ───────────────────────────────────────────
export var BookingType;
(function (BookingType) {
    BookingType["HOTEL"] = "HOTEL";
    BookingType["HOSTEL"] = "HOSTEL";
    BookingType["HOMESTAY"] = "HOMESTAY";
    BookingType["CAMPSITE"] = "CAMPSITE";
    BookingType["GUESTHOUSE"] = "GUESTHOUSE";
    BookingType["FLIGHT"] = "FLIGHT";
    BookingType["TRAIN"] = "TRAIN";
    BookingType["BUS"] = "BUS";
    BookingType["ATTRACTION"] = "ATTRACTION";
    BookingType["ACTIVITY"] = "ACTIVITY";
    BookingType["OTHER"] = "OTHER";
})(BookingType || (BookingType = {}));
// ─── Booking Status ─────────────────────────────────────────
export var BookingStatus;
(function (BookingStatus) {
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["TENTATIVE"] = "TENTATIVE";
    BookingStatus["CANCELLED"] = "CANCELLED";
})(BookingStatus || (BookingStatus = {}));
// ─── Travel Document Type ───────────────────────────────────
export var DocumentType;
(function (DocumentType) {
    DocumentType["DRIVING_LICENSE"] = "DRIVING_LICENSE";
    DocumentType["VEHICLE_RC"] = "VEHICLE_RC";
    DocumentType["INSURANCE_POLICY"] = "INSURANCE_POLICY";
    DocumentType["PUC_CERTIFICATE"] = "PUC_CERTIFICATE";
    DocumentType["HOTEL_VOUCHER"] = "HOTEL_VOUCHER";
    DocumentType["TICKETS"] = "TICKETS";
    DocumentType["PERMIT"] = "PERMIT";
    DocumentType["ID_PROOF"] = "ID_PROOF";
    DocumentType["PASSPORT"] = "PASSPORT";
    DocumentType["OTHER"] = "OTHER";
})(DocumentType || (DocumentType = {}));
// ─── Settlement Status ──────────────────────────────────────
export var SettlementStatus;
(function (SettlementStatus) {
    SettlementStatus["PENDING"] = "PENDING";
    SettlementStatus["SETTLED"] = "SETTLED";
})(SettlementStatus || (SettlementStatus = {}));
// ─── Expense Split Type ─────────────────────────────────────
export var ExpenseSplitType;
(function (ExpenseSplitType) {
    ExpenseSplitType["EQUAL"] = "EQUAL";
    ExpenseSplitType["EXACT"] = "EXACT";
    ExpenseSplitType["PERCENTAGE"] = "PERCENTAGE";
})(ExpenseSplitType || (ExpenseSplitType = {}));
// ─── Vehicle Inspection Status ──────────────────────────────
export var InspectionStatus;
(function (InspectionStatus) {
    InspectionStatus["PASSED"] = "PASSED";
    InspectionStatus["ATTENTION_NEEDED"] = "ATTENTION_NEEDED";
    InspectionStatus["FAILED"] = "FAILED";
})(InspectionStatus || (InspectionStatus = {}));
// ─── Live Ride Session Status ──────────────────────────────
export var RideSessionStatus;
(function (RideSessionStatus) {
    RideSessionStatus["ACTIVE"] = "ACTIVE";
    RideSessionStatus["PAUSED"] = "PAUSED";
    RideSessionStatus["ENDED"] = "ENDED";
})(RideSessionStatus || (RideSessionStatus = {}));
// ─── Crew Ping Alert Type ───────────────────────────────────
export var PingType;
(function (PingType) {
    PingType["REGROUP"] = "REGROUP";
    PingType["MECHANICAL_STOP"] = "MECHANICAL_STOP";
    PingType["FUEL_STOP"] = "FUEL_STOP";
    PingType["PHOTO_STOP"] = "PHOTO_STOP";
    PingType["SOS_EMERGENCY"] = "SOS_EMERGENCY";
    PingType["CUSTOM"] = "CUSTOM";
})(PingType || (PingType = {}));
// ─── Journal Mood ──────────────────────────────────────────
export var JournalMood;
(function (JournalMood) {
    JournalMood["EXCELLENT"] = "EXCELLENT";
    JournalMood["ADVENTUROUS"] = "ADVENTUROUS";
    JournalMood["TIRED"] = "TIRED";
    JournalMood["PEACEFUL"] = "PEACEFUL";
    JournalMood["CHALLENGING"] = "CHALLENGING";
})(JournalMood || (JournalMood = {}));
// ─── Highlight Category ────────────────────────────────────
export var HighlightCategory;
(function (HighlightCategory) {
    HighlightCategory["SCENIC_VIEW"] = "SCENIC_VIEW";
    HighlightCategory["FOOD_SPOT"] = "FOOD_SPOT";
    HighlightCategory["EPIC_RIDE"] = "EPIC_RIDE";
    HighlightCategory["CULTURE"] = "CULTURE";
    HighlightCategory["SUNSET"] = "SUNSET";
    HighlightCategory["WILDLIFE"] = "WILDLIFE";
    HighlightCategory["OTHER"] = "OTHER";
})(HighlightCategory || (HighlightCategory = {}));
// ─── Currency Codes (common subset) ─────────────────────────
export const SUPPORTED_CURRENCIES = [
    'INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'AED', 'THB', 'JPY',
    'MYR', 'IDR', 'PHP', 'VND', 'KRW', 'CHF', 'SEK', 'NOK', 'DKK', 'NZD',
];
// ─── API Error Codes ────────────────────────────────────────
export var ErrorCode;
(function (ErrorCode) {
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["CONFLICT"] = "CONFLICT";
    ErrorCode["RATE_LIMITED"] = "RATE_LIMITED";
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ErrorCode["BAD_REQUEST"] = "BAD_REQUEST";
})(ErrorCode || (ErrorCode = {}));
// ─── Pagination defaults ────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
//# sourceMappingURL=index.js.map