"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
}

/** Menu surface that scales in and closes on outside-click / Escape. */
export function Dropdown({ trigger, children, align = "end", className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex">
      <span onClick={() => setOpen((o) => !o)} className="inline-flex">
        {trigger}
      </span>
      {open && (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute top-full z-50 mt-2 min-w-[200px] origin-top rounded-lg border border-hairline " +
              "bg-canvas p-1.5 shadow-lg animate-scale-in",
            align === "end" ? "right-0" : "left-0",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  onSelect?: () => void;
  icon?: ReactNode;
  destructive?: boolean;
  className?: string;
}

export function DropdownItem({
  children,
  onSelect,
  icon,
  destructive,
  className,
}: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left text-sm transition-colors " +
          "focus-visible:outline-none",
        destructive
          ? "text-error hover:bg-error-soft"
          : "text-body hover:bg-surface-sunken hover:text-ink",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-hairline" />;
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
      {children}
    </div>
  );
}
