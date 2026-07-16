import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "./icons";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export function Select({ className, invalid, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-10 w-full appearance-none rounded-md border bg-canvas pl-3.5 pr-9 text-[15px] text-ink " +
            "transition-[border-color,box-shadow] duration-[120ms] focus-visible:outline-none " +
            "disabled:cursor-not-allowed disabled:opacity-60",
          invalid
            ? "border-error focus-visible:shadow-[var(--ring-error)]"
            : "border-hairline-strong focus-visible:border-primary",
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
