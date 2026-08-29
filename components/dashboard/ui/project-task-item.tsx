import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDueDate } from "@/lib/helpers";
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
     const priorityConfig = {
          0: { label: "Low", variant: "lowPriority" },
          1: { label: "Med", variant: "default" },
          2: { label: "High", variant: "primary" },
          3: { label: "Urgent", variant: "destructive" },
     } as const;

     const statusConfig = {
          TODO: { label: "To Do", variant: "default" },
          IN_PROGRESS: { label: "Active", variant: "primary" },
          UNDER_REVIEW: { label: "Review", variant: "secondary" },
          DONE: { label: "Done", variant: "default" },
     } as const;
     const priorityItem = priorityConfig[priority as 0 | 1 | 2 | 3];
     const statusItem = statusConfig[status];
     return (
          <div
               className={cn(
                    "flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/30",
                    !isLast && "border-b border-border",
               )}
          >
               <div className="min-w-0 grow">
                    <h4 className="truncate text-base font-bold text-foreground">
                         {title}
                    </h4>
                    <div className="mt-0.5 flex items-center gap-2">
                         <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                              {projectName}
                         </span>
                         {dueDate && (
                              <>
                                   <span className="text-xs text-muted-foreground">
                                        &bull;
                                   </span>
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
                              <AvatarImage
                                   src={assigneeAvatar ?? undefined}
                                   alt={assigneeName}
                              />
                              <AvatarFallback>
                                   {assigneeName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                              </AvatarFallback>
                         </Avatar>
                         <span className="text-xs text-muted-foreground">
                              {assigneeName}
                         </span>
                    </div>
                    <div className="flex items-center gap-1">
                         <Badge variant={priorityItem.variant}>
                              {priorityItem.label}
                         </Badge>

                         <Badge variant={statusItem.variant}>
                              {statusItem.label}
                         </Badge>
                    </div>
               </div>
          </div>
     );
}
