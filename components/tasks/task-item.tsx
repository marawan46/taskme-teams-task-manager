"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
     Collapsible,
     CollapsibleContent,
     CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTimeRemaining } from "@/lib/helpers";
import type { Task, TaskStatus } from "@/types/index.types";
import { TaskDialog } from "./task-dialog";
import type { TaskMember } from "./task-form";
import { getInitials } from "@/lib/helpers";
export type MilestoneTask = Task & {
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


interface TaskItemProps {
     task: MilestoneTask;
     childrenByParent: Map<string, MilestoneTask[]>;
     projectId: string;
     milestoneId: string;
     members: TaskMember[];
     depth?: number;
}

export function TaskItem({
     task,
     childrenByParent,
     projectId,
     milestoneId,
     members,
     depth = 0,
}: TaskItemProps) {
     const childrenTasks = childrenByParent.get(task.id) ?? [];
     const hasChildren = childrenTasks.length > 0;
     const assignee = task.assigned_profile;

     return (
          <Collapsible defaultOpen>
               <div
                    className="relative flex items-center gap-2 px-3 py-2.5"
                    style={{ paddingLeft: `${8 + depth * 12}px` }}
               >
                     {depth > 0 && (
                          <>
                               <span
                                    aria-hidden
                                    className="pointer-events-none absolute bottom-1/2 left-0 top-0 w-px bg-border"
                               />
                               <span
                                    aria-hidden
                                    className="pointer-events-none absolute left-0 top-1/2 h-px -translate-y-1/2 bg-border"
                                    style={{
                                         width: `${
                                              (hasChildren ? 44 : 36) +
                                              depth * 12
                                         }px`,
                                    }}
                               />
                          </>
                     )}
                    {hasChildren ? (
                         <CollapsibleTrigger
                              render={
                                   <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        className="aria-expanded:rotate-90 transition-transform"
                                   />
                              }
                         >
                              <ChevronRight className="size-4" />
                              <span className="sr-only">Toggle subtasks</span>
                         </CollapsibleTrigger>
                    ) : (
                         <span className="size-5 shrink-0" />
                    )}

                    <div className="flex min-w-0 flex-1 items-center gap-2">
                         <Avatar size="sm" className="shrink-0">
                              <AvatarImage
                                   src={assignee?.avatar_url ?? undefined}
                                   alt={assignee?.full_name ?? ""}
                              />
                              <AvatarFallback>
                                   {getInitials(assignee?.full_name ?? "Unassigned")}
                              </AvatarFallback>
                         </Avatar>
                         <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">
                                   {task.title}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                   <span>
                                        {assignee?.full_name ?? "Unassigned"}
                                   </span>
                                   <span>&bull;</span>
                                   <span>
                                        {formatTimeRemaining(task.due_date)}
                                   </span>
                              </div>
                         </div>
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
                         <TaskDialog
                              projectId={projectId}
                              milestoneId={milestoneId}
                              members={members}
                              parentTaskId={task.id}
                              trigger="icon"
                         />
                         <TaskDialog
                              projectId={projectId}
                              milestoneId={milestoneId}
                              members={members}
                              task={task}
                         />
                    </div>
               </div>

               {hasChildren && (
                    <CollapsibleContent>
                         <ul style={{ marginLeft: `${22 + depth * 12}px` }}>
                              {childrenTasks.map((child) => (
                                   <li key={child.id}>
                                        <TaskItem
                                             key={child.id}
                                             task={child}
                                             childrenByParent={childrenByParent}
                                             projectId={projectId}
                                             milestoneId={milestoneId}
                                             members={members}
                                             depth={depth + 1}
                                        />
                                   </li>
                              ))}
                         </ul>
                    </CollapsibleContent>
               )}
          </Collapsible>
     );
}
