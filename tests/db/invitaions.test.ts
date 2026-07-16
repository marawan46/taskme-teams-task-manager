import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, test } from "vitest";
import dotenv from "dotenv";
import {
  addMemberToProject,
  clearTestData,
  createAuthenticatedUser,
  createProjectAs,
  type AuthenticatedUser,
} from "../utils/helpers";

dotenv.config({ path: ".env.local" });

let owner: AuthenticatedUser;
let member: AuthenticatedUser;
let invitee: AuthenticatedUser;
let outsider: AuthenticatedUser;
let admin: SupabaseClient;

beforeEach(async () => {
  await clearTestData();

  admin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  owner = await createAuthenticatedUser(
    "owner@test.com",
    "password123",
    "Owner User",
  );
  member = await createAuthenticatedUser(
    "member@test.com",
    "password123",
    "Member User",
  );
  invitee = await createAuthenticatedUser(
    "invitee@test.com",
    "password123",
    "Invitee User",
  );
  outsider = await createAuthenticatedUser(
    "outsider@test.com",
    "password123",
    "Outsider User",
  );
});

async function insertInvitationAs(
  user: AuthenticatedUser,
  projectId: string,
  email: string,
  role: string = "COLLABORATOR",
) {
  return user.client.from("project_invitations").insert({
    project_id: projectId,
    email,
    role,
    invited_by: user.id,
  });
}

async function getInvitationByToken(token: string) {
  const { data, error } = await admin
    .from("project_invitations")
    .select("*")
    .eq("token", token)
    .single();

  return { data, error };
}

// ============================================================
// Table constraints
// ============================================================

describe("project_invitations — table constraints", () => {
  test("email is stored as lowercase", async () => {
    const { data: project } = await createProjectAs(owner, "Invite Project");

    const {error} =await owner.client.from("project_invitations").insert({
      project_id: project.id,
      email: "UPPER@TEST.COM",
      role: "COLLABORATOR",
      invited_by: owner.id,
    });

    expect(error).toBeDefined();
  });

  test("role cannot be OWNER", async () => {
    const { data: project } = await createProjectAs(owner, "No Owner Role");

    const { error } = await admin.from("project_invitations").insert({
      project_id: project.id,
      email: "test@test.com",
      role: "OWNER",
      invited_by: owner.id,
    });

    expect(error).not.toBeNull();
  });

  test("only one PENDING invite per email per project", async () => {
    const { data: project } = await createProjectAs(owner, "Unique PENDING");

    await admin.from("project_invitations").insert({
      project_id: project.id,
      email: "dup@test.com",
      role: "COLLABORATOR",
      invited_by: owner.id,
      status: "PENDING",
    });

    const { error } = await admin.from("project_invitations").insert({
      project_id: project.id,
      email: "dup@test.com",
      role: "COLLABORATOR",
      invited_by: owner.id,
      status: "PENDING",
    });

    expect(error).not.toBeNull();
  });

  test("expired invitation allows re-invite of same email", async () => {
    const { data: project } = await createProjectAs(owner, "Reinvite Test");

    await admin.from("project_invitations").insert({
      project_id: project.id,
      email: "reinvite@test.com",
      role: "COLLABORATOR",
      invited_by: owner.id,
      status: "EXPIRED",
    });

    const { error } = await admin.from("project_invitations").insert({
      project_id: project.id,
      email: "reinvite@test.com",
      role: "MANAGER",
      invited_by: owner.id,
      status: "PENDING",
    });

    expect(error).toBeNull();
  });
});

// ============================================================
// RLS — INSERT
// ============================================================

describe("project_invitations — RLS INSERT", () => {
  test("owner can insert an invitation", async () => {
    const { data: project } = await createProjectAs(owner, "RLS Insert Test");

    const { error } = await insertInvitationAs(
      owner,
      project.id,
      "new@test.com",
    );

    expect(error).toBeNull();
  });

  test("invited_by must match the authenticated user", async () => {
    const { data: project } = await createProjectAs(owner, "Fake Inviter");

    const { error } = await owner.client
      .from("project_invitations")
      .insert({
        project_id: project.id,
        email: "someone@test.com",
        role: "COLLABORATOR",
        invited_by: outsider.id,
      });

    expect(error).not.toBeNull();
  });

  test("collaborator without invite:members cannot insert", async () => {
    const { data: project } = await createProjectAs(owner, "No Invite Perm");
    await addMemberToProject(project.id, member.id, "COLLABORATOR");

    const { error } = await insertInvitationAs(
      member,
      project.id,
      "fail@test.com",
    );

    expect(error).not.toBeNull();
  });

  test("outsider cannot insert an invitation for a project they don't belong to", async () => {
    const { data: project } = await createProjectAs(
      owner,
      "Private Invite Project",
    );

    const { error } = await insertInvitationAs(
      outsider,
      project.id,
      "sneak@test.com",
    );

    expect(error).not.toBeNull();
  });
});

