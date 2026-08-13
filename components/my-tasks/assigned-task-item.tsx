"use client";

import { cn } from "@/lib/utils";
import { formatTimeRemaining } from "@/lib/helpers";
import { AssignedTaskDialog } from "./assigned-task-dialog";
import type { Task, TaskStatus } from "@/types/index.types";

export type AssignedTask = Task & {
     projects: { name: string } | null;
     assigned_profile: {
          full_name: string | null;
          avatar_url: string | null;
     } | null;
};

const priorityStyles: Record<number, string> = {
     0: "bg-orange-100 text-orange-800",
     1: "bg-yellow-100 text-yellow-800",
     2: "bg-primary/10 text-primary",
     3: "bg-destructive/10 text-destructive",
};

const priorityLabels: Record<number, string> = {
     0: "Low",
     1: "Med",
     2: "High",
     3: "Urgent",
};

const taskStatusStyles: Record<TaskStatus, string> = {
     TODO: "bg-muted text-muted-foreground",
     IN_PROGRESS: "bg-primary/10 text-primary",
     UNDER_REVIEW: "bg-secondary text-secondary-foreground",
     DONE: "bg-green-100 text-green-700",
};

const taskStatusLabels: Record<TaskStatus, string> = {
     TODO: "To Do",
     IN_PROGRESS: "In Progress",
     UNDER_REVIEW: "Under Review",
     DONE: "Done",
};

interface AssignedTaskItemProps {
     task: AssignedTask;
     isLast?: boolean;
}

export function AssignedTaskItem({
     task,
     isLast = false,
}: AssignedTaskItemProps) {
     return (
          <div
               className={cn(
                    "group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/20",
                    !isLast && "border-b border-border",
               )}
          >
               <div className="min-w-0 grow">
                    <p className="truncate text-sm font-semibold text-foreground">
                         {task.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                         {task.projects?.name ?? "Untitled project"}
                         {task.due_date && (
                              <>
                                   {" "}
                                   &bull;{" "}
                                   <span
                                        className={
                                             formatTimeRemaining(
                                                  task.due_date,
                                             ) === "Overdue"
                                                  ? "text-destructive"
                                                  : ""
                                        }
                                   >
                                        {formatTimeRemaining(task.due_date)}
                                   </span>
                              </>
                         )}
                    </p>
               </div>

               <div className="flex shrink-0 items-center gap-1.5">
                    <span
                         className={cn(
                              "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                              priorityStyles[task.priority] ??
                                   priorityStyles[0],
                         )}
                    >
                         {priorityLabels[task.priority] ?? "Low"}
                    </span>
                    <span
                         className={cn(
                              "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                              taskStatusStyles[task.status],
                         )}
                    >
                         {taskStatusLabels[task.status]}
                    </span>
                    <AssignedTaskDialog task={task} />
               </div>
          </div>
     );
}
