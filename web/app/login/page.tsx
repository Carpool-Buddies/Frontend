"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/api";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5c-7.3 0-13.7 4.1-17.7 10.2z" />
      <path fill="#4CAF50" d="M24 43.5c5.3 0 10.2-2 13.9-5.3l-6.4-5.4C29.4 34.6 26.8 35.5 24 35.5c-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C10.2 39.3 16.6 43.5 24 43.5z" />
      <path fill="#1976D2" d="M43.6 20.5H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.4 5.4c-.5.4 6.9-5 6.9-15.3 0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 23 23" aria-hidden="true">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M12 1h10v10H12z" />
      <path fill="#00A4EF" d="M1 12h10v10H1z" />
      <path fill="#FFB900" d="M12 12h10v10H12z" />
    </svg>
  );
}

function LoginCard() {
  const params = useSearchParams();
  const error = params.get("error");

  return (
    <main className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-black bg-gradient-to-l from-teal-400 to-blue-500 bg-clip-text text-transparent">
              CarpoolBuddies
            </span>
          </Link>
          <h1 className="text-3xl font-black mb-2">ברוכים הבאים 👋</h1>
          <p className="text-slate-400">התחברו עם חשבון האוניברסיטה שלכם</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 p-8 rounded-3xl">
          {error && (
            <div className="mb-5 rounded-xl bg-red-500/15 border border-red-500/30 px-4 py-3 text-sm text-red-300">
              {error === "no_email"
                ? "לא הצלחנו לקבל כתובת אימייל מהחשבון. נסו שוב."
                : "ההתחברות נכשלה. נסו שוב."}
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => (window.location.href = auth.loginUrl("google"))}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-base py-6 rounded-2xl gap-3"
            >
              <GoogleIcon />
              המשך עם Google
            </Button>
            <Button
              onClick={() => (window.location.href = auth.loginUrl("microsoft"))}
              className="w-full bg-[#2F2F2F] hover:bg-[#3a3a3a] text-white font-bold text-base py-6 rounded-2xl gap-3 border border-slate-600"
            >
              <MicrosoftIcon />
              המשך עם Microsoft
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 leading-relaxed">
            בהתחברות אתם מאשרים את תנאי השימוש ומדיניות הפרטיות שלנו
          </p>
        </Card>

        <p className="mt-6 text-center text-sm text-slate-500">
          משתמשים בכתובת אוניברסיטה? נזהה את המוסד שלכם אוטומטית 🎓
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F172A]" />}>
      <LoginCard />
    </Suspense>
  );
}
