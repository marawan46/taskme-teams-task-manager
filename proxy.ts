import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Root Proxy (Next.js 16 renamed `middleware` -> `proxy`).
 *
 * Refreshes the Supabase session on every matched request, then enforces auth:
 * signed-out users are bounced from app routes to /login, and signed-in users
 * are kept out of the auth pages.
 */

const APP_PREFIXES = ["/tasks", "/inbox", "/projects", "/settings"];
const AUTH_PATHS = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const inApp = APP_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );

  if (inApp && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", path);
    return NextResponse.redirect(url);
  }

  if (AUTH_PATHS.includes(path) && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/tasks";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on everything except Next internals and static assets, so cookies
     * refresh on navigations but not on image/JS/CSS requests.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
