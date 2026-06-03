"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/star-rating";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/auth-store";
import { auth } from "@/lib/api";

export default function ProfilePage() {
  const { user, isLoading } = useAuth({ required: true });
  const setUser = useAuthStore((s) => s.setUser);

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setAvatarUrl(user.avatar_url ?? "");
    }
  }, [user]);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await auth.updateProfile({
        full_name: fullName,
        avatar_url: avatarUrl || null,
      });
      setUser(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !user) return <div className="min-h-screen bg-[#0F172A]" />;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-6 py-10">
        <h1 className="text-2xl font-black mb-6">הפרופיל שלי</h1>

        <Card className="bg-slate-800/50 border-slate-700 rounded-3xl">
          <CardContent className="p-6 space-y-5">
            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              {user.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar_url} alt={user.full_name}
                  className="h-16 w-16 rounded-full object-cover border border-slate-700" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500 text-2xl font-black text-slate-900">
                  {user.full_name.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-xl font-bold">{user.full_name}</div>
                <div className="text-sm text-slate-400">{user.email}</div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 rounded-2xl bg-slate-900/60 px-4 py-3">
              <StarRating value={Math.round(user.rating_avg)} readOnly />
              <span className="text-sm text-slate-300">
                {user.rating_count > 0
                  ? `${user.rating_avg.toFixed(1)} (${user.rating_count} דירוגים)`
                  : "אין דירוגים עדיין"}
              </span>
            </div>

            {/* Org */}
            {user.org_name_he && (
              <div className="text-sm text-slate-400">🎓 {user.org_name_he}</div>
            )}

            {/* Edit form */}
            {editing ? (
              <div className="space-y-4 border-t border-slate-700 pt-4">
                <div className="space-y-1">
                  <Label className="text-slate-300">שם מלא</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-300">קישור לתמונה (URL)</Label>
                  <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..." className="bg-slate-900 border-slate-700 text-white rounded-xl" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl">
                    {saving ? "שומר..." : "שמור"}
                  </Button>
                  <Button onClick={() => setEditing(false)} variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-700 rounded-xl">
                    ביטול
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setEditing(true)}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl">
                ערוך פרופיל
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
