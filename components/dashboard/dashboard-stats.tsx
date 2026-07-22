import { CircleCheck, Clock, Eye, AlertCircle } from "lucide-react";
import { StatCard } from "./ui/stat-card";

interface DashboardStatsProps {
  doneToday?: number;
  pending?: number;
  underReview?: number;
  expired?: number;
}

export function DashboardStats({
  doneToday = 12,
  pending = 4,
  underReview = 7,
  expired = 2,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        icon={CircleCheck}
        iconColor="text-primary"
        label="Done Today"
        value={String(doneToday).padStart(2, "0")}
        tag="Today"
      />
      <StatCard
        icon={Clock}
        iconColor="text-primary"
        label="Pending"
        value={String(pending).padStart(2, "0")}
        tag="Active"
      />
      <StatCard
        icon={Eye}
        iconColor="text-muted-foreground"
        label="Under Review"
        value={String(underReview).padStart(2, "0")}
        tag="Review"
      />
      <StatCard
        icon={AlertCircle}
        iconColor="text-destructive"
        label="Expired"
        value={String(expired).padStart(2, "0")}
        tag="Alert"
      />
    </div>
  );
}
