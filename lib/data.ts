import { ApiResponse, type Task } from "@/types/index.types";
import { SupabaseClient } from "@supabase/supabase-js";

export const fetchProjects = async (
     supabaseClient: SupabaseClient,
): Promise<ApiResponse> => {
     const supabase = supabaseClient;
     const {
          data: { user },
     } = await supabase.auth.getUser();
     const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("created_by", user?.id);
     if (error) {
          return {
               status: "error",
               error: {
                    code: 400,
                    message: "Something went wrong while fetching projects",
               },
               data: null,
          };
     }
     return {
          error: null,
          status: "success",
          data,
     };
};

export type ProjectTaskRow = Task & {
     projects: { name: string } | null;
     profiles: { full_name: string | null; avatar_url: string | null } | null;
};

export async function fetchProjectTasks(
     supabase: SupabaseClient,
): Promise<{ data: ProjectTaskRow[] | null; error: string | null }> {
     const isLoading = true;
     const { data, error } = await supabase
          .from("tasks")
          .select("*, projects(name), profiles:assigned_to(full_name, avatar_url)")
          .order("created_at", { ascending: false });

     if (error) {
          return { data: null, error: error.message };
     }

     return { data: data as ProjectTaskRow[], error: null };
}
