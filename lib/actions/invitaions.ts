"use server";

import { ApiResponse } from "@/types/index.types";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { subscribe } from "diagnostics_channel";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export type InvitationRole = "manager" | "collaborator";

export type AcceptResult = ApiResponse & {
     projectId?: string;
};

/**
 * Creates an invitation via a direct insert. Authorization is enforced by
 * the `project_invitations_insert_permitted` RLS policy (checks
 * invite:members and that invited_by matches the caller) — this action
 * doesn't duplicate that check, it just surfaces whatever Postgres decides.
 * The DB also enforces: email lowercase, role != OWNER, one PENDING
 * invite per (project, email). Not checked here: whether the email
 * already belongs to an active member — add that if you need it.
 */
export async function inviteMember(
     projectId: string,
     email: string,
     role: InvitationRole,
     supabaseClient: SupabaseClient,
): Promise<ApiResponse> {
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
                    message: "Sign in required",
               },
          };
     }

     const dbRole = role === "manager" ? "MANAGER" : "COLLABORATOR";

     const { data: invitation, error } = await supabase
          .from("project_invitations")
          .insert({
               project_id: projectId,
               email: email.trim().toLowerCase(),
               role: dbRole,
               invited_by: user.id,
          })
          .single();

     if (error) {
          return {
               data: null,
               status: "error",
               error: {
                    code: 400,
                    message: "Failed to create invitation",
               },
          };
     }

     revalidatePath(`/projects/${projectId}/members`);
     return {
          error: null,
          status: "success",
          data: invitation,
     };
}

/**
 * Accepts an invitation for the currently authenticated user. Identity
 * matching (verified email vs invitation email) happens inside the RPC —
 * this action just surfaces whatever it decides.
 */
export async function acceptInvitation(token: string): Promise<AcceptResult> {
     const cookieStore = await cookies();

     const supabase = await createClient(cookieStore);

     const { data, error } = await supabase.rpc("accept_project_invitation", {
          p_token: token,
     });

     if (error) {
          return {
               data: null,
               status: "error",
               error: {
                    code: 400,
                    message: "Failed to accept invitation",
               },
          };
     }

     const result = data?.[0];
     if (!result) {
          return {
               data: null,
               status: "error",
               error: {
                    code: 400,
                    message: "No response from server",
               },
          };
     }

     if (result.ok) {
          revalidatePath("/projects");
          return {
               error: null,
               status: "success",
               data: { projectId: result.project_id },
          };
     }

     return {
          data: null,
          status: "error",
          error: {
               code: 400,
               message: "Failed to accept invitation",
          },
     };
}
