"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/modal-wrapper";
import { ProjectForm } from "./project-form";
import { PlusIcon } from "lucide-react";

export function CreateProjectDialog() {
     const [open, setOpen] = useState(false);

     return (
          <>
               <Button onClick={() => setOpen(true)}>
                    <PlusIcon data-icon="inline-start" />
                    New Project
               </Button>

               <ModalWrapper
                    open={open}
                    onOpenChange={setOpen}
                    title="Create New Project"
                    description="Set up a new project for your team."
                    className="sm:max-w-md"
               >
                    <ProjectForm
                         mode="create"
                         onSuccess={() => setOpen(false)}
                    />
               </ModalWrapper>
          </>
     );
}
