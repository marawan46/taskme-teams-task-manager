import { redirect } from "next/navigation";
import { getUserContext } from "@/lib/queries/context";
import { AppShell } from "@/components/layout/AppShell";
import { ToastProvider } from "@/components/ui/Toast";

/** Auth-guarded app shell. Unauthenticated users are sent to /login. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getUserContext();
  if (!ctx) redirect("/login");

  return (
    <ToastProvider>
      <AppShell
        user={ctx.user}
        projects={ctx.projects}
        teamName={ctx.currentTeam?.name ?? "Workspace"}
      >
        {children}
      </AppShell>
    </ToastProvider>
  );
}
