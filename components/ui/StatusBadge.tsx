import { cn } from "@/lib/utils";
import { STATUS_META } from "@/lib/design/tokens";
import type { TaskStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: TaskStatus;
  withDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, withDot = true, className }: StatusBadgeProps) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium leading-none",
        meta.badge,
        className,
      )}
    >
      {withDot && (
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.dot }} />
      )}
      {meta.label}
    </span>
  );
}
