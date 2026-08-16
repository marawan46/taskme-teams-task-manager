"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/modal-wrapper";
import { MyTaskGroupForm } from "./my-task-group-form";
import { FolderPlus, Pencil } from "lucide-react";
import type { MyTaskGroup } from "@/types/index.types";

interface MyTaskGroupDialogProps {
     group?: MyTaskGroup | null;
     trigger?: "button" | "icon";
}

export function MyTaskGroupDialog({
     group = null,
     trigger = "button",
}: MyTaskGroupDialogProps) {
     const [open, setOpen] = useState(false);
     const isEdit = Boolean(group);

     const title = isEdit ? "Edit Task Group" : "New Task Group";
     const description = isEdit
          ? "Rename or delete this task group."
          : "Organize your personal tasks into groups.";

     return (
          <>
               {isEdit || trigger === "icon" ? (
                    <Button
                         variant="ghost"
                         size="icon-sm"
                         aria-label={isEdit ? "Edit task group" : "Add task group"}
                         onClick={() => setOpen(true)}
                    >
                         {isEdit ? (
                              <Pencil className="size-4" />
                         ) : (
                              <FolderPlus className="size-4" />
                         )}
                    </Button>
               ) : (
                    <Button onClick={() => setOpen(true)}>
                         <FolderPlus data-icon="inline-start" />
                         New Group
                    </Button>
               )}

               <ModalWrapper
                    open={open}
                    onOpenChange={setOpen}
                    title={title}
                    description={description}
                    className="sm:max-w-md"
               >
                    <MyTaskGroupForm
                         group={group}
                         onSuccess={() => setOpen(false)}
                    />
               </ModalWrapper>
          </>
     );
}
