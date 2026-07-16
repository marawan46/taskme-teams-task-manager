import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { ProjectWithStats } from "@/lib/types";

export function ProjectCard({ project }: { project: ProjectWithStats }) {
  const pct = project.task_count ? (project.done_count / project.task_count) * 100 : 0;
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-xl border border-hairline bg-surface-card p-5 shadow-sm transition-[transform,box-shadow] duration-[180ms] ease-standard hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ background: project.color }}
        >
          {project.key.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-ink">{project.name}</h3>
          <span className="font-mono text-[11px] text-muted-soft">{project.key}</span>
        </div>
      </div>
      {project.description && (
        <p className="mt-3 line-clamp-2 text-sm text-muted">{project.description}</p>
      )}
      <div className="mt-4">
        <ProgressBar value={pct} />
        <p className="mt-1.5 text-xs text-muted">
          {project.done_count}/{project.task_count} tasks done
        </p>
      </div>
    </Link>
  );
}
