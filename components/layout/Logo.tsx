import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string | null;
  showText?: boolean;
  size?: number;
  className?: string;
}

/** TaskMe wordmark: gradient "T" mark + name. Pass href={null} for static use. */
export function Logo({ href = "/", showText = true, size = 28, className }: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-[-0.01em] text-ink", className)}>
      <span
        className="flex items-center justify-center rounded-lg bg-gradient-brand font-bold text-white"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        T
      </span>
      {showText && <span className="text-[17px]">TaskMe</span>}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }
  return content;
}
