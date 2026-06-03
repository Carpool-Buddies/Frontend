import axios from "axios";
import type { AuthProvider, User } from "@/types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// withCredentials sends the httpOnly auth cookies the backend sets; no tokens
// are stored client-side.
const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const api = {
  get: <T>(path: string) => http.get<T>(path).then((r) => r.data),
  post: <T>(path: string, body?: unknown) =>
    http.post<T>(path, body).then((r) => r.data),
  patch: <T>(path: string, body?: unknown) =>
    http.patch<T>(path, body).then((r) => r.data),
  del: <T>(path: string) => http.delete<T>(path).then((r) => r.data),
};

export const auth = {
  /** Full-page redirect target that starts the OAuth flow on the backend. */
  loginUrl: (provider: AuthProvider) => `${API_BASE}/auth/${provider}/login`,

  /** Current user, or null when not authenticated (401). */
  async me(): Promise<User | null> {
    try {
      return await api.get<User>("/auth/me");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) return null;
      throw err;
    }
  },

  completeOnboarding: (data: { full_name: string; org?: string | null }) =>
    api.post<User>("/auth/onboarding", data),

  updateProfile: (data: { full_name?: string; avatar_url?: string | null }) =>
    api.patch<User>("/auth/profile", data),

  getUser: (id: string) => api.get<User>(`/auth/users/${id}`),

  logout: () => api.post<{ status: string }>("/auth/logout"),
};
