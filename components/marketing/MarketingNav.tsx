import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { buttonVariants } from "@/components/ui/Button";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo href="/" />
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-body transition-colors hover:text-ink">
            Features
          </a>
          <a href="#views" className="text-sm font-medium text-body transition-colors hover:text-ink">
            Views
          </a>
          <a href="#cta" className="text-sm font-medium text-body transition-colors hover:text-ink">
            Get started
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Log in
          </Link>
          <Link
            href="/signup"
            className={`${buttonVariants({ variant: "primary", size: "sm" })} hidden sm:inline-flex`}
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
