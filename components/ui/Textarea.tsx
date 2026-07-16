import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function Textarea({ className, invalid, rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        "w-full rounded-md border bg-canvas px-3.5 py-3 text-[15px] leading-relaxed text-ink " +
          "placeholder:text-muted-soft transition-[border-color,box-shadow] duration-[120ms] " +
          "resize-y focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
        invalid
          ? "border-error focus-visible:shadow-[var(--ring-error)]"
          : "border-hairline-strong focus-visible:border-primary",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
