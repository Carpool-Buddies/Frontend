import { api } from "./api";
import type { Ride, MyRides, RideRequest } from "@/types/ride";

export interface RideCreateData {
  origin_address: string;
  origin_lat?: number | null;
  origin_lng?: number | null;
  destination_address: string;
  dest_lat?: number | null;
  dest_lng?: number | null;
  departure_time: string; // ISO string
  available_seats: number;
  price_per_seat?: number | null;
  notes?: string | null;
  visibility: "city_wide" | "org_only";
}

export const ridesApi = {
  search: (params: {
    destination?: string;
    date?: string;
    org_only?: boolean;
    origin_lat?: number | null;
    origin_lng?: number | null;
    radius_km?: number;
  }) => {
    const q = new URLSearchParams();
    if (params.destination) q.set("destination", params.destination);
    if (params.date) q.set("date", params.date);
    if (params.org_only) q.set("org_only", "true");
    if (params.origin_lat != null) q.set("origin_lat", String(params.origin_lat));
    if (params.origin_lng != null) q.set("origin_lng", String(params.origin_lng));
    if (params.radius_km != null) q.set("radius_km", String(params.radius_km));
    return api.get<Ride[]>(`/rides?${q}`);
  },

  myRides: () => api.get<MyRides>("/rides/my"),

  get: (id: string) => api.get<Ride>(`/rides/${id}`),

  create: (data: RideCreateData) => api.post<Ride>("/rides", data),

  cancel: (id: string) => api.del<void>(`/rides/${id}`),

  edit: (id: string, data: Partial<RideCreateData>) => api.patch<Ride>(`/rides/${id}`, data),

  complete: (id: string) => api.post<{ status: string }>(`/rides/${id}/complete`),

  leave: (id: string) => api.post<{ status: string }>(`/rides/${id}/leave`),

  requestJoin: (rideId: string, data: { requested_seats?: number; message?: string }) =>
    api.post<RideRequest>(`/rides/${rideId}/requests`, data),

  updateRequest: (rideId: string, requestId: string, status: "accepted" | "rejected") =>
    api.patch<RideRequest>(`/rides/${rideId}/requests/${requestId}`, { status }),

  rate: (rideId: string, data: { ratee_id: string; score: number; comment?: string }) =>
    api.post(`/rides/${rideId}/ratings`, data),
};
