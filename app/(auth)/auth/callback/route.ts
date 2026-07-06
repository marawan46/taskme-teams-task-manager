import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
     const cookieStore = await cookies();
     const { searchParams, origin } = new URL(request.url);

     // 1. OAuth passes a 'code', not a 'token_hash'
     const code = searchParams.get("code");
     const next = searchParams.get("next") ?? "/";

     if (code) {
          const supabase = createClient(cookieStore);

          // 2. Exchange the temporary code for a secure, cookie-backed session
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (!error) {
               // Securely forward the user to their intended page (e.g., dashboard or home)
               return NextResponse.redirect(`${origin}/dashboard`);
          }
          console.error("OAuth exchange error:", error.message);
     }

     // Return the user to an error page if the exchange fails
     return NextResponse.redirect(`${origin}/error`);
}
