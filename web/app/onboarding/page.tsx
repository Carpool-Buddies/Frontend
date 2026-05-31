"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, auth } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import type { User } from "@/types";

interface University {
  code: string;
  name_he: string;
  name_en: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [org, setOrg] = useState<string>("");
  const [unis, setUnis] = useState<University[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      auth.me(),
      api.get<University[]>("/universities").catch(() => [] as University[]),
    ]).then(([me, list]) => {
      if (cancelled) return;
      if (!me) {
        router.replace("/login");
        return;
      }
      if (me.onboarded) {
        router.replace("/dashboard");
        return;
      }
      setFullName(me.full_name ?? "");
      setOrg(me.org ?? "");
      setUnis(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated: User = await auth.completeOnboarding({
        full_name: fullName,
        org: org || null,
      });
      setUser(updated);
      router.replace("/dashboard");
    } catch {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#0F172A]" />;
  }

  return (
    <main className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">כמעט סיימנו! 🎉</h1>
          <p className="text-slate-400">רק נוודא שהפרטים נכונים</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 p-8 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-300">
                שם מלא
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-slate-900 border-slate-700 text-white rounded-xl py-6"
                placeholder="ישראל ישראלי"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org" className="text-slate-300">
                מוסד לימודים
              </Label>
              <select
                id="org"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">לא משויך / אחר</option>
                {unis.map((u) => (
                  <option key={u.code} value={u.code}>
                    {u.name_he}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">
                זיהינו את המוסד שלכם אוטומטית מכתובת האימייל — אפשר לשנות
              </p>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-lg py-6 rounded-2xl disabled:opacity-60"
            >
              {saving ? "שומר..." : "בואו נתחיל 🚗"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
