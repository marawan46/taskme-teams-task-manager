"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
     createMyTask,
     deleteMyTask,
     updateMyTask,
} from "@/lib/actions/my-tasks";
import type {
     ApiResponse,
     MyTask,
     MyTaskGroup,
} from "@/types/index.types";

interface MyTaskFormProps {
     task?: MyTask | null;
     groups: MyTaskGroup[];
     onSuccess?: () => void;
}

type FormState = ApiResponse;

const selectClassName =
     "flex w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:text-sm dark:bg-input/30";

export function MyTaskForm({
     task = null,
     groups,
     onSuccess,
}: MyTaskFormProps) {
     const router = useRouter();
     const calledRef = useRef(false);
     const isEdit = Boolean(task);

     const [state, formAction, isPending] = useActionState(
          async (_prev: FormState, formData: FormData): Promise<FormState> => {
               const payload = {
                    name: formData.get("name") as string,
                    description:
                         (formData.get("description") as string) || null,
                    priority: Number(formData.get("priority") ?? 0),
                    due_date: new Date(formData.get("due_date") as string),
                    group_id: formData.get("group_id") as string,
               };

               if (task) {
                    return updateMyTask({ id: task.id, ...payload });
               }

               return createMyTask(payload);
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

     const handleDelete = async () => {
          if (!task) return;
          if (!confirm("Delete this task?")) return;
          const res = await deleteMyTask({ id: task.id });
          if (res.status === "success") {
               onSuccess?.();
               router.refresh();
          }
     };

     return (
          <form action={formAction}>
               <FieldGroup>
                    <Field>
                         <FieldLabel htmlFor="name">Task Name</FieldLabel>
                         <Input
                              id="name"
                              name="name"
                              placeholder="e.g. Buy groceries"
                              required
                               defaultValue={task?.name ?? ""}
                          />
                     </Field>

                    <Field>
                         <FieldLabel htmlFor="group_id">Group</FieldLabel>
                         <select
                              id="group_id"
                              name="group_id"
                              required
                              defaultValue={task?.group_id ?? groups[0]?.id}
                              className={selectClassName}
                         >
                              {groups.length === 0 && (
                                   <option value="" disabled>
                                        Create a group first
                                   </option>
                              )}
                              {groups.map((group) => (
                                   <option key={group.id} value={group.id}>
                                        {group.name}
                                   </option>
                              ))}
                         </select>
                    </Field>

                    <Field>
                         <FieldLabel htmlFor="description">Description</FieldLabel>
                         <textarea
                              id="description"
                              name="description"
                              placeholder="A brief description of the task"
                              rows={3}
                              defaultValue={task?.description ?? ""}
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
                              min={isEdit ? undefined : today}
                              defaultValue={
                                   task?.due_date
                                        ? new Date(task.due_date)
                                               .toISOString()
                                               .split("T")[0]
                                        : ""
                              }
                         />
                    </Field>

                    <Field>
                         <FieldLabel htmlFor="priority">Priority</FieldLabel>
                         <select
                              id="priority"
                              name="priority"
                              defaultValue={task?.priority ?? 0}
                              className={selectClassName}
                         >
                              <option value={0}>Low</option>
                              <option value={1}>Medium</option>
                              <option value={2}>High</option>
                         </select>
                    </Field>

                    {state?.error && (
                         <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                              {state.error.message}
                         </div>
                    )}

                    <div className="flex items-center gap-2">
                         {isEdit && (
                              <Button
                                   type="button"
                                   variant="destructive"
                                   onClick={handleDelete}
                                   disabled={isPending}
                              >
                                   Delete
                              </Button>
                         )}
                         <Button type="submit" disabled={isPending}>
                              {isPending ? (
                                   <>
                                        {isEdit ? "Saving..." : "Creating..."}
                                        <Spinner data-icon="inline-start" />
                                   </>
                              ) : isEdit ? (
                                   "Save Task"
                              ) : (
                                   "Create Task"
                              )}
                         </Button>
                    </div>
               </FieldGroup>
          </form>
     );
}
