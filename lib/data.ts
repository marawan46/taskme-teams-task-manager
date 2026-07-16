import { ApiResponse } from "@/types/index.types";
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
