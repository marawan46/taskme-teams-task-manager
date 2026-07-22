import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  iconColor?: string;
  label: string;
  value: string | number;
  tag?: string;
}

export function StatCard({
  icon: Icon,
  iconColor = "text-primary",
  label,
  value,
  tag,
}: StatCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <Icon className={cn("size-6", iconColor)} />
        {tag && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {tag}
          </span>
        )}
      </div>
      <span className="text-3xl font-extrabold text-foreground">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
