import { cn } from "@/lib/utils";

function SkeletonRow({ isLast = false }: { isLast?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-6 py-4",
        !isLast && "border-b border-border"
      )}
    >
      <div className="size-4 rounded border border-muted animate-pulse" />
      <div className="h-4 grow rounded bg-muted animate-pulse" />
      <div className="flex items-center gap-6">
        <div className="h-3 w-10 rounded bg-muted animate-pulse" />
        <div className="size-2 rounded-full bg-muted animate-pulse" />
      </div>
    </div>
  );
}

export function PrivateTaskListSkeleton() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-36 rounded bg-muted animate-pulse" />
          <div className="h-5 w-6 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-3 w-12 rounded bg-muted animate-pulse" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow isLast />
      </div>
    </section>
  );
}
