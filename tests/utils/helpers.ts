import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const admin: SupabaseClient = createClient(
     SUPABASE_URL,
     SUPABASE_SERVICE_ROLE_KEY,
     {
          auth: { autoRefreshToken: false, persistSession: false },
     },
);

export type AuthenticatedUser = {
     id: string;
     email: string;
     password: string;
     client: SupabaseClient;
};

export async function createAuthenticatedUser(
     email: string,
     password: string,
     full_name?: string,
): Promise<AuthenticatedUser> {
     // Create the user using the admin client
     const { data: createdUser, error: createError } =
          await admin.auth.admin.createUser({
               email,
               password,
               user_metadata: {
                    full_name: full_name || "Test User",
                    email: email,
               },
               email_confirm: true,
          });

     if (createError) {
          throw createError;
     }

     const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
               autoRefreshToken: false,
               persistSession: false,
          },
     });

     const { error: signInError } = await client.auth.signInWithPassword({
          email,
          password,
     });

     if (signInError) {
          throw signInError;
     }

     return {
          id: createdUser.user.id,
          email,
          password,
          client,
     };
}

export async function signInUser(
     email: string,
     password: string,
): Promise<AuthenticatedUser> {
     const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
               autoRefreshToken: false,
               persistSession: false,
          },
     });

     const { data: signInData, error: signInError } =
          await client.auth.signInWithPassword({
               email,
               password,
          });

     if (signInError) {
          throw signInError;
     }

     return {
          id: signInData.user.id,
          email,
          password,
          client,
     };
}

export async function clearTestData() {
     const tables = [
          "project_invitations",
          "project_member_permissions",
          "project_members",
          "projects",
          "profiles",
          "auth.users",
     ];

     // We delete everything from the tables.
     // Using .neq('id', '00000000-0000-0000-0000-000000000000') is a safe way to target all rows in Supabase
     for (const table of tables) {
          await admin
               .from(table)
               .delete()
               .neq("id", "00000000-0000-0000-0000-000000000000");
     }

     // 2. Fetch and delete all authentication users via the Admin API
     const { data, error: listError } = await admin.auth.admin.listUsers(); //

     if (listError) {
          console.error("Failed to list auth users:", listError.message);
          return;
     }

     if (data?.users) {
          for (const user of data.users) {
               const { error: deleteError } = await admin.auth.admin.deleteUser(
                    user.id,
               ); //
               if (deleteError) {
                    console.error(
                         `Failed to delete auth user ${user.id}:`,
                         deleteError.message,
                    );
               }
          }
     }
}


export async function createProjectAs(user: AuthenticatedUser, name: string) {
  const { data, error } = await user.client
    .from("projects")
    .insert({ name,due_date:new Date(), created_by: user.id })
    .select()
    .single();

  return { data, error };
}

export async function getProjectAs(user: AuthenticatedUser, projectId: string) {
  const { data, error } = await user.client
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  return { data, error };
}

export async function addMemberToProject(
  projectId: string,
  userId: string,
  role: string = "COLLABORATOR",
) {
  await admin.from("project_members").insert({
    project_id: projectId,
    user_id: userId,
    role,
  });
}
export async function createMilestoneAs(
     user: AuthenticatedUser,
     projectId: string,
     title: string,
) {
     return user.client
          .from("milestones")
          .insert({ project_id: projectId, due_date:new Date(), created_by: user.id, title })
          .select()
          .single();
}

export async function getMilestonesAs(user: AuthenticatedUser, projectId: string) {
     return user.client
          .from("milestones")
          .select("*")
          .eq("project_id", projectId);
}
export async function createTaskAs(
  user: AuthenticatedUser,
  projectId: string,
  title: string,
  overrides: Record<string, unknown> = {},
) {
  const { data: milestone, error: milestoneError } = await createMilestoneAs(
    user,
    projectId,
    `${title} - Milestone`,
  );

  if (milestoneError) {
     return {data: null, error: milestoneError};
  }

  return user.client
    .from("tasks")
    .insert({
      project_id: projectId,
      created_by: user.id,
      assigned_to: user.id,
      parent_milestone_id: milestone.id,
      due_date: new Date(),
      title,
      ...overrides,
    })
    .select()
    .single();
}