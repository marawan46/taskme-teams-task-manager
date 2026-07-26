import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProjectCard } from "@/components/projects/project-card";
import { FolderOpen } from "lucide-react";
import { getProjects } from "@/lib/actions/projects";

export default async function ProjectsPage() {
  const response = await getProjects();

  const projects =
    response.status === "success" && Array.isArray(response.data)
      ? response.data
      : [];

  return (
    <div className="flex bg-primary-foreground min-h-screen flex-col p-8">
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <FolderOpen className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-foreground font-heading">
                Projects
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage and track your team projects
              </p>
            </div>
          </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
          <FolderOpen className="size-10 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            No projects yet. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <ProjectCard
              key={project.id}
              project={project}
              members={project.members}
              memberCount={project.memberCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
