import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  leftIcon?: ReactNode;
}

export function Input({ className, invalid, leftIcon, ...props }: InputProps) {
  const field = (
    <input
      className={cn(
        "h-10 w-full rounded-md border bg-canvas px-3.5 text-[15px] text-ink " +
          "placeholder:text-muted-soft transition-[border-color,box-shadow] duration-[120ms] " +
          "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
        invalid
          ? "border-error focus-visible:shadow-[var(--ring-error)]"
          : "border-hairline-strong focus-visible:border-primary",
        leftIcon ? "pl-10" : null,
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );

  if (!leftIcon) return field;
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft">
        {leftIcon}
      </span>
      {field}
    </div>
  );
}
