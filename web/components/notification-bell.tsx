"use client";

import { useEffect, useState, useCallback } from "react";
import { notificationsApi } from "@/lib/notifications-api";
import type { Notification } from "@/types/notification";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "עכשיו";
  if (mins < 60) return `לפני ${mins} דק'`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `לפני ${hrs} שע'`;
  return `לפני ${Math.floor(hrs / 24)} ימים`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<Notification[]>([]);

  const loadCount = useCallback(() => {
    notificationsApi.unreadCount().then((r) => setCount(r.count)).catch(() => {});
  }, []);

  useEffect(() => {
    loadCount();
    const t = setInterval(loadCount, 30000); // poll every 30s
    return () => clearInterval(t);
  }, [loadCount]);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      const list = await notificationsApi.list().catch(() => []);
      setItems(list);
    }
  }

  async function handleMarkAll() {
    await notificationsApi.markAllRead().catch(() => {});
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setCount(0);
  }

  return (
    <div className="relative">
      <button
        onClick={toggle}
        aria-label="התראות"
        className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
      >
        <span className="text-lg">🔔</span>
        {count > 0 && (
          <span
            data-testid="notif-badge"
            className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-800 shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <span className="font-bold text-white">התראות</span>
            {items.some((n) => !n.read) && (
              <button onClick={handleMarkAll} className="text-xs text-teal-400 hover:underline">
                סמן הכל כנקרא
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-400">אין התראות</div>
          ) : (
            <ul>
              {items.map((n) => (
                <li
                  key={n.id}
                  className={`px-4 py-3 border-b border-slate-700/50 ${n.read ? "opacity-60" : "bg-slate-700/30"}`}
                >
                  <div className="text-sm font-semibold text-white">{n.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{n.body}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{timeAgo(n.created_at)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
