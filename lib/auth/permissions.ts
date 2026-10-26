import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserPermissions(
     supabase: SupabaseClient,
     projectId: string,
): Promise<string[]> {
     const {
          data: { user },
     } = await supabase.auth.getUser();

     if (!user) return [];

     // Check if user is OWNER (matches SQL has_permission coalesce(get_project_role = 'OWNER', false))
     const { data: memberData } = await supabase
          .from("project_members")
          .select("role")
          .eq("project_id", projectId)
          .eq("user_id", user.id)
          .maybeSingle();

     if (memberData?.role === "OWNER") {
          return [
               "update:project",
               "delete:project",
               "invite:members",
               "remove:members",
               "update:members",
               "read:milestones",
               "add:milestones",
               "update:milestones",
               "delete:milestones",
               "read:tasks",
               "add:tasks",
               "update:tasks",
               "delete:tasks",
               "approve:tasks",
          ];
     }

     // Fetch explicit permissions for non-owner members
     const { data: permData, error: permError } = await supabase
          .from("project_member_permissions")
          .select("permission")
          .eq("project_id", projectId)
          .eq("user_id", user.id);

     if (permError || !permData) {
          return [];
     }
     return permData.map((p) => p.permission);
}
