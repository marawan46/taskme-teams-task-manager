import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

/** Centered auth shell over a soft brand wash. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-gradient-brand-soft">
      <header className="flex items-center justify-between px-6 py-5">
        <Logo href="/" />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-hairline bg-canvas p-8 shadow-lg sm:p-10">
            {children}
          </div>
          <p className="mt-6 text-center text-xs text-muted">
            By continuing you agree to our{" "}
            <Link href="/" className="text-primary hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
