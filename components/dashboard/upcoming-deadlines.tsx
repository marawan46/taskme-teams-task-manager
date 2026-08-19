import { CalendarClock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectTaskRow } from "@/lib/data";
import type { MyTask } from "@/types/index.types";

interface UpcomingDeadlinesProps {
  projectTasks: ProjectTaskRow[];
  privateTasks: MyTask[];
}

interface DeadlineItem {
  id: string;
  title: string;
  dueDate: string;
  source: "project" | "private";
  projectName?: string;
  isOverdue: boolean;
}

function getDaysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDeadline(days: number): string {
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `${days} days`;
  return `${Math.ceil(days / 7)} weeks`;
}

export function UpcomingDeadlines({
  projectTasks,
  privateTasks,
}: UpcomingDeadlinesProps) {
  const items: DeadlineItem[] = [
    ...projectTasks
      .filter((t) => t.due_date && t.status !== "DONE")
      .map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.due_date!,
        source: "project" as const,
        projectName: t.projects?.name,
        isOverdue: getDaysUntil(t.due_date!) < 0,
      })),
    ...privateTasks
      .filter((t) => t.due_date && !t.completed)
      .map((t) => ({
        id: t.id,
        title: t.name,
        dueDate: t.due_date,
        source: "private" as const,
        isOverdue: getDaysUntil(t.due_date) < 0,
      })),
  ]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <CalendarClock className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-bold text-foreground">Upcoming Deadlines</h3>
      </div>

      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No upcoming deadlines
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const days = getDaysUntil(item.dueDate);
            return (
              <li key={item.id} className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-1 size-2 shrink-0 rounded-full",
                    item.isOverdue ? "bg-red-500" : days <= 2 ? "bg-amber-500" : "bg-emerald-500"
                  )}
                />
                <div className="min-w-0 grow">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  {item.projectName && (
                    <p className="truncate text-xs text-muted-foreground">
                      {item.projectName}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    "shrink-0 text-xs font-semibold",
                    item.isOverdue
                      ? "text-red-600"
                      : days <= 2
                        ? "text-amber-600"
                        : "text-muted-foreground"
                  )}
                >
                  {item.isOverdue && (
                    <AlertTriangle className="mb-0.5 inline size-3" />
                  )}{" "}
                  {formatDeadline(days)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
