"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTimeRemaining } from "@/lib/helpers";
import { deleteMyTask, updateMyTask } from "@/lib/actions/my-tasks";
import { MyTaskDialog } from "./my-task-dialog";
import { Trash2 } from "lucide-react";
import type { MyTask, MyTaskGroup } from "@/types/index.types";

type DotColor = "destructive" | "primary" | "muted-foreground";

const dotColorMap: Record<number, DotColor> = {
     0: "muted-foreground",
     1: "primary",
     2: "destructive",
};

const dotStyles: Record<DotColor, string> = {
     destructive: "bg-destructive",
     primary: "bg-primary",
     "muted-foreground": "bg-muted-foreground",
};

interface MyTaskItemProps {
     task: MyTask;
     groups?: MyTaskGroup[];
     isLast?: boolean;
}

export function MyTaskItem({
     task,
     groups = [],
     isLast = false,
}: MyTaskItemProps) {
     const router = useRouter();
     const dotColor = dotColorMap[task.priority] ?? "muted-foreground";

     const handleDelete = async () => {
          if (!confirm(`Delete "${task.name}"?`)) return;
          const res = await deleteMyTask({ id: task.id });
          if (res.status === "success") {
               router.refresh();
          }
     };

     const handleToggle = async () => {
          const res = await updateMyTask({
               id: task.id,
               completed: !task.completed,
          });
          if (res.status === "success") {
               router.refresh();
          }
     };

     return (
          <div
               className={cn(
                    "group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/20",
                    task.completed && "opacity-60",
                    !isLast && "border-b border-border",
               )}
          >
               <input
                    type="checkbox"
                    aria-label={task.completed ? "Mark as not done" : "Mark as done"}
                    checked={task.completed}
                    onChange={handleToggle}
                    className="size-4 shrink-0 cursor-pointer accent-primary"
               />
               <span
                    className={cn(
                         "grow min-w-0 text-sm font-medium text-foreground truncate",
                         task.completed && "text-muted-foreground line-through",
                    )}
               >
                    {task.name}
               </span>
               {task.due_date && (
                    <span
                         className={cn(
                              "shrink-0 text-xs font-medium",
                              formatTimeRemaining(task.due_date) === "Overdue"
                                   ? "text-destructive"
                                   : "text-muted-foreground",
                         )}
                    >
                         {formatTimeRemaining(task.due_date)}
                    </span>
               )}
               <div
                    className={cn(
                         "size-2 shrink-0 rounded-full",
                         dotStyles[dotColor],
                    )}
               />
               <div className="flex shrink-0 items-center gap-1">
                    <MyTaskDialog task={task} groups={groups} trigger="icon" />
                    <Button
                         variant="ghost"
                         size="icon-sm"
                         aria-label="Delete task"
                         onClick={handleDelete}
                    >
                         <Trash2 className="size-4" />
                    </Button>
               </div>
          </div>
     );
}
