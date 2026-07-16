import { getUserContext } from "@/lib/queries/context";
import { getProjectsWithStats } from "@/lib/queries/projects";
import { ProjectsView } from "@/components/tasks/ProjectsView";
import { EmptyState } from "@/components/ui/EmptyState";
import { Folder } from "@/components/ui/icons";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const ctx = await getUserContext();
  if (!ctx) return null;

  if (!ctx.currentTeam) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <EmptyState
          icon={<Folder size={22} />}
          title="No workspace found"
          description="Something went wrong loading your workspace."
        />
      </div>
    );
  }

  const projects = await getProjectsWithStats(ctx.currentTeam.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <ProjectsView projects={projects} teamId={ctx.currentTeam.id} />
    </div>
  );
}
