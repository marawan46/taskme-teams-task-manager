"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { createProject, updateProject } from "@/lib/actions/projects";
import type { Project } from "@/types/index.types";
import type { ApiResponse } from "@/types/index.types";

interface ProjectFormProps {
     mode: "create" | "update";
     project?: Project;
     onSuccess?: () => void;
}

type FormState = ApiResponse;

export function ProjectForm({ mode, project, onSuccess }: ProjectFormProps) {
     const router = useRouter();
     const isUpdate = mode === "update" && project;
     const calledRef = useRef(false);

     const [state, formAction, isPending] = useActionState(
          async (_prev: FormState, formData: FormData): Promise<FormState> => {
               const raw = {
                    name: formData.get("name") as string,
                    description:
                         (formData.get("description") as string) || null,
                    due_date: formData.get("due_date") as string,
               };

               if (isUpdate) {
                    return updateProject({
                         id: project!.id,
                         ...raw,
                         due_date: raw.due_date
                              ? new Date(raw.due_date)
                              : undefined,
                    });
               }

               return createProject({
                    ...raw,
                    due_date: new Date(raw.due_date),
               });
          },
          { status: "error", data: null, error: null } as FormState,
     );

     useEffect(() => {
          if (state?.status === "success" && !calledRef.current) {
               calledRef.current = true;
               onSuccess?.();
               router.refresh();
          }
     }, [state, onSuccess, router]);

     const today = new Date().toISOString().split("T")[0];

     return (
          <form action={formAction}>
               <FieldGroup>
                    <Field>
                         <FieldLabel htmlFor="name">Project Name</FieldLabel>
                         <Input
                              id="name"
                              name="name"
                              placeholder="My awesome project"
                              required
                              defaultValue={project?.name ?? ""}
                         />
                    </Field>

                    <Field>
                         <FieldLabel htmlFor="description">
                              Description
                         </FieldLabel>
                         <textarea
                              id="description"
                              name="description"
                              placeholder="A brief description of the project"
                              defaultValue={project?.description ?? ""}
                              rows={3}
                              className="flex w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:text-sm dark:bg-input/30"
                         />
                    </Field>

                    <Field>
                         <FieldLabel htmlFor="due_date">Due Date</FieldLabel>
                         <Input
                              id="due_date"
                              name="due_date"
                              type="date"
                              required
                              min={isUpdate ? undefined : today}
                              defaultValue={
                                   project?.due_date
                                        ? new Date(project.due_date)
                                               .toISOString()
                                               .split("T")[0]
                                        : ""
                              }
                         />
                    </Field>

                    {state?.error && (
                         <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                              {state.error.message}
                         </div>
                    )}

                    <Field>
                         <Button type="submit" disabled={isPending}>
                              {isPending ? (
                                   <>
                                        {isUpdate
                                             ? "Updating..."
                                             : "Creating..."}
                                        <Spinner data-icon="inline-start" />
                                   </>
                              ) : isUpdate ? (
                                   "Update Project"
                              ) : (
                                   "Create Project"
                              )}
                         </Button>
                    </Field>
               </FieldGroup>
          </form>
     );
}
