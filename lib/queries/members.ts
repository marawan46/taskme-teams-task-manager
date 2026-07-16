import { createClient } from "@/lib/supabase/server";
import type { MemberWithProfile, Profile, Role } from "@/lib/types";

export interface SimpleMember {
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

interface RawMemberRow {
  team_id: string;
  user_id: string;
  role: Role;
  created_at: string;
  profile: Profile | null;
}

export async function getTeamMembers(teamId: string): Promise<MemberWithProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select(
      "team_id, user_id, role, created_at, profile:profiles(id, email, full_name, avatar_url, created_at)",
    )
    .eq("team_id", teamId)
    .order("created_at", { ascending: true });
  if (error) throw error;

  return ((data ?? []) as unknown as RawMemberRow[])
    .filter((r): r is RawMemberRow & { profile: Profile } => r.profile != null)
    .map((r) => ({
      team_id: r.team_id,
      user_id: r.user_id,
      role: r.role,
      created_at: r.created_at,
      profile: r.profile,
    }));
}

/** Members shaped for an assignee picker. */
export async function getAssignableMembers(teamId: string): Promise<SimpleMember[]> {
  const members = await getTeamMembers(teamId);
  return members.map((m) => ({
    id: m.profile.id,
    name: m.profile.full_name,
    avatarUrl: m.profile.avatar_url,
  }));
}
