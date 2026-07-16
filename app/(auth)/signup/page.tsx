import type { Metadata } from "next";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AuthError } from "@/components/auth/AuthError";

export const metadata: Metadata = { title: "Sign up" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-[-0.01em] text-ink">Create your account</h1>
        <p className="text-sm text-muted">Get started with TaskMe — it&apos;s free.</p>
      </div>

      {error && <AuthError message={error} />}

      <GoogleSignInButton redirectTo={next} label="Sign up with Google" />

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
