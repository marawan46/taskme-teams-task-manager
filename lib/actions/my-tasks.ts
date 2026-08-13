"use server";

import { ApiResponse } from "@/types/index.types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

const CreateMyTaskSchema = z.object({
     name: z
          .string()
          .min(1, "Task name is required")
          .max(255, "Task name must be 255 characters or less"),
     description: z
          .string()
          .max(2000, "Description must be 2000 characters or less")
          .optional()
          .nullable(),
     priority: z
          .number()
          .int()
          .min(0, "Priority must be between 0 and 2")
          .max(2, "Priority must be between 0 and 2")
          .default(0),
     due_date: z.coerce.date(),
});

const UpdateMyTaskSchema = z.object({
     id: z.uuid("Invalid task ID"),
     name: z
          .string()
          .min(1, "Task name is required")
          .max(255, "Task name must be 255 characters or less")
          .optional(),
     description: z
          .string()
          .max(2000, "Description must be 2000 characters or less")
          .optional()
          .nullable(),
     priority: z
          .number()
          .int()
          .min(0, "Priority must be between 0 and 2")
          .max(2, "Priority must be between 0 and 2")
          .optional(),
     due_date: z.coerce.date().optional(),
});

const DeleteMyTaskSchema = z.object({
     id: z.uuid("Invalid task ID"),
});

export async function getMyTasks(): Promise<ApiResponse> {
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
          .from("my_tasks")
          .select("*")
          .order("due_date", { ascending: true });

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

export async function getAssignedTasks(): Promise<ApiResponse> {
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
          .from("tasks")
          .select(
               `
               *,
               projects ( name ),
               assigned_profile:assigned_to ( full_name, avatar_url )
          `,
          )
          .eq("assigned_to", user.id)
          .order("due_date", { ascending: true });

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

export async function createMyTask(
     input: z.infer<typeof CreateMyTaskSchema>,
): Promise<ApiResponse> {
     const validation = CreateMyTaskSchema.safeParse(input);

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

     const { name, description, priority, due_date } = validation.data;

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
          .from("my_tasks")
          .insert({
               user_id: user.id,
               name,
               description: description || null,
               priority,
               due_date: due_date.toISOString(),
          })
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

export async function updateMyTask(
     input: z.infer<typeof UpdateMyTaskSchema>,
): Promise<ApiResponse> {
     const validation = UpdateMyTaskSchema.safeParse(input);

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

     const { id, ...updateData } = validation.data;

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
          .from("my_tasks")
          .update({
               ...(updateData.name !== undefined && { name: updateData.name }),
               ...(updateData.description !== undefined && {
                    description: updateData.description,
               }),
               ...(updateData.priority !== undefined && {
                    priority: updateData.priority,
               }),
               ...(updateData.due_date !== undefined && {
                    due_date: updateData.due_date.toISOString(),
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

export async function deleteMyTask(
     input: z.infer<typeof DeleteMyTaskSchema>,
): Promise<ApiResponse> {
     const validation = DeleteMyTaskSchema.safeParse(input);

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

     const { error } = await supabase.from("my_tasks").delete().eq("id", id);

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
