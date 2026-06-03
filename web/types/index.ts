export type VerificationStatus = "unverified" | "email_verified" | "org_verified";
export type OAuthProvider = "email" | "google" | "microsoft";
/** Interactive login providers (subset of OAuthProvider). */
export type AuthProvider = "google" | "microsoft";

export interface Organization {
  id: number;
  name: string;
  slug: string;
  city: string;
  logo_url?: string;
}

export interface User {
  id: string; // uuid
  email: string;
  full_name: string;
  avatar_url?: string | null;
  org?: string | null; // university code, e.g. "BGU"
  org_name_he?: string | null; // Hebrew display name resolved by the backend
  onboarded: boolean;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  // Reserved for later sprints (verification):
  verification_status?: VerificationStatus;
}

export type RideStatus = "waiting" | "in_progress" | "completed" | "cancelled";
export type RideVisibility = "city_wide" | "org_only";
export type RequestStatus = "pending" | "accepted" | "rejected";

export interface Ride {
  id: number;
  driver_id: number;
  driver?: User;
  departure_address: string;
  destination_address: string;
  departure_lat: number;
  departure_lng: number;
  destination_lat: number;
  destination_lng: number;
  pickup_radius_m: number;
  drop_radius_m: number;
  departure_datetime: string;
  available_seats: number;
  confirmed_passengers: number;
  seats_left: number;
  status: RideStatus;
  visibility: RideVisibility;
  notes?: string;
  fuel_cost_total?: number;
  created_at: string;
}

export interface JoinRequest {
  id: number;
  ride_id: number;
  ride?: Ride;
  passenger_id: number;
  passenger?: User;
  requested_seats: number;
  status: RequestStatus;
  created_at: string;
}

export interface RideSearchResult {
  ride: Ride;
  pickup_distance_m: number;
  drop_distance_m: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  limit: number;
  offset: number;
}
