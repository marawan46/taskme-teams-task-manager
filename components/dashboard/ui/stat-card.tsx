import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  label: string;
  value: string | number;
  tag?: string;
}

export function StatCard({
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  label,
  value,
  tag,
}: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/30">
      <div className="flex items-center justify-between">
        <div className={cn("flex size-10 items-center justify-center rounded-lg", iconBg)}>
          <Icon className={cn("size-5", iconColor)} />
        </div>
        {tag && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {tag}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <span className="text-3xl font-extrabold tracking-tight text-foreground">
          {value}
        </span>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
