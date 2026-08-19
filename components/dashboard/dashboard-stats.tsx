import { CircleCheck, Clock, Eye, AlertCircle } from "lucide-react";
import { StatCard } from "./ui/stat-card";
import type { DashboardStats as DashboardStatsType } from "@/lib/dashboard-stats";

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        icon={CircleCheck}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50"
        label="Done Today"
        value={String(stats.doneToday).padStart(2, "0")}
        tag="Today"
      />
      <StatCard
        icon={Clock}
        iconColor="text-amber-600"
        iconBg="bg-amber-50"
        label="Pending"
        value={String(stats.pending).padStart(2, "0")}
        tag="Active"
      />
      <StatCard
        icon={Eye}
        iconColor="text-blue-600"
        iconBg="bg-blue-50"
        label="Under Review"
        value={String(stats.underReview).padStart(2, "0")}
        tag="Review"
      />
      <StatCard
        icon={AlertCircle}
        iconColor="text-red-600"
        iconBg="bg-red-50"
        label="Expired"
        value={String(stats.expired).padStart(2, "0")}
        tag="Alert"
      />
    </div>
  );
}
