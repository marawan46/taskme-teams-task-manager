"use client";

import type { DragEvent } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { AvatarGroup } from "@/components/ui/Avatar";
import { LabelChip } from "@/components/ui/LabelChip";
import { Clock } from "@/components/ui/icons";
import { PRIORITY_META } from "@/lib/design/tokens";
import { cn, dueUrgency, formatDueDate, formatTaskId } from "@/lib/utils";
import type { TaskWithRelations } from "@/lib/types";
import type { ToggleTaskFn } from "./types";

interface TaskCardProps {
  task: TaskWithRelations;
  onClick?: () => void;
  onToggleComplete?: ToggleTaskFn;
  draggable?: boolean;
  onDragStart?: (e: DragEvent) => void;
}

const DUE_COLOR = {
  overdue: "text-error",
  soon: "text-warning",
  normal: "text-muted",
  none: "text-muted",
} as const;

export function TaskCard({
  task,
  onClick,
  onToggleComplete,
  draggable,
  onDragStart,
}: TaskCardProps) {
  const done = task.status === "done";
  const urgency = dueUrgency(task.due_date, done);

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      className="group cursor-pointer rounded-lg border border-hairline bg-surface-card p-3.5 shadow-sm transition-[transform,box-shadow,border-color] duration-[180ms] ease-standard hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-lg"
      style={{ borderLeftWidth: 3, borderLeftColor: PRIORITY_META[task.priority].color }}
    >
      <div className="flex items-start gap-2.5">
        <span className="pt-0.5" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={done}
            onCheckedChange={(c) => onToggleComplete?.(task.id, c)}
            aria-label="Toggle complete"
          />
        </span>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm font-semibold leading-snug",
              done ? "text-muted line-through" : "text-ink",
            )}
          >
            {task.title}
          </p>

          {task.labels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {task.labels.map((l) => (
                <LabelChip key={l.id} name={l.name} color={l.color} />
              ))}
            </div>
          )}

          <div className="mt-2.5 flex items-center gap-3">
            <span className="font-mono text-[11px] text-muted-soft">
              {formatTaskId(task.project.key, task.seq)}
            </span>
            {task.due_date && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] font-medium",
                  DUE_COLOR[urgency],
                )}
              >
                <Clock size={12} />
                {formatDueDate(task.due_date)}
              </span>
            )}
            {task.assignee && (
              <span className="ml-auto">
                <AvatarGroup
                  users={[
                    {
                      id: task.assignee.id,
                      name: task.assignee.full_name,
                      src: task.assignee.avatar_url,
                    },
                  ]}
                  size="xs"
                />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
