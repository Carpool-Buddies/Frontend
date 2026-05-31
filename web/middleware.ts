import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge gate for app routes: redirects to /login when the auth cookie is absent.
 * This is a cheap presence check — the API still validates the JWT on every
 * request, and the client-side useAuth hook handles expiry/onboarding.
 */
const PROTECTED_PREFIXES = ["/dashboard", "/rides", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!isProtected) return NextResponse.next();

  const hasSession = request.cookies.has("access_token");
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/rides/:path*", "/profile/:path*"],
};
