"use client";

import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user, isLoading } = useAuth({ required: true });

  if (isLoading || !user) {
    return <div className="min-h-screen bg-[#0F172A]" />;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-black mb-2">
          שלום, {user.full_name.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-400 mb-8">
          {user.org_name_he ?? "ברוכים הבאים ל-CarpoolBuddies"}
        </p>

        <Card className="bg-slate-800/50 border-slate-700 p-8 rounded-3xl">
          <p className="text-slate-300">
            המסך הזה יתמלא בנסיעות בספרינט הבא 🚗 (חיפוש טרמפ, פרסום נסיעה ושיוך
            נוסעים).
          </p>
        </Card>
      </main>
    </div>
  );
}
