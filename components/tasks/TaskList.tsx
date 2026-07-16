"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Checkbox } from "@/components/ui/Checkbox";
import { LabelChip } from "@/components/ui/LabelChip";
import { PriorityFlag } from "@/components/ui/PriorityFlag";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn, formatDueDate, formatTaskId } from "@/lib/utils";
import type { TaskWithRelations } from "@/lib/types";
import type { ToggleTaskFn } from "./types";

interface TaskListProps {
  tasks: TaskWithRelations[];
  onToggleComplete?: ToggleTaskFn;
  onRowClick?: (task: TaskWithRelations) => void;
}

/** Dense list view — one row per task, full content width. */
export function TaskList({ tasks, onToggleComplete, onRowClick }: TaskListProps) {
  return (
    <div className="divide-y divide-hairline overflow-hidden rounded-xl border border-hairline bg-canvas">
      {tasks.map((t) => {
        const done = t.status === "done";
        return (
          <div
            key={t.id}
            onClick={() => onRowClick?.(t)}
            className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-soft"
          >
            <span onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={done}
                onCheckedChange={(c) => onToggleComplete?.(t.id, c)}
                aria-label="Toggle complete"
              />
            </span>
            <span className="w-16 shrink-0 font-mono text-[11px] text-muted-soft">
              {formatTaskId(t.project.key, t.seq)}
            </span>
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-sm font-medium",
                done ? "text-muted line-through" : "text-ink",
              )}
            >
              {t.title}
            </span>
            <div className="hidden items-center gap-1.5 md:flex">
              {t.labels.slice(0, 2).map((l) => (
                <LabelChip key={l.id} name={l.name} color={l.color} />
              ))}
            </div>
            <PriorityFlag priority={t.priority} showLabel={false} />
            {t.due_date && (
              <span className="hidden w-20 shrink-0 text-right font-mono text-[11px] text-muted sm:block">
                {formatDueDate(t.due_date)}
              </span>
            )}
            <span className="hidden lg:inline-flex">
              <StatusBadge status={t.status} withDot={false} />
            </span>
            <span className="w-7 shrink-0">
              {t.assignee && (
                <Avatar
                  name={t.assignee.full_name}
                  src={t.assignee.avatar_url}
                  size="xs"
                />
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
