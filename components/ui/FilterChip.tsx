"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

/** Toggleable board/list filter. Inactive tints to indigo on hover. */
export function FilterChip({ active = false, onClick, children, className }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium " +
          "transition-colors duration-[120ms] focus-visible:outline-none",
        active
          ? "border-primary bg-primary text-on-primary"
          : "border-hairline-strong bg-canvas text-body hover:border-primary hover:text-primary",
        className,
      )}
    >
      {children}
    </button>
  );
}
