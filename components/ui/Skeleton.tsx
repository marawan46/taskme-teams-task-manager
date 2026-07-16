import { cn } from "@/lib/utils";

/** Loading placeholder block. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-surface-sunken", className)} />;
}
