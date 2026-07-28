"use server";

import { ApiResponse } from "@/types/index.types";
import { createClient } from "@/utils/supabase/server";
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
     due_date: z.coerce
          .date()
          .min(new Date(), "Due date must be in the future"),
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
     due_date: z.coerce.date().optional(),
});

const DeleteProjectSchema = z.object({
     id: z.uuid("Invalid project ID"),
});

export async function getProjects(): Promise<ApiResponse> {
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
          .from("projects")
          .select(
               `
               *,
               project_members (
                    user_id,
                    role,
                    profiles ( full_name, avatar_url )
               )
          `,
          )
          .order("created_at", { ascending: false });

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

     const projectsWithMembers = data.map((project) => {
          const members = project.project_members.map((pm: any) => ({
               full_name: pm.profiles?.full_name ?? null,
               avatar_url: pm.profiles?.avatar_url ?? null,
               role: pm.role,
          }));
          return {
               ...project,
               members,
               memberCount: project.project_members.length,
          };
     });

     return {
          error: null,
          status: "success",
          data: projectsWithMembers,
     };
}

export async function getProjectDetails(
     projectId: string,
): Promise<ApiResponse> {
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

     const [projectResult, milestonesResult, tasksResult, membersResult] =
          await Promise.all([
               supabase
                    .from("projects")
                    .select("*")
                    .eq("id", projectId)
                    .single(),
               supabase
                    .from("milestones")
                    .select("*")
                    .eq("project_id", projectId)
                    .order("created_at", { ascending: true }),
               supabase
                    .from("tasks")
                    .select("id, status, parent_milestone_id")
                    .eq("project_id", projectId),
               supabase
                    .from("project_members")
                    .select("user_id, role, profiles(full_name, avatar_url)")
                    .eq("project_id", projectId),
          ]);

     if (projectResult.error || !projectResult.data) {
          return {
               data: null,
               status: "error",
               error: {
                    code: 404,
                    message:
                         projectResult.error?.message ?? "Project not found",
               },
          };
     }

     const tasks = tasksResult.data ?? [];
     const milestones = milestonesResult.data ?? [];
     const members = membersResult.data ?? [];

     const activeTasks = tasks.filter((t) => t.status !== "DONE").length;
     const doneTasks = tasks.filter((t) => t.status === "DONE").length;
     const totalTasks = tasks.length;
     const progress =
          totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

     const milestonesWithStatus = milestones.map((m) => {
          const milestoneTasks = tasks.filter(
               (t) => t.parent_milestone_id === m.id,
          );
          const milestoneDone = milestoneTasks.filter(
               (t) => t.status === "DONE",
          ).length;
          const milestoneTotal = milestoneTasks.length;
          const milestoneProgress =
               milestoneTotal > 0
                    ? Math.round((milestoneDone / milestoneTotal) * 100)
                    : 0;

          let status: "completed" | "in_progress" | "upcoming" = "upcoming";
          if (milestoneProgress === 100 && milestoneTotal > 0) {
               status = "completed";
          } else if (milestoneTotal > 0) {
               status = "in_progress";
          }

          return {
               ...m,
               status,
               taskCount: milestoneTotal,
               progress: milestoneProgress,
          };
     });

     const memberData = members.map((m: any) => ({
          user_id: m.user_id,
          role: m.role,
          full_name: m.profiles?.full_name ?? null,
          avatar_url: m.profiles?.avatar_url ?? null,
     }));

     return {
          error: null,
          status: "success",
          data: {
               project: projectResult.data,
               milestones: milestonesWithStatus,
               activeTasks,
               totalTasks,
               progress,
               members: memberData,
               memberCount: memberData.length,
          },
     };
}

export async function createProject(
     input: z.infer<typeof CreateProjectSchema>,
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

     const { name, description, due_date } = validation.data;

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
          .from("projects")
          .insert({
               name,
               description: description || null,
               due_date: due_date.toISOString(),
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
