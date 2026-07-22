import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Priority = "high" | "medium" | "low";
type Status = "active" | "review";

interface ProjectTaskItemProps {
  title: string;
  project: string;
  deadline: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  priority: Priority;
  status: Status;
  isLast?: boolean;
}

const priorityStyles: Record<Priority, string> = {
  high: "bg-primary/10 text-primary",
  medium: "bg-muted text-muted-foreground",
  low: "bg-muted text-muted-foreground",
};

const statusStyles: Record<Status, string> = {
  active: "bg-primary/10 text-primary",
  review: "bg-secondary text-secondary-foreground",
};

export function ProjectTaskItem({
  title,
  project,
  deadline,
  assignee,
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
            {project}
          </span>
          <span className="text-xs text-muted-foreground">&bull;</span>
          <span className="text-xs font-medium text-muted-foreground">
            {deadline}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-6">
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarImage src={assignee.avatar} alt={assignee.name} />
            <AvatarFallback>
              {assignee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{assignee.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
              priorityStyles[priority]
            )}
          >
            {priority === "high" ? "High" : priority === "medium" ? "Med" : "Low"}
          </span>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
              statusStyles[status]
            )}
          >
            {status === "active" ? "Active" : "Review"}
          </span>
        </div>
      </div>
    </div>
  );
}
