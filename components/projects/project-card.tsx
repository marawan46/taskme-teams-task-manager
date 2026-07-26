import Link from "next/link";
import { Calendar, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/index.types";

interface ProjectCardMembers {
  full_name: string | null;
  avatar_url: string | null;
}

interface ProjectCardProps {
  project: Project;
  members?: ProjectCardMembers[];
  memberCount?: number;
}

function formatDate(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ProjectCard({
  project,
  members = [],
  memberCount = 0,
}: ProjectCardProps) {
  const displayMembers = members.slice(0, 3);
  const overflowCount = Math.max(0, memberCount - 3);

  return (
    <Link
      href={`/projects/${project.id}`}
      className={cn(
        "group block rounded-xl border border-border bg-card p-6",
        "transition-all hover:shadow-md hover:border-primary/20"
      )}
    >
      <div className="mb-3">
        <h3 className="text-lg font-bold text-foreground font-heading truncate group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        {project.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatDate(project.created_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </span>
        </div>

        {memberCount > 0 && (
          <div className="flex -space-x-2">
            {displayMembers.map((m, i) => (
              <Avatar key={i} size="sm">
                <AvatarImage src={m.avatar_url ?? undefined} alt={m.full_name ?? ""} />
                <AvatarFallback>{getInitials(m.full_name)}</AvatarFallback>
              </Avatar>
            ))}
            {overflowCount > 0 && (
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground ring-2 ring-card">
                +{overflowCount}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
