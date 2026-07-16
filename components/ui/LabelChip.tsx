import { cn } from "@/lib/utils";

interface LabelChipProps {
  name: string;
  color?: string | null;
  className?: string;
}

/** Task tag — a color dot on a neutral pill, so it works with any label color. */
export function LabelChip({ name, color, className }: LabelChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-2 py-0.5 " +
          "text-xs font-medium leading-none text-body",
        className,
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color ?? "var(--primary)" }}
      />
      {name}
    </span>
  );
}
