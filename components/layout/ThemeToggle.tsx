"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** Toggle light/dark by flipping `.dark` on <html> and persisting the choice. */
export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("taskme-theme", next ? "dark" : "light");
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors " +
          "hover:bg-surface-sunken hover:text-ink focus-visible:outline-none",
        className,
      )}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
