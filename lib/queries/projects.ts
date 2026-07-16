import { createClient } from "@/lib/supabase/server";
import type { Project, ProjectWithStats } from "@/lib/types";

export async function getProject(projectId: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();
  if (error) throw error;
  return (data as Project) ?? null;
}

/** Projects in a team, each with total/done task counts for progress. */
export async function getProjectsWithStats(teamId: string): Promise<ProjectWithStats[]> {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("team_id", teamId)
    .order("created_at", { ascending: true });
  if (error) throw error;

  const list = (projects ?? []) as Project[];
  if (list.length === 0) return [];

  const { data: taskRows, error: taskErr } = await supabase
    .from("tasks")
    .select("project_id, status")
    .in(
      "project_id",
      list.map((p) => p.id),
    );
  if (taskErr) throw taskErr;

  const totals = new Map<string, { total: number; done: number }>();
  for (const row of (taskRows ?? []) as { project_id: string; status: string }[]) {
    const t = totals.get(row.project_id) ?? { total: 0, done: 0 };
    t.total += 1;
    if (row.status === "done") t.done += 1;
    totals.set(row.project_id, t);
  }

  return list.map((p) => ({
    ...p,
    task_count: totals.get(p.id)?.total ?? 0,
    done_count: totals.get(p.id)?.done ?? 0,
  }));
}
