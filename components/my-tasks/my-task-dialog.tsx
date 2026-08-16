"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/modal-wrapper";
import { MyTaskForm } from "./my-task-form";
import { PlusIcon, Pencil } from "lucide-react";
import type { MyTask, MyTaskGroup } from "@/types/index.types";

interface MyTaskDialogProps {
     task?: MyTask | null;
     groups?: MyTaskGroup[];
     trigger?: "button" | "icon";
}

export function MyTaskDialog({
     task = null,
     groups = [],
     trigger = "button",
}: MyTaskDialogProps) {
     const [open, setOpen] = useState(false);
     const isEdit = Boolean(task);

     const title = isEdit ? "Edit Task" : "Add New Task";
     const description = isEdit
          ? "Update your personal task details."
          : "Create a personal task to keep track of your to-dos.";

     return (
          <>
               {isEdit || trigger === "icon" ? (
                    <Button
                         variant="ghost"
                         size="icon-sm"
                         aria-label={isEdit ? "Edit task" : "Add task"}
                         onClick={() => setOpen(true)}
                    >
                         {isEdit ? (
                              <Pencil className="size-4" />
                         ) : (
                              <PlusIcon className="size-4" />
                         )}
                    </Button>
               ) : (
                    <Button onClick={() => setOpen(true)}>
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
                    <MyTaskForm
                         task={task}
                         groups={groups}
                         onSuccess={() => setOpen(false)}
                    />
               </ModalWrapper>
          </>
     );
}
