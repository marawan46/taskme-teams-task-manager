import type { ProjectTaskRow } from "@/lib/data";
import { ProjectTaskItem } from "./ui/project-task-item";
import { ProjectTaskListSkeleton } from "./ui/project-task-list-skeleton";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

interface ProjectTaskListProps {
  tasks?: ProjectTaskRow[] | null;
}

export async function ProjectTaskList({ tasks }: ProjectTaskListProps) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  if (tasks == null) {
    return <ProjectTaskListSkeleton />;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-foreground font-heading">
          Project Tasks
        </h3>
        {tasks.length > 0 && (
          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            {tasks.length}
          </span>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No project tasks yet. Create a project and add tasks to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {tasks.map((task, i) => (
            <ProjectTaskItem
              key={task.id}
              title={task.title}
              projectName={task.projects?.name ?? "Untitled"}
              dueDate={task.due_date}
              assigneeName={task.profiles?.full_name ?? "Unassigned"}
              assigneeAvatar={task.profiles?.avatar_url ?? null}
              priority={task.priority}
              status={task.status}
              isLast={i === tasks.length - 1}
            />
          ))}
        </div>
      )}

      {tasks.length > 0 && (
        <div className="flex justify-center pt-2">
          <span className="cursor-pointer text-xs font-bold uppercase tracking-widest text-primary transition-opacity hover:opacity-80">
            View All Project Tasks
          </span>
        </div>
      )}
    </section>
  );
}
