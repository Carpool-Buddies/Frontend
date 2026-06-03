import { api } from "./api";
import type { Notification } from "@/types/notification";

export const notificationsApi = {
  list: () => api.get<Notification[]>("/notifications"),
  unreadCount: () => api.get<{ count: number }>("/notifications/unread-count"),
  markRead: (id: string) => api.post<{ status: string }>(`/notifications/${id}/read`),
  markAllRead: () => api.post<{ marked: number }>("/notifications/read-all"),
};
