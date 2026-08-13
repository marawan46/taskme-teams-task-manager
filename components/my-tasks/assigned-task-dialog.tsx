"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ModalWrapper } from "@/components/modal-wrapper";
import { deleteTask, updateTask } from "@/lib/actions/tasks";
import { Pencil, Trash2 } from "lucide-react";
import type { ApiResponse, Task } from "@/types/index.types";

interface AssignedTaskDialogProps {
     task: Task;
}

type FormState = ApiResponse;

const selectClassName =
     "flex w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:text-sm dark:bg-input/30";

export function AssignedTaskDialog({ task }: AssignedTaskDialogProps) {
     const [open, setOpen] = useState(false);
     const router = useRouter();
     const calledRef = useRef(false);

     const [state, formAction, isPending] = useActionState(
          async (_prev: FormState, formData: FormData): Promise<FormState> => {
               return updateTask({
                    id: task.id,
                    title: formData.get("title") as string,
                    description:
                         (formData.get("description") as string) || null,
                    priority: Number(formData.get("priority") ?? 0),
                    status: formData.get("status") as
                         | "TODO"
                         | "IN_PROGRESS"
                         | "UNDER_REVIEW"
                         | "DONE",
                    due_date: new Date(formData.get("due_date") as string),
               });
          },
          { status: "error", data: null, error: null } as FormState,
     );

     useEffect(() => {
          if (state?.status === "success" && !calledRef.current) {
               calledRef.current = true;
               setOpen(false);
               router.refresh();
          }
     }, [state, router]);

     const handleDelete = async () => {
          if (!confirm(`Delete "${task.title}"?`)) return;
          const res = await deleteTask({ id: task.id });
          if (res.status === "success") {
               setOpen(false);
               router.refresh();
          }
     };

     return (
          <>
               <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit task"
                    onClick={() => setOpen(true)}
               >
                    <Pencil className="size-4" />
               </Button>
               <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete task"
                    onClick={handleDelete}
               >
                    <Trash2 className="size-4" />
               </Button>

               <ModalWrapper
                    open={open}
                    onOpenChange={setOpen}
                    title="Edit Task"
                    description="Update the details of this assigned task."
                    className="sm:max-w-md"
               >
                    <form action={formAction}>
                         <FieldGroup>
                              <Field>
                                   <FieldLabel htmlFor="title">Title</FieldLabel>
                                   <Input
                                        id="title"
                                        name="title"
                                        required
                                        defaultValue={task.title}
                                   />
                              </Field>

                              <Field>
                                   <FieldLabel htmlFor="description">
                                        Description
                                   </FieldLabel>
                                   <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        defaultValue={task.description ?? ""}
                                        className="flex w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:text-sm dark:bg-input/30"
                                   />
                              </Field>

                              <Field>
                                   <FieldLabel htmlFor="due_date">
                                        Due Date
                                   </FieldLabel>
                                   <Input
                                        id="due_date"
                                        name="due_date"
                                        type="date"
                                        required
                                        defaultValue={
                                             task.due_date
                                                  ? new Date(task.due_date)
                                                         .toISOString()
                                                         .split("T")[0]
                                                  : ""
                                        }
                                   />
                              </Field>

                              <Field>
                                   <FieldLabel htmlFor="priority">
                                        Priority
                                   </FieldLabel>
                                   <select
                                        id="priority"
                                        name="priority"
                                        defaultValue={task.priority ?? 0}
                                        className={selectClassName}
                                   >
                                        <option value={0}>Low</option>
                                        <option value={1}>Medium</option>
                                        <option value={2}>High</option>
                                        <option value={3}>Urgent</option>
                                   </select>
                              </Field>

                              <Field>
                                   <FieldLabel htmlFor="status">Status</FieldLabel>
                                   <select
                                        id="status"
                                        name="status"
                                        defaultValue={task.status ?? "TODO"}
                                        className={selectClassName}
                                   >
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">
                                             In Progress
                                        </option>
                                        <option value="UNDER_REVIEW">
                                             Under Review
                                        </option>
                                        <option value="DONE">Done</option>
                                   </select>
                              </Field>

                              {state?.error && (
                                   <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                                        {state.error.message}
                                   </div>
                              )}

                              <div className="flex items-center gap-2">
                                   <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={handleDelete}
                                        disabled={isPending}
                                   >
                                        Delete
                                   </Button>
                                   <Button type="submit" disabled={isPending}>
                                        {isPending ? (
                                             <>
                                                  Saving...
                                                  <Spinner data-icon="inline-start" />
                                             </>
                                        ) : (
                                             "Save Task"
                                        )}
                                   </Button>
                              </div>
                         </FieldGroup>
                    </form>
               </ModalWrapper>
          </>
     );
}
