"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Priority, TaskStatus } from "@/lib/types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

export interface CreateTaskInput {
  projectId: string;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string | null;
  assigneeId?: string | null;
}

export async function createTask(input: CreateTaskInput) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("tasks").insert({
    project_id: input.projectId,
    title: input.title.trim(),
    description: input.description ?? null,
    status: input.status ?? "todo",
    priority: input.priority ?? "medium",
    due_date: input.dueDate ?? null,
    assignee_id: input.assigneeId ?? null,
    created_by: user.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/projects/${input.projectId}`);
  revalidatePath("/tasks");
}

export interface UpdateTaskPatch {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: Priority;
  due_date?: string | null;
  assignee_id?: string | null;
}

export async function updateTask(id: string, patch: UpdateTaskPatch) {
  const { supabase } = await requireUser();

  const update: Record<string, unknown> = {};
  if (patch.title !== undefined) update.title = patch.title.trim();
  if (patch.description !== undefined) update.description = patch.description;
  if (patch.status !== undefined) update.status = patch.status;
  if (patch.priority !== undefined) update.priority = patch.priority;
  if (patch.due_date !== undefined) update.due_date = patch.due_date;
  if (patch.assignee_id !== undefined) update.assignee_id = patch.assignee_id;

  const { data, error } = await supabase
    .from("tasks")
    .update(update)
    .eq("id", id)
    .select("project_id")
    .maybeSingle();
  if (error) throw new Error(error.message);

  const projectId = (data as { project_id?: string } | null)?.project_id;
  if (projectId) revalidatePath(`/projects/${projectId}`);
  revalidatePath("/tasks");
}

/** Board drag-and-drop: change a task's status column. */
export async function setTaskStatus(id: string, status: TaskStatus) {
  await updateTask(id, { status });
}

/** Checkbox toggle: done ⇄ todo. */
export async function toggleTaskComplete(id: string, done: boolean) {
  await updateTask(id, { status: done ? "done" : "todo" });
}

export async function deleteTask(id: string) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .select("project_id")
    .maybeSingle();
  if (error) throw new Error(error.message);

  const projectId = (data as { project_id?: string } | null)?.project_id;
  if (projectId) revalidatePath(`/projects/${projectId}`);
  revalidatePath("/tasks");
}
