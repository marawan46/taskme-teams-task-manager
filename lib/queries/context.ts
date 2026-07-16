import { createClient } from "@/lib/supabase/server";
import type { Profile, Team } from "@/lib/types";
import type { SessionUser } from "@/components/layout/UserMenu";
import type { SidebarProject } from "@/components/layout/Sidebar";

export interface UserContext {
  userId: string;
  user: SessionUser;
  teams: Team[];
  currentTeam: Team | null;
  projects: SidebarProject[];
}

/**
 * Everything the app shell needs about the signed-in user: identity, teams,
 * the current (personal) workspace, and its projects. Returns null when signed
 * out so the layout can redirect.
 */
export async function getUserContext(): Promise<UserContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  const profile = profileData as Profile | null;

  const { data: memberships } = await supabase
    .from("team_members")
    .select("team:teams(*)")
    .eq("user_id", user.id);
  const teams = ((memberships ?? []) as unknown as { team: Team | null }[])
    .map((m) => m.team)
    .filter((t): t is Team => t != null);
  const currentTeam = teams.find((t) => t.is_personal) ?? teams[0] ?? null;

  let projects: SidebarProject[] = [];
  if (currentTeam) {
    const { data: projRows } = await supabase
      .from("projects")
      .select("id, name, color, key")
      .eq("team_id", currentTeam.id)
      .order("created_at", { ascending: true });
    projects = (projRows ?? []) as SidebarProject[];
  }

  const user_meta = user.user_metadata ?? {};
  const sessionUser: SessionUser = {
    name: profile?.full_name ?? (user_meta.full_name as string) ?? null,
    email: profile?.email ?? user.email ?? null,
    avatarUrl: profile?.avatar_url ?? (user_meta.avatar_url as string) ?? null,
  };

  return { userId: user.id, user: sessionUser, teams, currentTeam, projects };
}
