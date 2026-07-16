import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

/** Neutral pill counter (e.g. a column's task count). */
export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-surface-sunken px-2 py-0.5 " +
          "text-xs font-medium leading-none text-body",
        className,
      )}
    >
      {children}
    </span>
  );
}
