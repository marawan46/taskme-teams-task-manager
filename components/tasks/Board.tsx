"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { STATUS_META, STATUS_ORDER } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import type { TaskStatus, TaskWithRelations } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import type { MoveTaskFn, ToggleTaskFn } from "./types";

interface BoardProps {
  tasks: TaskWithRelations[];
  onMove?: MoveTaskFn;
  onToggleComplete?: ToggleTaskFn;
  onCardClick?: (task: TaskWithRelations) => void;
}

/** Kanban board — columns per status, HTML5 drag-and-drop to change status. */
export function Board({ tasks, onMove, onToggleComplete, onCardClick }: BoardProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<TaskStatus | null>(null);

  const byStatus = STATUS_ORDER.reduce<Record<TaskStatus, TaskWithRelations[]>>(
    (acc, s) => {
      acc[s] = [];
      return acc;
    },
    {} as Record<TaskStatus, TaskWithRelations[]>,
  );
  for (const t of tasks) byStatus[t.status]?.push(t);

  function handleDrop(status: TaskStatus) {
    if (dragId) {
      const task = tasks.find((t) => t.id === dragId);
      if (task && task.status !== status) onMove?.(dragId, status);
    }
    setDragId(null);
    setOverCol(null);
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto p-4 sm:p-6">
      {STATUS_ORDER.map((status) => {
        const meta = STATUS_META[status];
        const items = byStatus[status];
        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setOverCol(status);
            }}
            onDragLeave={() => setOverCol((c) => (c === status ? null : c))}
            onDrop={() => handleDrop(status)}
            className={cn(
              "flex max-h-full w-[300px] shrink-0 flex-col rounded-xl bg-surface-sunken p-3 transition-shadow",
              overCol === status && "ring-2 ring-primary/50",
            )}
          >
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className="h-2 w-2 rounded-full" style={{ background: meta.dot }} />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                {meta.label}
              </span>
              <Badge>{items.length}</Badge>
            </div>

            <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto pr-0.5">
              {items.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", t.id);
                    e.dataTransfer.effectAllowed = "move";
                    setDragId(t.id);
                  }}
                  onToggleComplete={onToggleComplete}
                  onClick={() => onCardClick?.(t)}
                />
              ))}
              {items.length === 0 && (
                <div className="rounded-lg border border-dashed border-hairline-strong py-8 text-center text-xs text-muted-soft">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
