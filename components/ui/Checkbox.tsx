"use client";

import { cn } from "@/lib/utils";
import { Check } from "./icons";

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * Selection control. Checked state springs the checkmark in
 * (via .animate-scale-in), matching DESIGN.md's checkbox spec.
 */
export function Checkbox({
  checked = false,
  onCheckedChange,
  disabled,
  className,
  ...props
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onCheckedChange?.(!checked);
      }}
      className={cn(
        "inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-sm border " +
          "transition-colors duration-[120ms] focus-visible:outline-none disabled:opacity-50",
        checked
          ? "border-primary bg-primary text-on-primary"
          : "border-hairline-strong bg-canvas hover:border-primary",
        className,
      )}
      {...props}
    >
      {checked && <Check size={13} strokeWidth={3} className="animate-scale-in" />}
    </button>
  );
}
