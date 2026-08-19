import type { ProjectTaskRow } from "@/lib/data";
import type { MyTask } from "@/types/index.types";

export interface DashboardStats {
  doneToday: number;
  pending: number;
  underReview: number;
  expired: number;
  totalProjectTasks: number;
  completedProjectTasks: number;
  totalPrivateTasks: number;
  completedPrivateTasks: number;
}

function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate).getTime() < Date.now();
}

function isDoneToday(task: { updated_at: string | null; status: string }): boolean {
  if (task.status !== "DONE" || !task.updated_at) return false;
  const updated = new Date(task.updated_at);
  const now = new Date();
  return (
    updated.getFullYear() === now.getFullYear() &&
    updated.getMonth() === now.getMonth() &&
    updated.getDate() === now.getDate()
  );
}

export function computeDashboardStats(
  projectTasks: ProjectTaskRow[] | null,
  privateTasks: MyTask[] | null,
): DashboardStats {
  const pt = projectTasks ?? [];
  const mt = privateTasks ?? [];

  const doneToday = pt.filter(isDoneToday).length + mt.filter((t) => {
    if (!t.completed || !t.updated_at) return false;
    const updated = new Date(t.updated_at);
    const now = new Date();
    return (
      updated.getFullYear() === now.getFullYear() &&
      updated.getMonth() === now.getMonth() &&
      updated.getDate() === now.getDate()
    );
  }).length;

  const pending = pt.filter((t) => t.status === "TODO" || t.status === "IN_PROGRESS").length +
    mt.filter((t) => !t.completed).length;

  const underReview = pt.filter((t) => t.status === "UNDER_REVIEW").length;

  const expired = pt.filter((t) => isOverdue(t.due_date) && t.status !== "DONE").length +
    mt.filter((t) => !t.completed && isOverdue(t.due_date)).length;

  const completedProjectTasks = pt.filter((t) => t.status === "DONE").length;
  const completedPrivateTasks = mt.filter((t) => t.completed).length;

  return {
    doneToday,
    pending,
    underReview,
    expired,
    totalProjectTasks: pt.length,
    completedProjectTasks,
    totalPrivateTasks: mt.length,
    completedPrivateTasks,
  };
}