// ============================================================
// RLS — SELECT
// ============================================================

describe("project_invitations — RLS SELECT", () => {
  test("inviter can see their own invitations", async () => {
    const { data: project } = await createProjectAs(owner, "Visible Invite");
    await insertInvitationAs(owner, project.id, "see@test.com");

    const { data, error } = await owner.client
      .from("project_invitations")
      .select("*")
      .eq("project_id", project.id);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  test("owner with invite:members can see all project invitations", async () => {
    const { data: project } = await createProjectAs(owner, "Owner Sees All");
    await insertInvitationAs(owner, project.id, "invite1@test.com");

    const { data, error } = await owner.client
      .from("project_invitations")
      .select("*")
      .eq("project_id", project.id);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  test("invitee can see invitations addressed to their email", async () => {
    const { data: project } = await createProjectAs(
      owner,
      "Invitee Sees Own",
    );
    await insertInvitationAs(owner, project.id, invitee.email);

    const { data, error } = await invitee.client
      .from("project_invitations")
      .select("*")
      .eq("project_id", project.id);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  test("outsider cannot see invitations for a project they don't belong to", async () => {
    const { data: project } = await createProjectAs(
      owner,
      "Hidden Invitations",
    );
    await insertInvitationAs(owner, project.id, "hidden@test.com");

    const { data, error } = await outsider.client
      .from("project_invitations")
      .select("*")
      .eq("project_id", project.id);

    expect(error).toBeNull();
    expect(data).toHaveLength(0);
  });
});

// ============================================================
// accept_project_invitation()
// ============================================================

describe("accept_project_invitation()", () => {
  async function setupInvitation() {
    const { data: project } = await createProjectAs(owner, "Accept Project");
    const token = crypto.randomUUID();

    await admin.from("project_invitations").insert({
      project_id: project.id,
      email: invitee.email,
      role: "COLLABORATOR",
      invited_by: owner.id,
      token,
    });

    return { project, token };
  }

  test("invitee can accept a valid invitation", async () => {
    const { project, token } = await setupInvitation();

    const { data, error } = await invitee.client.rpc(
      "accept_project_invitation",
      { p_token: token },
    );

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data[0].ok).toBe(true);
    expect(data[0].code).toBeNull();

    const { data: member } = await admin
      .from("project_members")
      .select("*")
      .eq("project_id", project.id)
      .eq("user_id", invitee.id)
      .single();

    expect(member).not.toBeNull();
    expect(member.role).toBe("COLLABORATOR");
  });

  test("invitation status changes to ACCEPTED after acceptance", async () => {
    const { token } = await setupInvitation();

    await invitee.client.rpc("accept_project_invitation", {
      p_token: token,
    });

    const { data } = await getInvitationByToken(token);
    expect(data.status).toBe("ACCEPTED");
    expect(data.accepted_at).not.toBeNull();
  });

  test("invalid token returns not_found_or_used", async () => {
    const fakeToken = crypto.randomUUID();

    const { data, error } = await invitee.client.rpc(
      "accept_project_invitation",
      { p_token: fakeToken },
    );

    expect(error).toBeNull();
    expect(data[0].ok).toBe(false);
    expect(data[0].code).toBe("not_found_or_used");
  });

  test("expired invitation returns expired and sets status to EXPIRED", async () => {
    const { data: project } = await createProjectAs(owner, "Expired Invite");
    const token = crypto.randomUUID();

    await admin.from("project_invitations").insert({
      project_id: project.id,
      email: invitee.email,
      role: "COLLABORATOR",
      invited_by: owner.id,
      token,
      expires_at: new Date(Date.now() - 1000).toISOString(),
    });

    const { data, error } = await invitee.client.rpc(
      "accept_project_invitation",
      { p_token: token },
    );

    expect(error).toBeDefined();
    expect(data[0].ok).toBe(false);
    expect(data[0].code).toBe("expired");

    const { data: row } = await getInvitationByToken(token);
    expect(row.status).toBe("EXPIRED");
  });

  test("wrong email returns wrong_account", async () => {
    const { token } = await setupInvitation();

    const { data, error } = await outsider.client.rpc(
      "accept_project_invitation",
      { p_token: token },
    );

    expect(error).toBeNull();
    expect(data[0].ok).toBe(false);
    expect(data[0].code).toBe("wrong_account");
  });

  test("accepting twice returns already_member", async () => {
    const { token } = await setupInvitation();

    await invitee.client.rpc("accept_project_invitation", {
      p_token: token,
    });

    const { data, error } = await invitee.client.rpc(
      "accept_project_invitation",
      { p_token: token },
    );

    expect(error).toBeNull();
    expect(data[0].ok).toBe(false);
    expect(data[0].code).toBe("not_found_or_used");
  });

  test("MANAGER role is granted on acceptance", async () => {
    const { data: project } = await createProjectAs(owner, "Manager Invite");
    const token = crypto.randomUUID();

    await admin.from("project_invitations").insert({
      project_id: project.id,
      email: invitee.email,
      role: "MANAGER",
      invited_by: owner.id,
      token,
    });

    await invitee.client.rpc("accept_project_invitation", {
      p_token: token,
    });

    const { data: member } = await admin
      .from("project_members")
      .select("role")
      .eq("project_id", project.id)
      .eq("user_id", invitee.id)
      .single();

    expect(member?.role).toBe("MANAGER");
  });
});

// ============================================================
// sweep_expired_project_invitations()
// ============================================================

describe("sweep_expired_project_invitations()", () => {
  test("sweeps expired PENDING invitations", async () => {
    const { data: project } = await createProjectAs(owner, "Sweep Test");

    await admin.from("project_invitations").insert([
      {
        project_id: project.id,
        email: "expired1@test.com",
        role: "COLLABORATOR",
        invited_by: owner.id,
        status: "PENDING",
        expires_at: new Date(Date.now() - 1000).toISOString(),
      },
      {
        project_id: project.id,
        email: "expired2@test.com",
        role: "COLLABORATOR",
        invited_by: owner.id,
        status: "PENDING",
        expires_at: new Date(Date.now() - 1000).toISOString(),
      },
    ]);

    const { data: swept, error } = await admin.rpc(
      "sweep_expired_project_invitations",
    );

    expect(error).toBeNull();
    expect(swept).toBe(2);

    const { data: rows } = await admin
      .from("project_invitations")
      .select("status")
      .eq("project_id", project.id);

    expect(rows?.every((r) => r.status === "EXPIRED")).toBe(true);
  });

  test("does not touch non-PENDING invitations", async () => {
    const { data: project } = await createProjectAs(owner, "Sweep Safety");

    await admin.from("project_invitations").insert({
      project_id: project.id,
      email: "accepted@test.com",
      role: "COLLABORATOR",
      invited_by: owner.id,
      status: "ACCEPTED",
      expires_at: new Date(Date.now() - 1000).toISOString(),
    });

    const { data: swept } = await admin.rpc(
      "sweep_expired_project_invitations",
    );

    expect(swept).toBe(0);

    const { data: row } = await admin
      .from("project_invitations")
      .select("status")
      .eq("project_id", project.id)
      .single();

    expect(row?.status).toBe("ACCEPTED");
  });

  test("does not touch valid PENDING invitations", async () => {
    const { data: project } = await createProjectAs(owner, "Sweep Future");

    await admin.from("project_invitations").insert({
      project_id: project.id,
      email: "valid@test.com",
      role: "COLLABORATOR",
      invited_by: owner.id,
      status: "PENDING",
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const { data: swept } = await admin.rpc(
      "sweep_expired_project_invitations",
    );

    expect(swept).toBe(0);

    const { data: row } = await admin
      .from("project_invitations")
      .select("status")
      .eq("project_id", project.id)
      .single();

    expect(row?.status).toBe("PENDING");
  });

  test("returns 0 when there is nothing to sweep", async () => {
    const { data: swept } = await admin.rpc(
      "sweep_expired_project_invitations",
    );

    expect(swept).toBe(0);
  });
});
