"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Begin Google OAuth. Runs as a Server Action so the PKCE verifier cookie is
 * set before we hand off to Google; the returned URL is where the browser goes
 * to consent, after which Google redirects back to /auth/callback.
 */
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";

  const callback = new URL(`${origin}/auth/callback`);
  if (redirectTo) callback.searchParams.set("next", redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callback.toString(),
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  if (data.url) {
    redirect(data.url);
  }
}

/** Sign out and return to the login page. */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
