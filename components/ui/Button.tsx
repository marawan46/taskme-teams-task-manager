import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "./icons";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon" | "link";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-[0.1px] " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-[180ms] ease-standard " +
  "select-none disabled:cursor-not-allowed focus-visible:outline-none";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary shadow-xs hover:bg-primary-hover hover:shadow-md hover:-translate-y-px " +
    "active:translate-y-0 active:shadow-xs disabled:bg-primary-disabled disabled:shadow-none disabled:hover:translate-y-0",
  secondary:
    "bg-canvas text-ink border border-hairline-strong hover:bg-surface-soft hover:border-muted-soft disabled:opacity-50",
  ghost: "bg-transparent text-body hover:bg-surface-sunken hover:text-ink disabled:opacity-50",
  icon: "bg-transparent text-muted hover:bg-surface-sunken hover:text-ink disabled:opacity-50",
  link: "bg-transparent text-primary hover:text-primary-hover hover:underline disabled:opacity-50",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-[13px]",
  md: "h-10 px-[18px] text-sm",
  lg: "h-11 px-6 text-[15px]",
};

const ICON_SIZES: Record<ButtonSize, string> = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-10 w-10",
};

/** Class string for a button-styled element — reuse on `<Link>` for CTAs. */
export function buttonVariants({
  variant = "primary",
  size = "md",
}: { variant?: ButtonVariant; size?: ButtonSize } = {}): string {
  const sizeCls =
    variant === "icon" ? ICON_SIZES[size] : variant === "link" ? "" : SIZES[size];
  return cn(base, VARIANTS[variant], sizeCls);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader size={16} /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
