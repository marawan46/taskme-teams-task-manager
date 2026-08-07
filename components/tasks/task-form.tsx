"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { createTask, deleteTask, updateTask } from "@/lib/actions/tasks";
import type { ApiResponse, Task } from "@/types/index.types";
import { Can } from "@casl/react";

export interface TaskMember {
     id: string;
     full_name: string | null;
}

interface TaskFormProps {
     projectId: string;
     milestoneId: string;
     parentTaskId?: string | null;
     task?: Task | null;
     members: TaskMember[];
     onSuccess?: () => void;
}

type FormState = ApiResponse;

const selectClassName =
     "flex w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:text-sm dark:bg-input/30";

export function TaskForm({
     projectId,
     milestoneId,
     parentTaskId = null,
     task = null,
     members,
     onSuccess,
}: TaskFormProps) {
     const router = useRouter();
     const calledRef = useRef(false);

     const [state, formAction, isPending] = useActionState(
          async (_prev: FormState, formData: FormData): Promise<FormState> => {
               const payload = {
                    title: formData.get("title") as string,
                    description: (formData.get("description") as string) || null,
                    due_date: new Date(formData.get("due_date") as string),
                    priority: Number(formData.get("priority") ?? 0),
                    status: (formData.get("status") as
                         | "TODO"
                         | "IN_PROGRESS"
                         | "UNDER_REVIEW"
                         | "DONE") || "TODO",
                    assigned_to: formData.get("assigned_to") as string,
               };

               if (task) {
                    return updateTask({ id: task.id, ...payload });
               }

               return createTask({
                    project_id: projectId,
                    parent_milestone_id: milestoneId,
                    parent_task_id: parentTaskId,
                    ...payload,
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
     const isEdit = Boolean(task);

     const handleDelete = async () => {
          if (!task) return;
          if (!confirm("Delete this task?")) return;
          const res = await deleteTask({ id: task.id });
          if (res.status === "success") {
               onSuccess?.();
               router.refresh();
          }
     };

     return (
          <form action={formAction}>
               <FieldGroup>
                    <Field>
                         <FieldLabel htmlFor="title">Title</FieldLabel>
                         <Input
                              id="title"
                              name="title"
                              placeholder="e.g. Implement login flow"
                              required
                              defaultValue={task?.title ?? ""}
                         />
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
                         <FieldLabel htmlFor="assigned_to">Assignee</FieldLabel>
                         <select
                              id="assigned_to"
                              name="assigned_to"
                              required
                              defaultValue={task?.assigned_to ?? ""}
                              className={selectClassName}
                         >
                              <option value="" disabled>
                                   Select a member
                              </option>
                              {members.map((member) => (
                                   <option key={member.id} value={member.id}>
                                        {member.full_name ?? "Unnamed member"}
                                   </option>
                              ))}
                         </select>
                    </Field>

                    <Field>
                         <FieldLabel htmlFor="due_date">Due Date</FieldLabel>
                         <Input
                              id="due_date"
                              name="due_date"
                              type="date"
                              required
                              min={today}
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
                              <option value={3}>Urgent</option>
                         </select>
                    </Field>

                    <Field>
                         <FieldLabel htmlFor="status">Status</FieldLabel>
                         <select
                              id="status"
                              name="status"
                              defaultValue={task?.status ?? "TODO"}
                              className={selectClassName}
                         >
                              <option value="TODO">To Do</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="UNDER_REVIEW">Under Review</option>
                              <option value="DONE">Done</option>
                         </select>
                    </Field>

                    {state?.error && (
                         <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                              {state.error.message}
                         </div>
                    )}

                    <div className="flex items-center gap-2">
                         {isEdit && (
                              <Can I="delete" a="Tasks">
                                   <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={handleDelete}
                                        disabled={isPending}
                                   >
                                        Delete
                                   </Button>
                              </Can>
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
