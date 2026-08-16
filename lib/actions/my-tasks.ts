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
     group_id: z.uuid("Invalid group ID"),
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
     group_id: z.uuid("Invalid group ID").optional(),
     completed: z.boolean().optional(),
});

const CreateMyTaskGroupSchema = z.object({
     name: z
          .string()
          .min(1, "Group name is required")
          .max(100, "Group name must be 100 characters or less"),
});

const UpdateMyTaskGroupSchema = z.object({
     id: z.uuid("Invalid group ID"),
     name: z
          .string()
          .min(1, "Group name is required")
          .max(100, "Group name must be 100 characters or less"),
});

const DeleteMyTaskGroupSchema = z.object({
     id: z.uuid("Invalid group ID"),
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
          .order("completed", { ascending: true })
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

      const { name, description, priority, due_date, group_id } =
           validation.data;

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

      const { data: group } = await supabase
           .from("my_task_groups")
           .select("id")
           .eq("id", group_id)
           .eq("user_id", user.id)
           .maybeSingle();

      if (!group) {
           return {
                data: null,
                status: "error",
                error: {
                     code: 400,
                     message: "Task group not found",
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
                group_id,
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

      if (updateData.group_id) {
           const { data: group } = await supabase
                .from("my_task_groups")
                .select("id")
                .eq("id", updateData.group_id)
                .eq("user_id", user.id)
                .maybeSingle();

           if (!group) {
                return {
                     data: null,
                     status: "error",
                     error: {
                          code: 400,
                          message: "Task group not found",
                     },
                };
           }
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
                ...(updateData.group_id !== undefined && {
                     group_id: updateData.group_id,
                }),
                ...(updateData.completed !== undefined && {
                     completed: updateData.completed,
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

export async function getMyTaskGroups(): Promise<ApiResponse> {
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
          .from("my_task_groups")
          .select("*")
          .order("created_at", { ascending: true });

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

export async function createMyTaskGroup(
     input: z.infer<typeof CreateMyTaskGroupSchema>,
): Promise<ApiResponse> {
     const validation = CreateMyTaskGroupSchema.safeParse(input);

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

     const { name } = validation.data;

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
          .from("my_task_groups")
          .insert({ user_id: user.id, name })
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

export async function updateMyTaskGroup(
     input: z.infer<typeof UpdateMyTaskGroupSchema>,
): Promise<ApiResponse> {
     const validation = UpdateMyTaskGroupSchema.safeParse(input);

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

     const { id, name } = validation.data;

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
          .from("my_task_groups")
          .update({ name, updated_at: new Date().toISOString() })
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

export async function deleteMyTaskGroup(
     input: z.infer<typeof DeleteMyTaskGroupSchema>,
): Promise<ApiResponse> {
     const validation = DeleteMyTaskGroupSchema.safeParse(input);

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

     const { error } = await supabase
          .from("my_task_groups")
          .delete()
          .eq("id", id);

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
