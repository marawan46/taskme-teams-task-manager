"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/modal-wrapper";
import { TaskForm, type TaskMember } from "./task-form";
import { Can } from "@casl/react";
import { PlusIcon, Pencil } from "lucide-react";
import type { Task } from "@/types/index.types";

interface TaskDialogProps {
     projectId: string;
     milestoneId: string;
     members: TaskMember[];
     task?: Task | null;
     parentTaskId?: string | null;
     trigger?: "button" | "icon";
}

export function TaskDialog({
     projectId,
     milestoneId,
     members,
     task = null,
     parentTaskId = null,
     trigger = "button",
}: TaskDialogProps) {
     const [open, setOpen] = useState(false);
     const isEdit = Boolean(task);

     const title = isEdit ? "Edit Task" : parentTaskId ? "Add Subtask" : "Add New Task";
     const description = isEdit
          ? "Update the task details."
          : parentTaskId
               ? "Create a subtask under this task."
               : "Create a task for this milestone.";

     return (
          <>
               <Can I={isEdit ? "update" : "add"} a="Tasks">
                    {isEdit || trigger === "icon" ? (
                         <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={isEdit ? "Edit task" : "Add subtask"}
                              onClick={() => setOpen(true)}
                         >
                              {isEdit ? (
                                   <Pencil className="size-4" />
                              ) : (
                                   <PlusIcon className="size-4" />
                              )}
                         </Button>
                    ) : (
                         <Button
                              variant="default"
                              size="sm"
                              onClick={() => setOpen(true)}
                         >
                              <PlusIcon data-icon="inline-start" />
                              Add Task
                         </Button>
                    )}

                    <ModalWrapper
                         open={open}
                         onOpenChange={setOpen}
                         title={title}
                         description={description}
                         className="sm:max-w-md"
                    >
                         <TaskForm
                              projectId={projectId}
                              milestoneId={milestoneId}
                              parentTaskId={parentTaskId}
                              task={task}
                              members={members}
                              onSuccess={() => setOpen(false)}
                         />
                    </ModalWrapper>
               </Can>
          </>
     );
}
