"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ApiResponse } from "@/types/index.types";

const UpdateProfileSchema = z.object({
     full_name: z
          .string()
          .trim()
          .min(1, "Full name is required")
          .max(100, "Full name must be 100 characters or less"),
     avatar_url: z
          .string()
          .trim()
          .max(1000, "Avatar URL must be 1000 characters or less")
          .optional()
          .nullable(),
});

const UpdatePasswordSchema = z.object({
     password: z
          .string()
          .min(6, "Password must be at least 6 characters")
          .max(100, "Password must be 100 characters or less"),
});

export async function updateProfile(
     input: z.infer<typeof UpdateProfileSchema>,
): Promise<ApiResponse> {
     const validation = UpdateProfileSchema.safeParse(input);

     if (!validation.success) {
          return {
               status: "error",
               data: null,
               error: {
                    code: 400,
                    message: validation.error.issues[0]?.message ?? "Invalid input",
               },
          };
     }

     const { full_name, avatar_url } = validation.data;
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

     // 1. Update public.profiles table (RLS enforces auth.uid() = id)
     const { data, error } = await supabase
          .from("profiles")
          .update({
               full_name,
               avatar_url: avatar_url || null,
          })
          .eq("id", user.id)
          .select()
          .single();

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

     // 2. Also keep auth.users metadata in sync
     await supabase.auth.updateUser({
          data: {
               full_name,
               avatar_url: avatar_url || null,
          },
     });

     revalidatePath("/profile");
     revalidatePath("/", "layout");

     return {
          status: "success",
          data,
          error: null,
     };
}

export async function updatePassword(
     input: z.infer<typeof UpdatePasswordSchema>,
): Promise<ApiResponse> {
     const validation = UpdatePasswordSchema.safeParse(input);

     if (!validation.success) {
          return {
               status: "error",
               data: null,
               error: {
                    code: 400,
                    message: validation.error.issues[0]?.message ?? "Invalid input",
               },
          };
     }

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

     const { error } = await supabase.auth.updateUser({
          password: validation.data.password,
     });

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
          status: "success",
          data: { message: "Password updated successfully" },
          error: null,
     };
}
