import { getUserContext } from "@/lib/queries/context";
import { getMyTasks } from "@/lib/queries/tasks";
import { getAssignableMembers } from "@/lib/queries/members";
import { TaskListView } from "@/components/tasks/TaskListView";

export default async function MyTasksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const ctx = await getUserContext();
  if (!ctx) return null;

  const [tasks, members] = await Promise.all([
    getMyTasks(ctx.userId, q),
    ctx.currentTeam ? getAssignableMembers(ctx.currentTeam.id) : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-[-0.01em] text-ink">My Tasks</h1>
        <p className="text-sm text-muted">
          {q ? `Results for “${q}”` : "Tasks assigned to you across all projects."}
        </p>
      </div>
      <TaskListView
        tasks={tasks}
        members={members}
        emptyTitle={q ? "No matching tasks" : "You're all caught up"}
        emptyDescription={
          q ? "Try a different search term." : "Tasks assigned to you will show up here."
        }
      />
    </div>
  );
}
