"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ridesApi } from "@/lib/rides-api";
import { useAuth } from "@/hooks/use-auth";

export default function NewRidePage() {
  const router = useRouter();
  const { isLoading } = useAuth({ required: true });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    origin_address: "",
    destination_address: "",
    departure_date: "",
    departure_time: "",
    available_seats: 3,
    price_per_seat: "",
    notes: "",
    visibility: "city_wide" as "city_wide" | "org_only",
  });

  function set(field: string, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.departure_date || !form.departure_time) {
      setError("נא למלא תאריך ושעת יציאה");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const departure_time = new Date(`${form.departure_date}T${form.departure_time}`).toISOString();
      await ridesApi.create({
        origin_address: form.origin_address,
        destination_address: form.destination_address,
        departure_time,
        available_seats: form.available_seats,
        price_per_seat: form.price_per_seat ? parseFloat(form.price_per_seat) : null,
        notes: form.notes || null,
        visibility: form.visibility,
      });
      router.replace("/rides/my");
    } catch {
      setError("שגיאה בפרסום הנסיעה. נסה שוב.");
      setSaving(false);
    }
  }

  if (isLoading) return <div className="min-h-screen bg-[#0F172A]" />;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-6 py-10">
        <h1 className="text-2xl font-black mb-6">פרסם נסיעה 🚗</h1>

        <Card className="bg-slate-800/50 border-slate-700 p-6 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-500/15 border border-red-500/30 px-4 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-slate-300">נקודת יציאה</Label>
              <Input value={form.origin_address} onChange={(e) => set("origin_address", e.target.value)}
                required placeholder="כתובת מוצא" className="bg-slate-900 border-slate-700 text-white rounded-xl" />
            </div>

            <div className="space-y-1">
              <Label className="text-slate-300">יעד</Label>
              <Input value={form.destination_address} onChange={(e) => set("destination_address", e.target.value)}
                required placeholder="כתובת יעד" className="bg-slate-900 border-slate-700 text-white rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-300">תאריך</Label>
                <Input type="date" value={form.departure_date} onChange={(e) => set("departure_date", e.target.value)}
                  required className="bg-slate-900 border-slate-700 text-white rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-slate-300">שעה</Label>
                <Input type="time" value={form.departure_time} onChange={(e) => set("departure_time", e.target.value)}
                  required className="bg-slate-900 border-slate-700 text-white rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-300">מקומות פנויים</Label>
                <select value={form.available_seats} onChange={(e) => set("available_seats", parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-300">מחיר לנוסע (₪, אופציונלי)</Label>
                <Input type="number" min="0" step="0.5" value={form.price_per_seat}
                  onChange={(e) => set("price_per_seat", e.target.value)}
                  placeholder="0" className="bg-slate-900 border-slate-700 text-white rounded-xl" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-slate-300">הערות (אופציונלי)</Label>
              <Input value={form.notes} onChange={(e) => set("notes", e.target.value)}
                placeholder="לדוגמה: עצירה קצרה בדרך" className="bg-slate-900 border-slate-700 text-white rounded-xl" />
            </div>

            <div className="space-y-1">
              <Label className="text-slate-300">מי רואה את הנסיעה?</Label>
              <select value={form.visibility} onChange={(e) => set("visibility", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="city_wide">כולם</option>
                <option value="org_only">סטודנטים מהאוניברסיטה שלי בלבד</option>
              </select>
            </div>

            <Button type="submit" disabled={saving}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-base py-6 rounded-2xl disabled:opacity-60">
              {saving ? "מפרסם..." : "פרסם נסיעה ✓"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
