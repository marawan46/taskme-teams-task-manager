import { createClient } from "@/lib/supabase/server";
import type { Label, Profile, Project, Task, TaskWithRelations } from "@/lib/types";

const TASK_SELECT = `
  id, project_id, seq, title, description, status, priority, due_date,
  assignee_id, created_by, position, created_at, updated_at,
  project:projects!inner(id, name, key, color),
  assignee:profiles(id, email, full_name, avatar_url, created_at),
  task_labels(label:labels(id, team_id, name, color))
`;

interface RawTaskRow extends Task {
  project: Pick<Project, "id" | "name" | "key" | "color">;
  assignee: Profile | null;
  task_labels: { label: Label | null }[] | null;
}

function mapTask(row: RawTaskRow): TaskWithRelations {
  const { task_labels, project, assignee, ...rest } = row;
  return {
    ...rest,
    project,
    assignee: assignee ?? null,
    labels: (task_labels ?? [])
      .map((tl) => tl.label)
      .filter((l): l is Label => l != null),
  };
}

/** All tasks in a project, ordered for the board. */
export async function getProjectTasks(projectId: string): Promise<TaskWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select(TASK_SELECT)
    .eq("project_id", projectId)
    .order("position", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as unknown as RawTaskRow[]).map(mapTask);
}

/** Tasks assigned to a user, optionally filtered by a title search. */
export async function getMyTasks(
  userId: string,
  search?: string,
): Promise<TaskWithRelations[]> {
  const supabase = await createClient();
  let query = supabase.from("tasks").select(TASK_SELECT).eq("assignee_id", userId);
  if (search) query = query.ilike("title", `%${search}%`);
  const { data, error } = await query.order("due_date", {
    ascending: true,
    nullsFirst: false,
  });
  if (error) throw error;
  return ((data ?? []) as unknown as RawTaskRow[]).map(mapTask);
}

export async function getTaskById(id: string): Promise<TaskWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select(TASK_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapTask(data as unknown as RawTaskRow) : null;
}
