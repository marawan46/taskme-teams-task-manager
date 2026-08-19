"use server";

import { ApiResponse } from "@/types/index.types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createHash, randomBytes } from "crypto";
import { z } from "zod";
import { sendInvitationEmail } from "@/lib/email";

export type InvitationRole = "manager" | "collaborator";

export type AcceptResult = ApiResponse & {
	projectId?: string;
};

const InviteMemberSchema = z.object({
	projectId: z.uuid("Invalid project ID"),
	role_tag: z.string().trim().max(20, "Role tag must be 20 characters or less").nullable(),
	email: z.email("Invalid email address").trim().toLowerCase(),
	role: z.enum(["manager", "collaborator"]),
});

/**
 * Generates a raw invitation token (256 bits of entropy) and returns
 * its SHA-256 hex hash. Only the hash is ever persisted — the raw token
 * travels solely in the invitation email.
 */
function generateInvitationToken(): { token: string; tokenHash: string } {
	const token = randomBytes(32).toString("base64url");
	const tokenHash = createHash("sha256").update(token).digest("hex");
	return { token, tokenHash };
}

/**
 * Creates an invitation via a direct insert. Authorization is enforced by
 * the `project_invitations_insert_permitted` RLS policy (checks
 * invite:members and that invited_by matches the caller) — this action
 * doesn't duplicate that check. The DB also enforces: email lowercase,
 * role != OWNER, one PENDING invite per (project, email), the 50/24h
 * per-inviter rate limit, and that the email isn't already an active member.
 */
export async function inviteMember(
	input: z.infer<typeof InviteMemberSchema>,
): Promise<ApiResponse> {
	const validation = InviteMemberSchema.safeParse(input);

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

	const { projectId, email, role, role_tag } = validation.data;

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
				message: "Sign in required",
			},
		};
	}

	const { token, tokenHash } = generateInvitationToken();
	const dbRole = role === "manager" ? "MANAGER" : "COLLABORATOR";

	const { data: invitation, error } = await supabase
		.from("project_invitations")
		.insert({
			project_id: projectId,
			email,
			role: dbRole,
			role_tag: role_tag,
			invited_by: user.id,
			token_hash: tokenHash,
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

	const [projectResult, profileResult] = await Promise.all([
		supabase
			.from("projects")
			.select("name")
			.eq("id", projectId)
			.single(),
		supabase
			.from("profiles")
			.select("full_name")
			.eq("id", user.id)
			.single(),
	]);

	const emailResult = await sendInvitationEmail({
		to: invitation.email,
		projectName: projectResult.data?.name ?? "a project",
		inviterName: profileResult.data?.full_name ?? null,
		token,
		expiresAt: invitation.expires_at,
	});

	if (!emailResult.ok) {
		// Roll back the invite so a PENDING row is never left without
		// a delivered email.
		await supabase.rpc("void_project_invitation", {
			p_invitation_id: invitation.id,
		});

		return {
			data: null,
			status: "error",
			error: {
				code: 500,
				message: emailResult.error ?? "Failed to send invitation email",
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
 * Returns the invitations for a project. Row-level visibility is handled
 * by the `project_invitations_select_relevant` RLS policy (inviter, anyone
 * with invite:members, or the matching invitee email).
 */
export async function getProjectInvitations(
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
				message: "Sign in required",
			},
		};
	}

	const { data, error } = await supabase
		.from("project_invitations")
		.select("*")
		.eq("project_id", projectId)
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

	return {
		error: null,
		status: "success",
		data,
	};
}

/**
 * Accepts an invitation for the currently authenticated user. Identity
 * matching (verified email vs invitation email) happens inside the RPC —
 * this action just surfaces whatever it decides.
 */
export async function acceptInvitation(token: string): Promise<AcceptResult> {
	const cookieStore = await cookies();
	const supabase = createClient(cookieStore);

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
		const projectId = result.invitation?.project_id;
		if (projectId) {
			revalidatePath(`/projects/${projectId}`);
		}
		revalidatePath("/projects");
		return {
			error: null,
			status: "success",
			data: { projectId },
		};
	}

	return {
		data: null,
		status: "error",
		error: {
			code: 400,
			message:
				result.message ?? "Failed to accept invitation",
		},
	};
}
