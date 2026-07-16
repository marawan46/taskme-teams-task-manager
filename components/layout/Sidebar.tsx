"use client";

import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { SidebarItem } from "./SidebarItem";
import { Folder, Inbox, ListIcon, Settings } from "@/components/ui/icons";

export interface SidebarProject {
  id: string;
  name: string;
  color: string;
  key: string;
}

interface SidebarProps {
  projects: SidebarProject[];
  teamName: string;
  onNavigate?: () => void;
}

export function Sidebar({ projects, teamName, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-hairline bg-surface-soft">
      <div className="flex h-14 shrink-0 items-center border-b border-hairline px-4">
        <Logo href="/tasks" />
      </div>

      <div className="border-b border-hairline px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-brand text-xs font-bold text-white">
            {teamName.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{teamName}</p>
            <p className="text-[11px] text-muted">Workspace</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        <SidebarItem
          href="/tasks"
          label="My Tasks"
          icon={<ListIcon size={18} />}
          active={isActive("/tasks")}
          onClick={onNavigate}
        />
        <SidebarItem
          href="/inbox"
          label="Inbox"
          icon={<Inbox size={18} />}
          active={isActive("/inbox")}
          onClick={onNavigate}
        />
        <SidebarItem
          href="/projects"
          label="Projects"
          icon={<Folder size={18} />}
          active={pathname === "/projects"}
          onClick={onNavigate}
        />

        <div className="pt-5">
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Projects
          </p>
          {projects.length > 0 ? (
            projects.map((p) => (
              <SidebarItem
                key={p.id}
                href={`/projects/${p.id}`}
                label={p.name}
                colorDot={p.color}
                active={isActive(`/projects/${p.id}`)}
                onClick={onNavigate}
              />
            ))
          ) : (
            <p className="px-3 py-1 text-xs text-muted-soft">No projects yet</p>
          )}
        </div>
      </nav>

      <div className="shrink-0 border-t border-hairline p-3">
        <SidebarItem
          href="/settings"
          label="Settings"
          icon={<Settings size={18} />}
          active={isActive("/settings")}
          onClick={onNavigate}
        />
      </div>
    </aside>
  );
}
