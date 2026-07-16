/**
 * Domain <-> design metadata.
 *
 * These constants pair task enums (status, priority, role) with the labels and
 * token-driven classes used to render them, so every surface stays consistent.
 * Color values reference the CSS custom properties defined in app/globals.css.
 */

import type { Priority, Role, TaskStatus } from "@/lib/types";

export interface StatusMeta {
  value: TaskStatus;
  label: string;
  /** Dot/accent color (hex or css var). */
  dot: string;
  /** Tailwind classes for a soft status badge. */
  badge: string;
}

export const STATUS_ORDER: TaskStatus[] = [
  "backlog",
  "todo",
  "in_progress",
  "in_review",
  "done",
];

export const STATUS_META: Record<TaskStatus, StatusMeta> = {
  backlog: {
    value: "backlog",
    label: "Backlog",
    dot: "var(--muted-soft)",
    badge: "bg-surface-sunken text-muted",
  },
  todo: {
    value: "todo",
    label: "To Do",
    dot: "var(--muted)",
    badge: "bg-surface-sunken text-body",
  },
  in_progress: {
    value: "in_progress",
    label: "In Progress",
    dot: "var(--info)",
    badge: "bg-info-soft text-info",
  },
  in_review: {
    value: "in_review",
    label: "In Review",
    dot: "var(--warning)",
    badge: "bg-warning-soft text-warning",
  },
  done: {
    value: "done",
    label: "Done",
    dot: "var(--success)",
    badge: "bg-success-soft text-success",
  },
};

export interface PriorityMeta {
  value: Priority;
  label: string;
  /** Color from the priority ramp. */
  color: string;
  /** Border-color utility for the task-card leading edge. */
  border: string;
  rank: number;
}

export const PRIORITY_ORDER: Priority[] = ["urgent", "high", "medium", "low"];

export const PRIORITY_META: Record<Priority, PriorityMeta> = {
  urgent: {
    value: "urgent",
    label: "Urgent",
    color: "var(--priority-urgent)",
    border: "border-l-priority-urgent",
    rank: 0,
  },
  high: {
    value: "high",
    label: "High",
    color: "var(--priority-high)",
    border: "border-l-priority-high",
    rank: 1,
  },
  medium: {
    value: "medium",
    label: "Medium",
    color: "var(--priority-medium)",
    border: "border-l-priority-medium",
    rank: 2,
  },
  low: {
    value: "low",
    label: "Low",
    color: "var(--priority-low)",
    border: "border-l-priority-low",
    rank: 3,
  },
};

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

/** Palette offered when creating projects / labels. */
export const PROJECT_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
] as const;
