"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { RideCard } from "@/components/ride-card";
import { Button } from "@/components/ui/button";
import { ridesApi } from "@/lib/rides-api";
import { useAuth } from "@/hooks/use-auth";
import type { MyRides } from "@/types/ride";

export default function MyRidesPage() {
  const { isLoading } = useAuth({ required: true });
  const [data, setData] = useState<MyRides | null>(null);
  const [fetching, setFetching] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  function refresh() { setRefreshKey(k => k + 1); }

  useEffect(() => {
    if (isLoading) return;
    setFetching(true);
    ridesApi.myRides()
      .then(setData)
      .catch(() => setData({ driving: [], joined: [] }))
      .finally(() => setFetching(false));
  }, [isLoading, refreshKey]);

  if (isLoading || fetching) return <div className="min-h-screen bg-[#0F172A]" />;

  const driving = data?.driving ?? [];
  const joined = data?.joined ?? [];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-10 space-y-10">
        {/* Driving */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black">נסיעות שאני מסיע 🚗</h2>
            <Link href="/rides/new">
              <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl">
                + חדשה
              </Button>
            </Link>
          </div>
          {driving.length === 0 ? (
            <p className="text-slate-400 text-sm">עדיין לא פרסמת נסיעות.</p>
          ) : (
            <div className="space-y-4">
              {driving.map((ride) => (
                <RideCard key={ride.id} ride={ride} isDriver onRequestUpdate={refresh} />
              ))}
            </div>
          )}
        </section>

        {/* Joined */}
        <section>
          <h2 className="text-xl font-black mb-4">נסיעות שהצטרפתי אליהן 🎒</h2>
          {joined.length === 0 ? (
            <p className="text-slate-400 text-sm">עדיין לא הצטרפת לנסיעות. <Link href="/rides" className="text-teal-400 underline">חפש נסיעה</Link></p>
          ) : (
            <div className="space-y-4">
              {joined.map((ride) => (
                <RideCard key={ride.id} ride={ride} myRequestStatus="accepted" />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
