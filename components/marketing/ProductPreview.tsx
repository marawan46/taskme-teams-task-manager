import { PRIORITY_META } from "@/lib/design/tokens";
import type { Priority } from "@/lib/types";

interface PreviewCard {
  title: string;
  priority: Priority;
  tag?: string;
  done?: boolean;
}

const COLUMNS: { name: string; cards: PreviewCard[] }[] = [
  {
    name: "To Do",
    cards: [
      { title: "Design onboarding flow", priority: "high", tag: "Design" },
      { title: "Fix avatar upload bug", priority: "urgent", tag: "Bug" },
      { title: "Write API documentation", priority: "low", tag: "Docs" },
    ],
  },
  {
    name: "In Progress",
    cards: [
      { title: "Board drag & drop", priority: "medium", tag: "Feature" },
      { title: "Dark mode polish", priority: "medium", tag: "Design" },
    ],
  },
  {
    name: "Done",
    cards: [
      { title: "Set up authentication", priority: "high", done: true },
      { title: "Project scaffolding", priority: "medium", done: true },
    ],
  },
];

/** Decorative mock board that showcases the product's visual language. */
export function ProductPreview() {
  return (
    <div className="mx-auto mt-16 max-w-5xl px-6">
      <div className="overflow-hidden rounded-2xl border border-hairline bg-surface-card shadow-xl">
        <div className="flex items-center gap-1.5 border-b border-hairline bg-surface-soft px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-surface-strong" />
          <span className="h-3 w-3 rounded-full bg-surface-strong" />
          <span className="h-3 w-3 rounded-full bg-surface-strong" />
          <div className="ml-3 h-6 w-full max-w-xs rounded-md bg-surface-sunken" />
        </div>
        <div className="flex gap-4 overflow-hidden bg-surface-soft p-5">
          {COLUMNS.map((col) => (
            <div key={col.name} className="w-56 shrink-0 rounded-xl bg-surface-sunken p-3">
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {col.name}
                </span>
                <span className="rounded-full bg-canvas px-1.5 py-0.5 text-[10px] font-medium text-muted">
                  {col.cards.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {col.cards.map((c) => (
                  <div
                    key={c.title}
                    className="rounded-lg border border-hairline bg-canvas p-3 shadow-sm"
                    style={{ borderLeft: `3px solid ${PRIORITY_META[c.priority].color}` }}
                  >
                    <p
                      className={`text-[13px] font-medium ${c.done ? "text-muted line-through" : "text-ink"}`}
                    >
                      {c.title}
                    </p>
                    {c.tag && (
                      <span className="mt-2 inline-block rounded-full bg-surface-sunken px-2 py-0.5 text-[10px] font-medium text-body">
                        {c.tag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
