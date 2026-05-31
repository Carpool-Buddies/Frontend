"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ridesApi } from "@/lib/rides-api";
import type { MyRides } from "@/types/ride";

export default function DashboardPage() {
  const { user, isLoading } = useAuth({ required: true });
  const [myRides, setMyRides] = useState<MyRides | null>(null);

  useEffect(() => {
    if (!user) return;
    ridesApi.myRides().then(setMyRides).catch(() => {});
  }, [user]);

  if (isLoading || !user) return <div className="min-h-screen bg-[#0F172A]" />;

  const pendingRequests = (myRides?.driving ?? [])
    .flatMap((r) => r.requests ?? [])
    .filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-black mb-1">שלום, {user.full_name.split(" ")[0]} 👋</h1>
        <p className="text-slate-400 mb-8">{user.org_name_he ?? "ברוכים הבאים ל-CarpoolBuddies"}</p>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/rides">
            <Card className="bg-teal-500/10 border-teal-500/30 hover:border-teal-500 transition-colors cursor-pointer rounded-2xl">
              <CardContent className="p-5 text-center">
                <div className="text-3xl mb-2">🔍</div>
                <div className="font-bold text-white">חפש נסיעה</div>
                <div className="text-xs text-slate-400 mt-1">מצא טרמפ לאוניברסיטה</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/rides/new">
            <Card className="bg-blue-500/10 border-blue-500/30 hover:border-blue-500 transition-colors cursor-pointer rounded-2xl">
              <CardContent className="p-5 text-center">
                <div className="text-3xl mb-2">🚗</div>
                <div className="font-bold text-white">פרסם נסיעה</div>
                <div className="text-xs text-slate-400 mt-1">הצע מקום בנסיעה שלך</div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Pending requests alert */}
        {pendingRequests > 0 && (
          <Link href="/rides/my">
            <div className="mb-6 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-yellow-300">🔔 {pendingRequests} בקשות ממתינות לאישורך</p>
                <p className="text-sm text-slate-400 mt-0.5">לחץ לניהול הבקשות</p>
              </div>
              <span className="text-yellow-400 text-xl">←</span>
            </div>
          </Link>
        )}

        {/* My rides summary */}
        <Card className="bg-slate-800/50 border-slate-700 rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">הנסיעות שלי</h2>
              <Link href="/rides/my" className="text-teal-400 text-sm hover:underline">הכל ←</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-black text-teal-400">{myRides?.driving.length ?? "—"}</div>
                <div className="text-xs text-slate-400 mt-1">נסיעות שאני מסיע</div>
              </div>
              <div>
                <div className="text-2xl font-black text-blue-400">{myRides?.joined.length ?? "—"}</div>
                <div className="text-xs text-slate-400 mt-1">נסיעות שהצטרפתי</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
