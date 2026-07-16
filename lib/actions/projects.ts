"use server";

import { ApiResponse } from "@/types/index.types";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { z } from "zod";

const CreateProjectSchema = z.object({
     name: z
          .string()
          .min(1, "Project name is required")
          .max(255, "Project name must be 255 characters or less"),
     description: z
          .string()
          .max(1000, "Description must be 1000 characters or less")
          .optional()
          .nullable(),
});

const UpdateProjectSchema = z.object({
     id: z.uuid("Invalid project ID"),
     name: z
          .string()
          .min(1, "Project name is required")
          .max(255, "Project name must be 255 characters or less")
          .optional(),
     description: z
          .string()
          .max(1000, "Description must be 1000 characters or less")
          .optional()
          .nullable(),
});

const DeleteProjectSchema = z.object({
     id: z.uuid("Invalid project ID"),
});

export async function createProject(
     input: z.infer<typeof CreateProjectSchema>,
     supabaseClient: SupabaseClient,
): Promise<ApiResponse> {
     const validation = CreateProjectSchema.safeParse(input);

     if (!validation.success) {
          return {
               data: null,
               status: "error",
               error: {
                    code: 400,
                    message: validation.error.issues[0].message,
               },
          };
     }

     const { name, description } = validation.data;

     const supabase = supabaseClient;

     const {
          data: { user },
     } = await supabase.auth.getUser();

     if (!user) {
          return {
               data: null,
               status: "error",
               error: {
                    code: 401,
                    message: "Authentication required",
               },
          };
     }

     const { data, error } = await supabase
          .from("projects")
          .insert({
               name,
               description: description || null,
               created_by: user.id,
          }).select().single();
     if (error) {
          return {
               status: "error",
               data: null,
               error: {
                    code: 400,
                    message: error.message,
               },
          };
     }

     return {
          error: null,
          status: "success",
          data,
     };
}

export async function updateProject(
     input: z.infer<typeof UpdateProjectSchema>,
): Promise<ApiResponse> {
     const validation = UpdateProjectSchema.safeParse(input);

     if (!validation.success) {
          return {
               status: "error",
               data: null,
               error: {
                    code: 400,
                    message: validation.error.issues[0].message,
               },
          };
     }

     const { id, ...updateData } = validation.data;

     const cookieStore = await cookies();
     const supabase = createClient(cookieStore);

     const {
          data: { user },
     } = await supabase.auth.getUser();

     if (!user) {
          return {
               status: "error",
               data: null,
               error: {
                    code: 401,
                    message: "Authentication required",
               },
          };
     }

     const { data, error } = await supabase
          .from("projects")
          .update({
               ...(updateData.name !== undefined && { name: updateData.name }),
               ...(updateData.description !== undefined && {
                    description: updateData.description,
               }),
               updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();

     if (error) {
          return {
               data: null,
               status: "error",
               error: {
                    code: 400,
                    message: error.message,
               },
          };
     }

     return {
          error: null,
          status: "success",
          data,
     };
}

export async function deleteProject(
     input: z.infer<typeof DeleteProjectSchema>,
): Promise<ApiResponse> {
     const validation = DeleteProjectSchema.safeParse(input);

     if (!validation.success) {
          return {
               status: "error",
               data: null,
               error: {
                    code: 400,
                    message: validation.error.issues[0].message,
               },
          };
     }

     const { id } = validation.data;

     const cookieStore = await cookies();
     const supabase = createClient(cookieStore);

     const {
          data: { user },
     } = await supabase.auth.getUser();

     if (!user) {
          return {
               data: null,
               status: "error",
               error: {
                    code: 401,
                    message: "Authentication required",
               },
          };
     }

     const { error } = await supabase.from("projects").delete().eq("id", id);

     if (error) {
          return {
               data: null,
               status: "error",
               error: {
                    code: 400,
                    message: error.message,
               },
          };
     }

     return {
          status: "success",
          data: null,
          error: null,
     };
}
