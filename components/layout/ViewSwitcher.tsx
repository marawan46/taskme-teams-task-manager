"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Board, Calendar, ListIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export type BoardView = "board" | "list" | "calendar";

const VIEWS: { key: BoardView; label: string; Icon: typeof Board }[] = [
  { key: "board", label: "Board", Icon: Board },
  { key: "list", label: "List", Icon: ListIcon },
  { key: "calendar", label: "Calendar", Icon: Calendar },
];

/** Segmented List / Board / Calendar switcher driven by the `?view=` param. */
export function ViewSwitcher({ value }: { value: BoardView }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function select(view: BoardView) {
    const next = new URLSearchParams(params.toString());
    next.set("view", view);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-md bg-surface-sunken p-1">
      {VIEWS.map(({ key, label, Icon }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => select(key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors duration-[120ms] focus-visible:outline-none",
              active ? "bg-canvas text-ink shadow-xs" : "text-muted hover:text-ink",
            )}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
