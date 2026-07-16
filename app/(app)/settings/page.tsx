import { getUserContext } from "@/lib/queries/context";
import { getTeamMembers } from "@/lib/queries/members";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { Avatar } from "@/components/ui/Avatar";
import { ROLE_LABELS } from "@/lib/design/tokens";

export const metadata = { title: "Settings" };

const CARD = "rounded-xl border border-hairline bg-surface-card p-6 shadow-sm";
const SECTION_TITLE = "text-base font-semibold text-ink";

export default async function SettingsPage() {
  const ctx = await getUserContext();
  if (!ctx) return null;

  const members = ctx.currentTeam ? await getTeamMembers(ctx.currentTeam.id) : [];

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold tracking-[-0.01em] text-ink">Settings</h1>

      <section className={CARD}>
        <h2 className={SECTION_TITLE}>Profile</h2>
        <p className="mb-5 mt-1 text-sm text-muted">Your personal details.</p>
        <SettingsForm initialName={ctx.user.name} email={ctx.user.email} />
      </section>

      <section className={CARD}>
        <h2 className={SECTION_TITLE}>Workspace</h2>
        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand text-sm font-bold text-white">
            {(ctx.currentTeam?.name ?? "W").charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-medium text-ink">{ctx.currentTeam?.name ?? "Workspace"}</p>
            <p className="text-xs text-muted">
              {members.length} {members.length === 1 ? "member" : "members"}
            </p>
          </div>
        </div>
      </section>

      <section className={CARD}>
        <h2 className={SECTION_TITLE}>Members</h2>
        <p className="mb-4 mt-1 text-sm text-muted">People in this workspace.</p>
        <ul className="divide-y divide-hairline">
          {members.map((m) => (
            <li key={m.user_id} className="flex items-center gap-3 py-3">
              <Avatar name={m.profile.full_name} src={m.profile.avatar_url} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {m.profile.full_name ?? "Member"}
                </p>
                <p className="truncate text-xs text-muted">{m.profile.email}</p>
              </div>
              <span className="rounded-full bg-surface-sunken px-2.5 py-0.5 text-xs font-medium text-body">
                {ROLE_LABELS[m.role]}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
