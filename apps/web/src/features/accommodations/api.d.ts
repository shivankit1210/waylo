import type { Accommodation, CreateAccommodationInput, UpdateAccommodationInput } from '@waylo/shared';
export declare function getAccommodations(tripId: string): Promise<Accommodation[]>;
export declare function createAccommodation(tripId: string, data: CreateAccommodationInput): Promise<Accommodation>;
export declare function updateAccommodation(tripId: string, accommodationId: string, data: UpdateAccommodationInput): Promise<Accommodation>;
export declare function deleteAccommodation(tripId: string, accommodationId: string): Promise<void>;
//# sourceMappingURL=api.d.ts.map