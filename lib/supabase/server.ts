import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 *
 * Next.js 16: `cookies()` is async and must be awaited. Writing cookies from a
 * Server Component throws, so `setAll` is wrapped in try/catch — session
 * refresh is handled by proxy.ts, which makes that safe to ignore.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component — ignore; proxy.ts refreshes cookies.
          }
        },
      },
    },
  );
}
