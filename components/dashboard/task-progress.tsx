import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/lib/dashboard-stats";

interface TaskProgressProps {
  stats: DashboardStats;
}

export function TaskProgress({ stats }: TaskProgressProps) {
  const total = stats.totalProjectTasks + stats.totalPrivateTasks;
  const completed = stats.completedProjectTasks + stats.completedPrivateTasks;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-bold text-foreground">Task Progress</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Overall</span>
            <span className="font-bold text-primary">{percent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ProgressMini
            label="Project"
            completed={stats.completedProjectTasks}
            total={stats.totalProjectTasks}
          />
          <ProgressMini
            label="Private"
            completed={stats.completedPrivateTasks}
            total={stats.totalPrivateTasks}
          />
        </div>
      </div>
    </div>
  );
}

function ProgressMini({
  label,
  completed,
  total,
}: {
  label: string;
  completed: number;
  total: number;
}) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-foreground">
        {completed}/{total}
      </p>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-border">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            label === "Project" ? "bg-primary" : "bg-primary/60"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
