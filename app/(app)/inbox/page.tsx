import { getUserContext } from "@/lib/queries/context";
import { getMyTasks } from "@/lib/queries/tasks";
import { getAssignableMembers } from "@/lib/queries/members";
import { TaskListView } from "@/components/tasks/TaskListView";

export const metadata = { title: "Inbox" };

export default async function InboxPage() {
  const ctx = await getUserContext();
  if (!ctx) return null;

  const [assigned, members] = await Promise.all([
    getMyTasks(ctx.userId),
    ctx.currentTeam ? getAssignableMembers(ctx.currentTeam.id) : Promise.resolve([]),
  ]);
  const open = assigned.filter((t) => t.status !== "done");

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-[-0.01em] text-ink">Inbox</h1>
        <p className="text-sm text-muted">Your open assigned tasks, soonest first.</p>
      </div>
      <TaskListView
        tasks={open}
        members={members}
        emptyTitle="Inbox zero 🎉"
        emptyDescription="You have no open tasks assigned to you."
      />
    </div>
  );
}
