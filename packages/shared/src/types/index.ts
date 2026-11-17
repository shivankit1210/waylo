// ============================================================
// Waylo — Shared TypeScript Types
// ============================================================
// These types represent the domain entities as they appear in
// API responses. They do NOT duplicate the Prisma schema but
// define the public contract between frontend and backend.
// ============================================================

import type {
  TripStatus,
  TripType,
  TripRole,
  TransportMode,
  TripVisibility,
  InvitationStatus,
  SupportedCurrency,
  ItineraryItemType,
  ActivityFlexibility,
  PackingStatus,
  PackingCategory,
  LuggageBagType,
  VehicleType,
  FuelType,
  ExpenseCategory,
  PaymentMethod,
  ExpenseSplitType,
  InspectionStatus,
  BookingType,
  BookingStatus,
  DocumentType,
  RideSessionStatus,
  PingType,
  JournalMood,
  HighlightCategory,
} from '../constants/index.js';

// ─── Base ───────────────────────────────────────────────────
export interface BaseEntity {
  id: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// ─── User ───────────────────────────────────────────────────
export interface User extends BaseEntity {
  email: string;
  displayName: string;
  avatarUrl: string | null;
  timezone: string;
  preferredCurrency: SupportedCurrency;
}

export interface UserProfile extends User {
  bio: string | null;
  budgetStyle: string | null;
  preferredPace: string | null;
  accommodationType: string | null;
  interests: string[];
  dietaryPreferences: string[];
}

// ─── Auth ───────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

// ─── Trip ───────────────────────────────────────────────────
export interface Trip extends BaseEntity {
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  status: TripStatus;
  tripType: TripType;
  transportModes: TransportMode[];
  startDate: string | null; // ISO date
  endDate: string | null;   // ISO date
  startLocation: string | null;
  destination: string | null;
  returnLocation: string | null;
  currency: SupportedCurrency;
  estimatedBudget: number | null; // stored in cents/paise
  visibility: TripVisibility;
  tags: string[];
  ownerId: string;
}

export interface TripWithDetails extends Trip {
  owner: Pick<User, 'id' | 'displayName' | 'avatarUrl'>;
  members: TripMemberSummary[];
  _count?: {
    members: number;
    itineraryDays: number;
    expenses: number;
  };
}

// ─── Trip Member ────────────────────────────────────────────
export interface TripMember extends BaseEntity {
  tripId: string;
  userId: string;
  role: TripRole;
  joinedAt: string;
}

export interface TripMemberSummary {
  id: string;
  userId: string;
  role: TripRole;
  user: Pick<User, 'id' | 'displayName' | 'avatarUrl' | 'email'>;
}

// ─── Itinerary ──────────────────────────────────────────────
export interface ItineraryItem extends BaseEntity {
  dayId: string;
  title: string;
  description: string | null;
  itemType: ItineraryItemType;
  orderIndex: number;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  flexibility: ActivityFlexibility;
  isCompleted: boolean;
  isOptional: boolean;
  cost: number | null;
  currency: SupportedCurrency;
  notes: string | null;
  reminders: string[];
}

export interface ItineraryDay extends BaseEntity {
  tripId: string;
  dayNumber: number;
  date: string | null;
  title: string | null;
  startLocation: string | null;
  endLocation: string | null;
  plannedDeparture: string | null;
  plannedArrival: string | null;
  actualDeparture: string | null;
  actualArrival: string | null;
  plannedDistanceKm: number | null;
  actualDistanceKm: number | null;
  notes: string | null;
  items?: ItineraryItem[];
}

export interface ItineraryDayWithItems extends ItineraryDay {
  items: ItineraryItem[];
}

// ─── Packing & Luggage ──────────────────────────────────────
export interface LuggageBag extends BaseEntity {
  tripId: string;
  name: string;
  bagType: LuggageBagType;
  capacityLiters: number | null;
  maxWeightKg: number | null;
  color: string | null;
  notes: string | null;
}

export interface PackingItem extends BaseEntity {
  listId: string;
  bagId: string | null;
  name: string;
  category: PackingCategory;
  quantity: number;
  weightGrams: number | null;
  status: PackingStatus;
  isRequired: boolean;
  isShared: boolean;
  assignedTo: string | null;
  dayNumber: number | null;
  notes: string | null;
  bag?: LuggageBag | null;
}

export interface PackingList extends BaseEntity {
  tripId: string | null;
  userId: string | null;
  name: string;
  description: string | null;
  isTemplate: boolean;
  category: string | null;
}

export interface PackingListWithDetails extends PackingList {
  items: PackingItem[];
  bags?: LuggageBag[];
  _count?: {
    items: number;
    packed: number;
    missing: number;
  };
}

// ─── Vehicles & Inspections ─────────────────────────────────
export interface Vehicle extends BaseEntity {
  userId: string;
  tripId: string | null;
  name: string;
  type: VehicleType;
  make: string | null;
  model: string | null;
  year: number | null;
  registrationNumber: string | null;
  fuelType: FuelType;
  tankCapacityLiters: number | null;
  initialOdometer: number | null;
  currentOdometer: number | null;
}

export interface VehicleInspection extends BaseEntity {
  vehicleId: string;
  tripId: string | null;
  status: InspectionStatus;
  checklist: Record<string, boolean>;
  notes: string | null;
  odometer: number | null;
  inspectedAt: string;
}

export interface FuelLog extends BaseEntity {
  vehicleId: string;
  tripId: string | null;
  date: string;
  odometer: number;
  litersOrKwh: number;
  cost: number; // in cents/paise
  currency: SupportedCurrency;
  isFullTank: boolean;
  fuelPricePerUnit: number | null;
  stationLocation: string | null;
  notes: string | null;
  fuelEfficiencyKmPerUnit?: number | null; // Calculated efficiency
}

// ─── Expenses & Splits ──────────────────────────────────────
export interface ExpenseSplit extends BaseEntity {
  expenseId: string;
  userId: string;
  amount: number; // in cents/paise
  percentage: number | null;
  isSettled: boolean;
  user?: Pick<User, 'id' | 'displayName' | 'avatarUrl' | 'email'>;
}

export interface Expense extends BaseEntity {
  tripId: string;
  paidById: string;
  title: string;
  amount: number; // in cents/paise
  currency: SupportedCurrency;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  date: string;
  notes: string | null;
  receiptUrl: string | null;
  splitType: ExpenseSplitType;
  paidBy?: Pick<User, 'id' | 'displayName' | 'avatarUrl' | 'email'>;
  splits?: ExpenseSplit[];
}

export interface DebtSettlement {
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  amount: number; // in cents/paise
  currency: SupportedCurrency;
}

export interface MemberBalance {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  totalPaid: number;
  totalShare: number;
  netBalance: number; // positive = owed money, negative = owes money
}

export interface SettlementLedger {
  totalExpense: number;
  currency: SupportedCurrency;
  balances: MemberBalance[];
  settlements: DebtSettlement[];
}

// ─── Trip Invitation ────────────────────────────────────────
export interface TripInvitation extends BaseEntity {
  tripId: string;
  invitedEmail: string | null;
  inviteCode: string;
  role: TripRole;
  status: InvitationStatus;
  expiresAt: string;
  invitedBy: string;
}

// ─── Maps, Routing & Weather ────────────────────────────────
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RouteWaypoint {
  id?: string;
  name: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  orderIndex: number;
  stopType?: string;
  dayNumber?: number;
  estimatedArrival?: string | null;
}

export interface RouteGeometry {
  coordinates: [number, number][]; // [lat, lng] pairs for Leaflet polyline
  distanceKm: number;
  durationMinutes: number;
  waypoints: RouteWaypoint[];
}

export interface CurrentWeather {
  time: string;
  temperatureC: number;
  weatherCode: number;
  weatherDescription: string;
  windSpeedKmH: number;
  isDay: boolean;
  ridingAdvisory?: string;
}

export interface DailyWeatherForecast {
  date: string;
  weatherCode: number;
  weatherDescription: string;
  tempMaxC: number;
  tempMinC: number;
  precipitationProbability: number;
  precipitationMm: number;
  windSpeedMaxKmH: number;
  ridingAdvisory?: string;
}

export interface WeatherForecast {
  locationName?: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  current: CurrentWeather;
  daily: DailyWeatherForecast[];
}

export interface TripRouteResponse {
  route: RouteGeometry;
  weather?: WeatherForecast;
}

// ─── Accommodation & Stays ─────────────────────────────────
export interface Accommodation extends BaseEntity {
  tripId: string;
  name: string;
  type: BookingType;
  location: string | null;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  confirmationCode: string | null;
  totalCost: number | null; // cents
  currency: SupportedCurrency;
  contactPhone: string | null;
  contactEmail: string | null;
  notes: string | null;
  bookingStatus: BookingStatus;
}

// ─── Documents Vault ────────────────────────────────────────
export interface TripDocument extends BaseEntity {
  tripId: string;
  uploadedById: string;
  title: string;
  documentType: DocumentType;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  expiryDate: string | null;
  isShared: boolean;
  notes: string | null;
  uploadedBy?: Pick<User, 'id' | 'displayName' | 'avatarUrl' | 'email'>;
}

// ─── AI Trip Planner & Copilot Types ────────────────────────
export interface AIGeneratedStop {
  title: string;
  itemType: ItineraryItemType;
  location?: string | null;
  plannedStartTime?: string | null;
  plannedEndTime?: string | null;
  plannedDistanceKm?: number | null;
  flexibility: ActivityFlexibility;
  isOptional: boolean;
  notes?: string | null;
}

export interface AIGeneratedDay {
  dayNumber: number;
  title: string;
  startLocation?: string | null;
  endLocation?: string | null;
  notes?: string | null;
  stops: AIGeneratedStop[];
}

export interface AIGeneratedItinerary {
  tripTitle: string;
  summary: string;
  estimatedBudgetNotes?: string;
  highlights: string[];
  days: AIGeneratedDay[];
}

export interface AIGeneratedPackingItem {
  name: string;
  category: PackingCategory;
  quantity: number;
  isRequired: boolean;
  notes?: string | null;
}

export interface AIGeneratedPackingList {
  title: string;
  summary: string;
  items: AIGeneratedPackingItem[];
}

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatResponse {
  message: string;
  suggestions?: string[];
}

// ─── Group Ride & Live Tracking Types ───────────────────────

export interface RiderLocation {
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  latitude: number;
  longitude: number;
  altitude?: number | null;
  speedKmh?: number | null;
  headingDeg?: number | null;
  batteryPercent?: number | null;
  isMoving: boolean;
  lastPingAt: string;
}

export interface RideSession extends BaseEntity {
  tripId: string;
  name: string;
  status: RideSessionStatus;
  startedAt: string;
  endedAt?: string | null;
  activeRidersCount: number;
  riders?: RiderLocation[];
}

export interface CrewPingAlert {
  id: string;
  tripId: string;
  userId: string;
  senderName: string;
  pingType: PingType;
  message?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
}

// ─── Realtime Event Protocol Types ──────────────────────────

export type RealtimeClientEvent =
  | { type: 'JOIN_TRIP'; payload: { tripId: string; token: string } }
  | {
      type: 'UPDATE_LOCATION';
      payload: {
        tripId: string;
        latitude: number;
        longitude: number;
        speedKmh?: number;
        headingDeg?: number;
        batteryPercent?: number;
        altitude?: number;
      };
    }
  | {
      type: 'SEND_PING';
      payload: {
        tripId: string;
        pingType: PingType;
        message?: string;
        latitude?: number;
        longitude?: number;
      };
    }
  | { type: 'LEAVE_TRIP'; payload: { tripId: string } };

export type RealtimeServerEvent =
  | { type: 'RIDER_LOCATIONS_SNAPSHOT'; payload: { riders: RiderLocation[] } }
  | { type: 'RIDER_LOCATION_UPDATED'; payload: { rider: RiderLocation } }
  | { type: 'RIDER_JOINED'; payload: { userId: string; displayName: string } }
  | { type: 'RIDER_LEFT'; payload: { userId: string } }
  | { type: 'CREW_PING'; payload: { alert: CrewPingAlert } }
  | { type: 'SESSION_STATUS_CHANGED'; payload: { session: RideSession } };

// ─── Journal & Memories Types ───────────────────────────────

export interface JournalEntry extends BaseEntity {
  tripId: string;
  authorId: string;
  dayNumber?: number | null;
  title: string;
  content: string;
  location?: string | null;
  mood?: JournalMood | null;
  weatherNote?: string | null;
  mediaUrls: string[];
  author?: Pick<User, 'id' | 'displayName' | 'avatarUrl' | 'email'>;
}

export interface TripHighlight extends BaseEntity {
  tripId: string;
  title: string;
  description?: string | null;
  category: HighlightCategory;
  location?: string | null;
  rating: number;
  photoUrl?: string | null;
}

// ─── Trip Analytics & Summary Types ─────────────────────────

export interface CategoryExpenseSummary {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  count: number;
}

export interface TripAnalytics {
  tripId: string;
  tripName: string;
  totalDays: number;
  totalDistancePlannedKm: number;
  totalDistanceLoggedKm: number;
  stopsCount: {
    total: number;
    completed: number;
    remaining: number;
  };
  expenses: {
    totalSpent: number;
    budgetEstimated: number;
    budgetVariance: number; // positive = under budget, negative = over budget
    currency: SupportedCurrency;
    averagePerDay: number;
    averagePerPerson: number;
    costPerKm: number;
    categoryBreakdown: CategoryExpenseSummary[];
  };
  fuelAnalytics: {
    totalFuelLiters: number;
    totalFuelCost: number;
    averageKmPerLiter: number;
    logsCount: number;
  };
  crewStats: {
    totalMembers: number;
    journalEntriesCount: number;
    highlightsCount: number;
    packingCompletionPercentage: number;
  };
}

// ─── API Response Wrappers ──────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
