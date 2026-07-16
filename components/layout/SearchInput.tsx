"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "@/components/ui/icons";

/** Top-bar search — submits to /tasks?q= for a filtered task view. */
export function SearchInput({ placeholder = "Search tasks…" }: { placeholder?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = q.trim();
        router.push(trimmed ? `/tasks?q=${encodeURIComponent(trimmed)}` : "/tasks");
      }}
      className="relative w-full max-w-md"
      role="search"
    >
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-md border border-transparent bg-surface-sunken pl-9 pr-3 text-sm text-ink placeholder:text-muted-soft transition-colors duration-[120ms] focus-visible:border-hairline-strong focus-visible:bg-canvas focus-visible:outline-none"
      />
    </form>
  );
}
