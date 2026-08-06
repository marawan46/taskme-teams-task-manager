"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/modal-wrapper";
import { MilestoneForm } from "./milestone-form";
import { PlusIcon } from "lucide-react";
import { Can } from "@casl/react";
interface CreateMilestoneDialogProps {
     projectId: string;
}

export function CreateMilestoneDialog({
     projectId,
}: CreateMilestoneDialogProps) {
     const [open, setOpen] = useState(false);

     return (
          <Can I="add" a="Milestones">
               <Button onClick={() => setOpen(true)}>
                    <PlusIcon data-icon="inline-start" />
                    New Milestone
               </Button>

               <ModalWrapper
                    open={open}
                    onOpenChange={setOpen}
                    title="Create New Milestone"
                    description="Set a goal or checkpoint for this project."
                    className="sm:max-w-md"
               >
                    <MilestoneForm
                         projectId={projectId}
                         onSuccess={() => setOpen(false)}
                    />
               </ModalWrapper>
          </Can>
     );
}
