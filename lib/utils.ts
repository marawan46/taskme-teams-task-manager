/**
 * Small, dependency-free helpers shared across the app.
 */

type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

/** Join conditional class names (clsx-style, no external dependency). */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string" || typeof input === "number") {
      out.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) out.push(inner);
    } else if (typeof input === "object") {
      for (const key in input) {
        if (input[key]) out.push(key);
      }
    }
  }
  return out.join(" ");
}

/** Render a task's human ID, e.g. ("TSK", 142) -> "TSK-142". */
export function formatTaskId(projectKey: string, seq: number): string {
  return `${projectKey}-${seq}`;
}

/** Initials for an avatar fallback, e.g. "Ada Lovelace" -> "AL". */
export function initials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const DAY_MS = 86_400_000;

/** Start-of-day difference in whole days (target - today). */
function dayDelta(date: Date): number {
  const today = new Date();
  const a = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const b = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((a - b) / DAY_MS);
}

/** Compact due-date label: "Today", "Tomorrow", "Mar 4", "Mar 4, 2027". */
export function formatDueDate(input: string | Date | null | undefined): string {
  if (!input) return "";
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "";
  const delta = dayDelta(date);
  if (delta === 0) return "Today";
  if (delta === 1) return "Tomorrow";
  if (delta === -1) return "Yesterday";
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

export type DueUrgency = "overdue" | "soon" | "normal" | "none";

/** Classify a due date so cards can tint it (error / warning / muted). */
export function dueUrgency(
  input: string | Date | null | undefined,
  done = false,
): DueUrgency {
  if (!input || done) return "none";
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "none";
  const delta = dayDelta(date);
  if (delta < 0) return "overdue";
  if (delta <= 2) return "soon";
  return "normal";
}

/** URL-safe slug from an arbitrary string. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
