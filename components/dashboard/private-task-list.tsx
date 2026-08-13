import Link from "next/link";
import { Lock } from "lucide-react";
import type { MyTask } from "@/types/index.types";
import { PrivateTaskItem } from "./ui/private-task-item";
import { PrivateTaskListSkeleton } from "./ui/private-task-list-skeleton";

interface PrivateTaskListProps {
  tasks?: MyTask[] | null;
}

export function PrivateTaskList({ tasks }: PrivateTaskListProps) {
  if (tasks == null) {
    return <PrivateTaskListSkeleton />;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-foreground font-heading">
            My Private Tasks
            <Lock className="size-4 text-muted-foreground" />
          </h3>
          {tasks.length > 0 && (
            <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
              {tasks.length}
            </span>
          )}
        </div>
        {tasks.length > 0 && (
          <Link
            href="/my-tasks"
            className="cursor-pointer text-xs font-semibold text-muted-foreground transition-colors hover:text-secondary-foreground"
          >
            View all
          </Link>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No private tasks yet. Create one to keep track of personal to-dos.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {tasks.map((task, i) => (
            <PrivateTaskItem
              key={task.id}
              title={task.name}
              dueDate={task.due_date}
              priority={task.priority}
              isLast={i === tasks.length - 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}
