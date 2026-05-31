"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { RideCard } from "@/components/ride-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ridesApi } from "@/lib/rides-api";
import { useAuth } from "@/hooks/use-auth";
import type { Ride } from "@/types/ride";

export default function RidesPage() {
  const { isLoading, user } = useAuth({ required: true });
  const [rides, setRides] = useState<Ride[]>([]);
  const [fetching, setFetching] = useState(true);
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [orgOnly, setOrgOnly] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    setFetching(true);
    ridesApi.search({ destination: destination || undefined, date: date || undefined, org_only: orgOnly })
      .then(setRides)
      .catch(() => setRides([]))
      .finally(() => setFetching(false));
  }, [isLoading, destination, date, orgOnly, refreshKey]);

  if (isLoading) return <div className="min-h-screen bg-[#0F172A]" />;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black">חפש נסיעה 🔍</h1>
          <Link href="/rides/new">
            <Button className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl">
              + פרסם נסיעה
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Input value={destination} onChange={(e) => setDestination(e.target.value)}
            placeholder="יעד (חיפוש חופשי)" className="bg-slate-800 border-slate-700 text-white rounded-xl" />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white rounded-xl sm:w-44" />
          {user?.org && (
            <button onClick={() => setOrgOnly(!orgOnly)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${orgOnly ? "bg-teal-500 text-slate-900" : "bg-slate-800 text-slate-300 border border-slate-700"}`}>
              🎓 האוניברסיטה שלי
            </button>
          )}
        </div>

        {fetching ? (
          <div className="text-center text-slate-400 py-16">טוען נסיעות...</div>
        ) : rides.length === 0 ? (
          <div className="text-center text-slate-400 py-16">
            <p className="text-4xl mb-3">🚗</p>
            <p>לא נמצאו נסיעות. נסה לשנות את הפילטרים.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} onRequestSent={() => setRefreshKey(k => k + 1)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
