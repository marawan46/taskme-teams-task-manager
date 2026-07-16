"use client";

import { FilterChip } from "@/components/ui/FilterChip";
import { PRIORITY_META, PRIORITY_ORDER } from "@/lib/design/tokens";
import type { Priority } from "@/lib/types";

export interface TaskFilters {
  priorities: Priority[];
  hideDone: boolean;
}

export const EMPTY_FILTERS: TaskFilters = { priorities: [], hideDone: false };

/** Apply a TaskFilters set to a list. */
export function applyFilters<T extends { priority: Priority; status: string }>(
  tasks: T[],
  filters: TaskFilters,
): T[] {
  return tasks.filter((t) => {
    if (filters.hideDone && t.status === "done") return false;
    if (filters.priorities.length > 0 && !filters.priorities.includes(t.priority))
      return false;
    return true;
  });
}

interface FilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const togglePriority = (p: Priority) => {
    const has = filters.priorities.includes(p);
    onChange({
      ...filters,
      priorities: has
        ? filters.priorities.filter((x) => x !== p)
        : [...filters.priorities, p],
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRIORITY_ORDER.map((p) => (
        <FilterChip
          key={p}
          active={filters.priorities.includes(p)}
          onClick={() => togglePriority(p)}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: PRIORITY_META[p].color }}
          />
          {PRIORITY_META[p].label}
        </FilterChip>
      ))}
      <FilterChip
        active={filters.hideDone}
        onClick={() => onChange({ ...filters, hideDone: !filters.hideDone })}
      >
        Hide done
      </FilterChip>
    </div>
  );
}
