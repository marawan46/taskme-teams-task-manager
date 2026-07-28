"use server";

import { ApiResponse } from "@/types/index.types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

const CreateMilestoneSchema = z.object({
     project_id: z.uuid("Invalid project ID"),
     title: z
          .string()
          .min(1, "Milestone title is required")
          .max(255, "Title must be 255 characters or less"),
     description: z
          .string()
          .max(1000, "Description must be 1000 characters or less")
          .optional()
          .nullable(),
     due_date: z.coerce
          .date()
          .min(new Date(), "Due date must be in the future"),
});

export async function createMilestone(
     input: z.infer<typeof CreateMilestoneSchema>,
): Promise<ApiResponse> {
     const validation = CreateMilestoneSchema.safeParse(input);

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

     const { project_id, title, description, due_date } = validation.data;

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

     const { data, error } = await supabase
          .from("milestones")
          .insert({
               title,
               description: description || null,
               due_date: due_date.toISOString(),
               project_id,
               created_by: user.id,
          })
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

     return {
          error: null,
          status: "success",
          data,
     };
}
