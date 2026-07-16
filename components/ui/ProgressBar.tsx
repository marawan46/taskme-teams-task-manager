import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** 0–100. */
  value: number;
  className?: string;
}

/** Project/checklist progress — gradient fill on a sunken track. */
export function ProgressBar({ value, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gradient-brand transition-[width] duration-[320ms] ease-standard"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
