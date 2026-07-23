import { cn } from "@/lib/utils";

function SkeletonRow({ isLast = false }: { isLast?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 p-4",
        !isLast && "border-b border-border"
      )}
    >
      <div className="min-w-0 grow space-y-2">
        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-3 w-16 rounded bg-muted animate-pulse" />
          <div className="h-3 w-20 rounded bg-muted animate-pulse" />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-muted animate-pulse" />
          <div className="h-3 w-12 rounded bg-muted animate-pulse" />
        </div>
        <div className="flex items-center gap-1">
          <div className="h-5 w-8 rounded bg-muted animate-pulse" />
          <div className="h-5 w-10 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function ProjectTaskListSkeleton() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-32 rounded bg-muted animate-pulse" />
        <div className="h-5 w-6 rounded bg-muted animate-pulse" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow isLast />
      </div>
    </section>
  );
}
