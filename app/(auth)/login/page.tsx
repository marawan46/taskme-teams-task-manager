import type { Metadata } from "next";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AuthError } from "@/components/auth/AuthError";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-[-0.01em] text-ink">Welcome back</h1>
        <p className="text-sm text-muted">Sign in to your TaskMe workspace.</p>
      </div>

      {error && <AuthError message={error} />}

      <GoogleSignInButton redirectTo={next} label="Continue with Google" />

      <p className="text-center text-sm text-muted">
        New to TaskMe?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
