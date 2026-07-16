"use client";

import Link from "next/link";
import { Bell, Menu } from "@/components/ui/icons";
import { SearchInput } from "./SearchInput";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu, type SessionUser } from "./UserMenu";

interface TopBarProps {
  user: SessionUser;
  onMenuClick: () => void;
}

export function TopBar({ user, onMenuClick }: TopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-hairline bg-canvas px-3 sm:px-4">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-none md:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="flex flex-1 justify-center px-2">
        <SearchInput />
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <ThemeToggle />
        <Link
          href="/inbox"
          aria-label="Inbox"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-none"
        >
          <Bell size={18} />
        </Link>
        <div className="ml-1">
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
