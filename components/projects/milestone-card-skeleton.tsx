import { Skeleton } from "@/components/ui/skeleton";

export function MilestoneCardSkeleton() {
  return (
    <div className="bg-card p-6 rounded-xl border-l-4 border-l-muted">
      <div className="flex items-start gap-6">
        <Skeleton className="mt-1 size-10 rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-4 pt-1">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
