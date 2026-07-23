import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/index.types";

interface ProjectTaskItemProps {
  title: string;
  projectName: string;
  dueDate: string | null;
  assigneeName: string;
  assigneeAvatar: string | null;
  priority: number;
  status: TaskStatus;
  isLast?: boolean;
}

const priorityStyles: Record<number, string> = {
  0: "bg-muted text-muted-foreground",
  1: "bg-muted text-muted-foreground",
  2: "bg-primary/10 text-primary",
  3: "bg-destructive/10 text-destructive",
};

const priorityLabels: Record<number, string> = {
  0: "Low",
  1: "Med",
  2: "High",
  3: "Urgent",
};

const statusStyles: Record<TaskStatus, string> = {
  TODO: "bg-muted text-muted-foreground",
  IN_PROGRESS: "bg-primary/10 text-primary",
  UNDER_REVIEW: "bg-secondary text-secondary-foreground",
  DONE: "bg-muted text-muted-foreground",
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "Active",
  UNDER_REVIEW: "Review",
  DONE: "Done",
};

function formatDueDate(date: string | null): string {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `${diffDays} days left`;
}

export function ProjectTaskItem({
  title,
  projectName,
  dueDate,
  assigneeName,
  assigneeAvatar,
  priority,
  status,
  isLast = false,
}: ProjectTaskItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/30",
        !isLast && "border-b border-border"
      )}
    >
      <div className="min-w-0 grow">
        <h4 className="truncate text-base font-bold text-foreground">{title}</h4>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {projectName}
          </span>
          {dueDate && (
            <>
              <span className="text-xs text-muted-foreground">&bull;</span>
              <span className="text-xs font-medium text-muted-foreground">
                {formatDueDate(dueDate)}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-6">
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarImage src={assigneeAvatar ?? undefined} alt={assigneeName} />
            <AvatarFallback>
              {assigneeName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{assigneeName}</span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
              priorityStyles[priority] ?? priorityStyles[0]
            )}
          >
            {priorityLabels[priority] ?? "Low"}
          </span>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
              statusStyles[status]
            )}
          >
            {statusLabels[status]}
          </span>
        </div>
      </div>
    </div>
  );
}
