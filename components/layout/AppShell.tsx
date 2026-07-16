"use client";

import { useState, type ReactNode } from "react";
import { Sidebar, type SidebarProject } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { SessionUser } from "./UserMenu";

interface AppShellProps {
  user: SessionUser;
  projects: SidebarProject[];
  teamName: string;
  children: ReactNode;
}

/** App chrome: fixed sidebar on desktop, slide-over drawer on mobile. */
export function AppShell({ user, projects, teamName, children }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas">
      <div className="hidden md:block">
        <Sidebar projects={projects} teamName={teamName} />
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-[var(--modal-overlay)] animate-fade-in"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full animate-scale-in">
            <Sidebar
              projects={projects}
              teamName={teamName}
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar user={user} onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
