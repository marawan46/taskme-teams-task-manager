import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserPermissions(
     supabase: SupabaseClient,
     projectId: string,
): Promise<string[]> {
     const {
          data: { user },
     } = await supabase.auth.getUser();

     if (!user) return [];

     // Check project membership & role
    //  const { data: memberData, error: memberError } = await supabase
    //       .from("project_members")
    //       .select("role")
    //       .eq("project_id", projectId)
    //       .eq("user_id", user.id)
    //       .single();

    //  if (memberError || !memberData) {
    //       // Check if user created the project
    //       const { data: projectData } = await supabase
    //            .from("projects")
    //            .select("created_by")
    //            .eq("id", projectId)
    //            .single();

    //       if (projectData?.created_by === user.id) {
    //            // Owner has all permissions
    //            return [
    //                 "update:project",
    //                 "delete:project",
    //                 "invite:members",
    //                 "remove:members",
    //                 "read:milestones",
    //                 "add:milestones",
    //                 "update:milestones",
    //                 "delete:milestones",
    //                 "read:tasks",
    //                 "add:tasks",
    //                 "update:tasks",
    //                 "delete:tasks",
    //                 "approve:tasks",
    //            ];
    //       }

    //       return [];
    //  }

    //  if (memberData.role === "OWNER") {
    //       return [
    //            "update:project",
    //            "delete:project",
    //            "invite:members",
    //            "remove:members",
    //            "read:milestones",
    //            "add:milestones",
    //            "update:milestones",
    //            "delete:milestones",
    //            "read:tasks",
    //            "add:tasks",
    //            "update:tasks",
    //            "delete:tasks",
    //            "approve:tasks",
    //       ];
    //  }

     // Fetch explicit permissions for non-owner members
     const { data: permData, error: permError } = await supabase
          .from("project_member_permissions")
          .select("permission")
          .eq("project_id", projectId)
          .eq("user_id", user.id);

     if (permError || !permData) {
          return [];
     }
     console.log("Permissions fetched:", permData.map((p) => p.permission));
     return permData.map((p) => p.permission);
}
