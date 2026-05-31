import { api } from "./api";
import type { Ride, MyRides, RideRequest } from "@/types/ride";

export interface RideCreateData {
  origin_address: string;
  destination_address: string;
  departure_time: string; // ISO string
  available_seats: number;
  price_per_seat?: number | null;
  notes?: string | null;
  visibility: "city_wide" | "org_only";
}

export const ridesApi = {
  search: (params: { destination?: string; date?: string; org_only?: boolean }) => {
    const q = new URLSearchParams();
    if (params.destination) q.set("destination", params.destination);
    if (params.date) q.set("date", params.date);
    if (params.org_only) q.set("org_only", "true");
    return api.get<Ride[]>(`/rides?${q}`);
  },

  myRides: () => api.get<MyRides>("/rides/my"),

  get: (id: string) => api.get<Ride>(`/rides/${id}`),

  create: (data: RideCreateData) => api.post<Ride>("/rides", data),

  cancel: (id: string) => api.del<void>(`/rides/${id}`),

  requestJoin: (rideId: string, data: { requested_seats?: number; message?: string }) =>
    api.post<RideRequest>(`/rides/${rideId}/requests`, data),

  updateRequest: (rideId: string, requestId: string, status: "accepted" | "rejected") =>
    api.patch<RideRequest>(`/rides/${rideId}/requests/${requestId}`, { status }),
};
