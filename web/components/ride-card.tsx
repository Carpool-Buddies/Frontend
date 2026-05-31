"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ridesApi } from "@/lib/rides-api";
import type { Ride, RideRequest } from "@/types/ride";

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("he-IL", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

interface Props {
  ride: Ride;
  isDriver?: boolean;
  myRequestStatus?: RideRequest["status"] | null;
  onRequestSent?: () => void;
  onRequestUpdate?: () => void;
}

export function RideCard({ ride, isDriver, myRequestStatus, onRequestSent, onRequestUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMsg, setShowMsg] = useState(false);

  async function handleJoin() {
    setLoading(true);
    try {
      await ridesApi.requestJoin(ride.id, { message: message || undefined });
      onRequestSent?.();
    } finally {
      setLoading(false);
      setShowMsg(false);
    }
  }

  async function handleUpdate(reqId: string, status: "accepted" | "rejected") {
    setLoading(true);
    try {
      await ridesApi.updateRequest(ride.id, reqId, status);
      onRequestUpdate?.();
    } finally {
      setLoading(false);
    }
  }

  const seatsLeft = ride.seats_left;

  return (
    <Card className="bg-slate-800/50 border-slate-700 rounded-2xl hover:border-teal-500/40 transition-colors">
      <CardContent className="p-5 space-y-3">
        {/* Route */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="text-teal-400">●</span>
            <span className="font-medium text-white">{ride.origin_address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mr-3">
            <span className="text-xs text-slate-600">│</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="text-blue-400">▼</span>
            <span className="font-medium text-white">{ride.destination_address}</span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 text-sm text-slate-400">
          <span>🕐 {fmt(ride.departure_time)}</span>
          <span>💺 {seatsLeft} מקומות פנויים</span>
          {ride.price_per_seat && <span>₪{ride.price_per_seat} לנסיעה</span>}
          {ride.visibility === "org_only" && <span className="text-teal-400 text-xs">🎓 אוניברסיטה בלבד</span>}
        </div>

        {/* Driver info */}
        {!isDriver && ride.driver && (
          <div className="flex items-center gap-2 text-sm">
            {ride.driver.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ride.driver.avatar_url} alt="" className="h-6 w-6 rounded-full" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold text-slate-900">
                {ride.driver.full_name.charAt(0)}
              </div>
            )}
            <span className="text-slate-300">{ride.driver.full_name}</span>
          </div>
        )}

        {ride.notes && <p className="text-xs text-slate-500 italic">{ride.notes}</p>}

        {/* Passenger join actions */}
        {!isDriver && ride.status === "active" && (
          <div>
            {myRequestStatus === "accepted" && (
              <span className="text-sm text-teal-400 font-bold">✓ הצטרפת לנסיעה</span>
            )}
            {myRequestStatus === "pending" && (
              <span className="text-sm text-yellow-400">⏳ בקשה ממתינה לאישור</span>
            )}
            {myRequestStatus === "rejected" && (
              <span className="text-sm text-red-400">✗ הבקשה נדחתה</span>
            )}
            {!myRequestStatus && seatsLeft > 0 && (
              showMsg ? (
                <div className="space-y-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="הודעה לנהג (אופציונלי)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleJoin} disabled={loading} size="sm"
                      className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl">
                      {loading ? "שולח..." : "שלח בקשה"}
                    </Button>
                    <Button onClick={() => setShowMsg(false)} size="sm" variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700 rounded-xl">
                      ביטול
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowMsg(true)} size="sm"
                  className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl">
                  בקש להצטרף
                </Button>
              )
            )}
            {!myRequestStatus && seatsLeft === 0 && (
              <span className="text-sm text-slate-500">אין מקומות פנויים</span>
            )}
          </div>
        )}

        {/* Driver: pending requests */}
        {isDriver && ride.requests && ride.requests.filter(r => r.status === "pending").length > 0 && (
          <div className="border-t border-slate-700 pt-3 space-y-2">
            <p className="text-xs text-slate-400 font-semibold">בקשות ממתינות:</p>
            {ride.requests.filter(r => r.status === "pending").map(req => (
              <div key={req.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-slate-300">{req.passenger?.full_name ?? "נוסע"} · {req.requested_seats} מקום</span>
                <div className="flex gap-1">
                  <Button onClick={() => handleUpdate(req.id, "accepted")} disabled={loading} size="sm"
                    className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-lg h-7 px-2 text-xs">
                    ✓ אשר
                  </Button>
                  <Button onClick={() => handleUpdate(req.id, "rejected")} disabled={loading} size="sm" variant="outline"
                    className="border-slate-600 text-red-400 hover:bg-slate-700 rounded-lg h-7 px-2 text-xs">
                    ✗ דחה
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
