import type { User } from "./index";

export interface RideRequest {
  id: string;
  passenger_id: string;
  passenger?: User;
  requested_seats: number;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  message?: string | null;
  created_at: string;
}

export interface Ride {
  id: string;
  driver_id: string;
  driver?: User;
  origin_address: string;
  origin_lat?: number | null;
  origin_lng?: number | null;
  destination_address: string;
  dest_lat?: number | null;
  dest_lng?: number | null;
  departure_time: string;
  available_seats: number;
  confirmed_passengers: number;
  seats_left: number;
  price_per_seat?: number | null;
  notes?: string | null;
  visibility: "city_wide" | "org_only";
  org?: string | null;
  status: "active" | "completed" | "cancelled";
  created_at: string;
  requests?: RideRequest[];
}

export interface MyRides {
  driving: Ride[];
  joined: Ride[];
}
