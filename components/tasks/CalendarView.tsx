"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { PRIORITY_META } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import type { TaskWithRelations } from "@/lib/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ymd(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

interface CalendarViewProps {
  tasks: TaskWithRelations[];
  onTaskClick?: (task: TaskWithRelations) => void;
}

/** Month grid placing tasks on their due dates. */
export function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const startWeekday = new Date(cursor.y, cursor.m, 1).getDay();
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const todayKey = ymd(today.getFullYear(), today.getMonth(), today.getDate());

  const byDate = new Map<string, TaskWithRelations[]>();
  for (const t of tasks) {
    if (!t.due_date) continue;
    const key = t.due_date.slice(0, 10);
    const arr = byDate.get(key) ?? [];
    arr.push(t);
    byDate.set(key, arr);
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prev = () => setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }));
  const next = () => setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }));
  const goToday = () => setCursor({ y: today.getFullYear(), m: today.getMonth() });

  const navBtn =
    "flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-none";

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-[-0.01em] text-ink">
          {MONTHS[cursor.m]} {cursor.y}
        </h2>
        <div className="flex items-center gap-1">
          <button type="button" onClick={prev} aria-label="Previous month" className={navBtn}>
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goToday}
            className="rounded-md px-3 py-1.5 text-sm font-semibold text-body transition-colors hover:bg-surface-sunken hover:text-ink"
          >
            Today
          </button>
          <button type="button" onClick={next} aria-label="Next month" className={navBtn}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-hairline bg-canvas">
        <div className="grid grid-cols-7 border-b border-hairline bg-surface-soft">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted"
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            const key = d ? ymd(cursor.y, cursor.m, d) : `blank-${i}`;
            const items = d ? byDate.get(ymd(cursor.y, cursor.m, d)) ?? [] : [];
            const isToday = d != null && ymd(cursor.y, cursor.m, d) === todayKey;
            return (
              <div
                key={key}
                className={cn(
                  "min-h-[112px] border-b border-r border-hairline p-1.5",
                  (i + 1) % 7 === 0 && "border-r-0",
                  !d && "bg-surface-soft",
                )}
              >
                {d && (
                  <div className="mb-1 flex justify-end">
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                        isToday ? "bg-primary text-on-primary" : "text-muted",
                      )}
                    >
                      {d}
                    </span>
                  </div>
                )}
                <div className="space-y-1">
                  {items.slice(0, 3).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onTaskClick?.(t)}
                      className="flex w-full items-center gap-1 rounded px-1.5 py-1 text-left text-[11px] font-medium text-ink transition-colors hover:bg-surface-sunken focus-visible:outline-none"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: PRIORITY_META[t.priority].color }}
                      />
                      <span className="truncate">{t.title}</span>
                    </button>
                  ))}
                  {items.length > 3 && (
                    <p className="px-1.5 text-[10px] text-muted">+{items.length - 3} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
