import { notFound } from "next/navigation";
import { getProject } from "@/lib/queries/projects";
import { getProjectTasks } from "@/lib/queries/tasks";
import { getAssignableMembers } from "@/lib/queries/members";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProjectView } from "@/components/tasks/ProjectView";
import type { BoardView } from "@/components/layout/ViewSwitcher";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const { projectId } = await params;
  const { view: viewParam } = await searchParams;

  const project = await getProject(projectId);
  if (!project) notFound();

  const [tasks, members] = await Promise.all([
    getProjectTasks(projectId),
    getAssignableMembers(project.team_id),
  ]);

  const view: BoardView =
    viewParam === "list" || viewParam === "calendar" ? viewParam : "board";
  const done = tasks.filter((t) => t.status === "done").length;
  const pct = tasks.length ? (done / tasks.length) * 100 : 0;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-hairline bg-canvas px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ background: project.color }}
          />
          <h1 className="text-xl font-bold tracking-[-0.01em] text-ink">{project.name}</h1>
          <span className="font-mono text-xs text-muted-soft">{project.key}</span>
        </div>
        {project.description && (
          <p className="mt-1 max-w-2xl text-sm text-muted">{project.description}</p>
        )}
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar value={pct} className="max-w-xs" />
          <span className="shrink-0 text-xs text-muted">
            {done}/{tasks.length} done
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <ProjectView
          projectId={projectId}
          tasks={tasks}
          members={members}
          view={view}
        />
      </div>
    </div>
  );
}
