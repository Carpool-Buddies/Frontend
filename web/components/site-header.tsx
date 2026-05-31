"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { useLogout } from "@/hooks/use-auth";

export function SiteHeader() {
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={isAuthenticated ? "/dashboard" : "/"}>
          <span className="text-xl font-black bg-gradient-to-l from-teal-400 to-blue-500 bg-clip-text text-transparent">
            CarpoolBuddies
          </span>
        </Link>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-300 sm:inline">
              {user.full_name}
            </span>
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="h-9 w-9 rounded-full border border-slate-700 object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 font-bold text-slate-900">
                {user.full_name.charAt(0)}
              </div>
            )}
            <Button
              onClick={logout}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800 rounded-xl"
            >
              התנתק
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl">
              התחברות
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
