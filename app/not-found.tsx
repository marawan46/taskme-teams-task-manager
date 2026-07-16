import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
      <p className="text-6xl font-bold text-gradient-brand">404</p>
      <h1 className="text-xl font-semibold text-ink">Page not found</h1>
      <p className="max-w-sm text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className={buttonVariants({ variant: "primary" })}>
        Back home
      </Link>
    </div>
  );
}
