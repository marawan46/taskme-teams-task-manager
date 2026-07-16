"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownSeparator } from "@/components/ui/Dropdown";
import { LogOut, Settings } from "@/components/ui/icons";
import { signOut } from "@/lib/actions/auth";

export interface SessionUser {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
}

const itemClass =
  "flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left text-sm transition-colors focus-visible:outline-none";

export function UserMenu({ user }: { user: SessionUser }) {
  return (
    <Dropdown
      align="end"
      trigger={
        <button
          type="button"
          aria-label="Account menu"
          className="rounded-full focus-visible:outline-none"
        >
          <Avatar name={user.name} src={user.avatarUrl} size="sm" />
        </button>
      }
    >
      <div className="px-2.5 py-2">
        <p className="truncate text-sm font-medium text-ink">{user.name ?? "You"}</p>
        {user.email && <p className="truncate text-xs text-muted">{user.email}</p>}
      </div>
      <DropdownSeparator />
      <Link href="/settings" className={`${itemClass} text-body hover:bg-surface-sunken hover:text-ink`}>
        <Settings size={16} />
        Settings
      </Link>
      <DropdownSeparator />
      <form action={signOut}>
        <button type="submit" className={`${itemClass} text-error hover:bg-error-soft`}>
          <LogOut size={16} />
          Sign out
        </button>
      </form>
    </Dropdown>
  );
}
