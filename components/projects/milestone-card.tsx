"use client";

import {
     Calendar,
     Layers,
     CheckCircle,
     Clock,
     AlertCircle,
     ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/types/index.types";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskItem, type MilestoneTask } from "@/components/tasks/task-item";
import type { TaskMember } from "@/components/tasks/task-form";
import {
     Collapsible,
     CollapsibleContent,
     CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

type MilestoneStatus = "completed" | "in_progress" | "upcoming";

interface MilestoneCardProps {
     milestone: Milestone & { tasks?: MilestoneTask[] };
     projectId: string;
     members: TaskMember[];
     status?: MilestoneStatus;
     taskCount?: number;
     progress?: number;
}

function formatDateRange(start: string | null, end: string | null): string {
     const fmt = (d: string) =>
          new Date(d).toLocaleDateString("en-US", {
               month: "short",
               day: "numeric",
          });
     if (start && end) return `${fmt(start)} - ${fmt(end)}`;
     if (start) return fmt(start);
     if (end) return fmt(end);
     return "";
}

const statusConfig: Record<
     MilestoneStatus,
     {
          icon: React.ReactNode;
          badge: string;
          badgeStyle: string;
          borderStyle: string;
          iconBg: string;
     }
> = {
     completed: {
          icon: <CheckCircle className="size-5" />,
          badge: "Completed",
          badgeStyle: "text-primary",
          borderStyle: "border-l-primary",
          iconBg: "bg-primary/10 text-primary",
     },
     in_progress: {
          icon: <Clock className="size-5" />,
          badge: "In Progress",
          badgeStyle: "text-muted-foreground",
          borderStyle: "border-l-muted-foreground",
          iconBg: "bg-muted text-muted-foreground",
     },
     upcoming: {
          icon: <AlertCircle className="size-5" />,
          badge: "Upcoming",
          badgeStyle: "text-muted-foreground",
          borderStyle: "border-l-transparent",
          iconBg: "bg-muted text-muted-foreground",
     },
};

function buildTaskTree(tasks: MilestoneTask[]): {
     topLevel: MilestoneTask[];
     childrenByParent: Map<string, MilestoneTask[]>;
} {
     const taskIds = new Set(tasks.map((t) => t.id));
     const childrenByParent = new Map<string, MilestoneTask[]>();
     const byDueDate = (a: MilestoneTask, b: MilestoneTask) =>
          new Date(a.due_date).getTime() - new Date(b.due_date).getTime();

     tasks.forEach((task) => {
          if (task.parent_task_id && taskIds.has(task.parent_task_id)) {
               const siblings = childrenByParent.get(task.parent_task_id) ?? [];
               siblings.push(task);
               childrenByParent.set(task.parent_task_id, siblings);
          }
     });

     childrenByParent.forEach((siblings) => siblings.sort(byDueDate));

     const topLevel = tasks
          .filter((t) => !t.parent_task_id || !taskIds.has(t.parent_task_id))
          .sort(byDueDate);

     return { topLevel, childrenByParent };
}

export function MilestoneCard({
     milestone,
     projectId,
     members,
     status = "upcoming",
     taskCount = 0,
     progress,
}: MilestoneCardProps) {
     const config = statusConfig[status];
     const dateRange = formatDateRange(
          milestone.created_at,
          milestone.due_date,
     );
     const tasks = milestone.tasks ?? [];
     const { topLevel, childrenByParent } = buildTaskTree(tasks);

     return (
          <article
               className={cn(
                    "group bg-card p-6 rounded-xl transition-all hover:shadow-md border-l-4",
                    config.borderStyle,
                    status === "upcoming" && "opacity-60",
               )}
          >
               <Collapsible defaultOpen>
                    <div className="flex items-start gap-6">
                         <div className="mt-1">
                              <div
                                   className={cn(
                                        "flex size-10 items-center justify-center rounded-full",
                                        config.iconBg,
                                   )}
                              >
                                   {config.icon}
                              </div>
                         </div>
                         <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                   <h3 className="text-xl font-bold text-foreground font-heading truncate">
                                        {milestone.title}
                                   </h3>
                                   <div className="flex items-center gap-2 shrink-0 ml-4">
                                        <span
                                             className={cn(
                                                  "text-xs font-bold",
                                                  config.badgeStyle,
                                             )}
                                        >
                                             {config.badge}
                                             {progress != null &&
                                                  ` (${progress}%)`}
                                        </span>
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
                                             <span className="sr-only">
                                                  Toggle milestone details
                                             </span>
                                        </CollapsibleTrigger>
                                   </div>
                              </div>

                              <CollapsibleContent>
                                   {milestone.description && (
                                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed max-w-2xl">
                                             {milestone.description}
                                        </p>
                                   )}

                                   {progress != null && (
                                        <div className="w-full h-1.5 bg-muted rounded-full mb-4">
                                             <div
                                                  className="h-full bg-primary rounded-full transition-all"
                                                  style={{
                                                       width: `${progress}%`,
                                                  }}
                                             />
                                        </div>
                                   )}

                                   {topLevel.length > 0 && (
                                        <ul className="mb-4 divide-y divide-border rounded-lg border border-border overflow-hidden">
                                             {topLevel.map((task) => (
                                                  <li key={task.id}>
                                                       <TaskItem
                                                            task={task}
                                                            childrenByParent={
                                                                 childrenByParent
                                                            }
                                                            projectId={
                                                                 projectId
                                                            }
                                                            milestoneId={
                                                                 milestone.id
                                                            }
                                                            members={members}
                                                       />
                                                  </li>
                                             ))}
                                        </ul>
                                   )}

                                   <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-4">
                                             {dateRange && (
                                                  <span className="flex items-center gap-1.5">
                                                       <Calendar className="size-3.5" />
                                                       {dateRange}
                                                  </span>
                                             )}
                                             {taskCount > 0 && (
                                                  <span className="flex items-center gap-1.5">
                                                       <Layers className="size-3.5" />
                                                       {taskCount} Tasks
                                                  </span>
                                             )}
                                        </div>
                                        <TaskDialog
                                             projectId={projectId}
                                             milestoneId={milestone.id}
                                             members={members}
                                        />
                                   </div>
                              </CollapsibleContent>
                         </div>
                    </div>
               </Collapsible>
          </article>
     );
}
