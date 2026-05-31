"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

/**
 * Loads the current user into the auth store on mount.
 *
 * Pass `required` to guard a page: unauthenticated visitors are redirected to
 * /login, and users who haven't finished onboarding are sent to /onboarding.
 */
export function useAuth(options: { required?: boolean } = {}) {
  const { user, isLoading, isAuthenticated, setUser, setLoading } =
    useAuthStore();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    auth
      .me()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [setUser, setLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (options.required && !isAuthenticated) {
      router.replace("/login");
    } else if (isAuthenticated && user && !user.onboarded) {
      router.replace("/onboarding");
    }
  }, [isLoading, isAuthenticated, user, options.required, router]);

  return { user, isLoading, isAuthenticated };
}

export function useLogout() {
  const reset = useAuthStore((s) => s.reset);
  const router = useRouter();
  return async () => {
    await auth.logout().catch(() => {});
    reset();
    router.replace("/login");
  };
}
