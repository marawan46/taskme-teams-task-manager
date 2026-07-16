import { cn } from "@/lib/utils";
import { PRIORITY_META } from "@/lib/design/tokens";
import type { Priority } from "@/lib/types";
import { Flag } from "./icons";

interface PriorityFlagProps {
  priority: Priority;
  showLabel?: boolean;
  className?: string;
}

export function PriorityFlag({ priority, showLabel = true, className }: PriorityFlagProps) {
  const meta = PRIORITY_META[priority];
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", className)}>
      <Flag size={13} style={{ color: meta.color }} />
      {showLabel && <span className="text-body">{meta.label}</span>}
    </span>
  );
}
