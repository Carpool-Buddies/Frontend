export type VerificationStatus = "unverified" | "email_verified" | "org_verified";
export type OAuthProvider = "email" | "google" | "microsoft";

export interface Organization {
  id: number;
  name: string;
  slug: string;
  city: string;
  logo_url?: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  profile_photo_url?: string;
  oauth_provider: OAuthProvider;
  organization_id?: number;
  organization?: Organization;
  verification_status: VerificationStatus;
  rating_avg: number;
  rating_count: number;
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
