"use server";

import { ApiResponse } from "@/types/index.types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

const CreateTaskSchema = z.object({
     project_id: z.uuid("Invalid project ID"),
     parent_milestone_id: z.uuid("Invalid milestone ID"),
     parent_task_id: z.uuid("Invalid parent task ID").optional().nullable(),
     title: z
          .string()
          .min(1, "Task title is required")
          .max(255, "Title must be 255 characters or less"),
     description: z
          .string()
          .max(5000, "Description must be 5000 characters or less")
          .optional()
          .nullable(),
     assigned_to: z.uuid("Invalid assignee"),
     due_date: z.coerce.date(),
     priority: z
          .number()
          .int()
          .min(0, "Priority must be between 0 and 3")
          .max(3, "Priority must be between 0 and 3")
          .default(0),
     status: z
          .enum(["TODO", "IN_PROGRESS", "UNDER_REVIEW", "DONE"])
          .default("TODO"),
});

const UpdateTaskSchema = z.object({
     id: z.uuid("Invalid task ID"),
     title: z
          .string()
          .min(1, "Task title is required")
          .max(255, "Title must be 255 characters or less")
          .optional(),
     description: z
          .string()
          .max(5000, "Description must be 5000 characters or less")
          .optional()
          .nullable(),
     assigned_to: z.uuid("Invalid assignee").optional(),
     due_date: z.coerce.date().optional(),
     priority: z
          .number()
          .int()
          .min(0, "Priority must be between 0 and 3")
          .max(3, "Priority must be between 0 and 3")
          .optional(),
     status: z.enum(["TODO", "IN_PROGRESS", "UNDER_REVIEW", "DONE"]).optional(),
});

const DeleteTaskSchema = z.object({
     id: z.uuid("Invalid task ID"),
});

export async function createTask(
     input: z.infer<typeof CreateTaskSchema>,
): Promise<ApiResponse> {
     const validation = CreateTaskSchema.safeParse(input);

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

     const {
          project_id,
          parent_milestone_id,
          parent_task_id,
          title,
          description,
          assigned_to,
          due_date,
          priority,
          status,
     } = validation.data;

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
          .insert({
               project_id,
               parent_milestone_id,
               ...(parent_task_id && { parent_task_id }),
               title,
               description: description || null,
               assigned_to,
               created_by: user.id,
               due_date: due_date.toISOString(),
               priority,
               status,
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

export async function updateTask(
     input: z.infer<typeof UpdateTaskSchema>,
): Promise<ApiResponse> {
     const validation = UpdateTaskSchema.safeParse(input);

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
          .from("tasks")
          .update({
               ...(updateData.title !== undefined && {
                    title: updateData.title,
               }),
               ...(updateData.description !== undefined && {
                    description: updateData.description,
               }),
               ...(updateData.assigned_to !== undefined && {
                    assigned_to: updateData.assigned_to,
               }),
               ...(updateData.due_date !== undefined && {
                    due_date: updateData.due_date.toISOString(),
               }),
               ...(updateData.priority !== undefined && {
                    priority: updateData.priority,
               }),
               ...(updateData.status !== undefined && {
                    status: updateData.status,
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

export async function deleteTask(
     input: z.infer<typeof DeleteTaskSchema>,
): Promise<ApiResponse> {
     const validation = DeleteTaskSchema.safeParse(input);

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
               status: "error",
               data: null,
               error: {
                    code: 401,
                    message: "Authentication required",
               },
          };
     }

     const { error } = await supabase.from("tasks").delete().eq("id", id);

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
