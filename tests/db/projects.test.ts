import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeEach, describe, expect, test } from "vitest";
import dotenv from "dotenv";
import {
  addMemberToProject,
  clearTestData,
  createAuthenticatedUser,
  createProjectAs,
  getProjectAs,
  type AuthenticatedUser,
} from "../utils/helpers";

dotenv.config({ path: ".env.local" });

let owner: AuthenticatedUser;
let member: AuthenticatedUser;
let outsider: AuthenticatedUser;
let admin: SupabaseClient;
// afterAll(async () => {
//   await clearTestData();
// });
beforeEach(async () => {

  admin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
const testRunId = Date.now() + Math.random().toString(36).slice(2, 9);

  owner = await createAuthenticatedUser(
    `owner${testRunId}@test.com`,
    "password123",
    "Owner User",
  );
  member = await createAuthenticatedUser(
    `member${testRunId}@test.com`,
    "password123",
    "Member User",
  );
  outsider = await createAuthenticatedUser(
    `outsider${testRunId}@test.com`,
    "password123",
    "Outsider User",
  );
});


describe("projects — create (INSERT)", () => {
  test("owner can create a project", async () => {
    const { data, error } = await createProjectAs(owner, "My Project");

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data.name).toBe("My Project");
    expect(data.created_by).toBe(owner.id);
  });

  test("created_by must match authenticated user", async () => {
    const { error } = await owner.client
      .from("projects")
      .insert({ name: "Bad Project", created_by: outsider.id })
      .select()
      .single();

    expect(error).not.toBeNull();
  });

  test("project is visible to creator after insert", async () => {
    const { data: project } = await createProjectAs(owner, "Visible Project");
    const { data, error } = await getProjectAs(owner, project.id);

    expect(error).toBeNull();
    expect(data.id).toBe(project.id);
  });

  test("project is visible to member after membership is added", async () => {
    const { data: project } = await createProjectAs(owner, "Team Project");
    await addMemberToProject(project.id, member.id);

    const { data, error } = await getProjectAs(member, project.id);

    expect(error).toBeNull();
    expect(data.id).toBe(project.id);
  });

  test("outsider cannot see a project they are not a member of", async () => {
    const { data: project } = await createProjectAs(owner, "Private Project");
    const { data, error } = await getProjectAs(outsider, project.id);

    expect(error).not.toBeNull();
  });
});

describe("projects — update", () => {
  test("owner can update project name", async () => {
    const { data: project } = await createProjectAs(owner, "Original Name");

    const { data, error } = await owner.client
      .from("projects")
      .update({ name: "Updated Name" })
      .eq("id", project.id)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data.name).toBe("Updated Name");
  });

  test("owner can update project description", async () => {
    const { data: project } = await createProjectAs(owner, "My Project");

    const { data, error } = await owner.client
      .from("projects")
      .update({ description: "A new description" })
      .eq("id", project.id)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data.description).toBe("A new description");
  });

  test("outsider cannot update a project they don't own", async () => {
    const { data: project } = await createProjectAs(owner, "Protected Project");

    const { data, error } = await outsider.client
      .from("projects")
      .update({ name: "Hacked Name" })
      .eq("id", project.id)
      .select()
      .single();

    expect(error).not.toBeNull();
  });

  test("collaborator cannot update project without update:project permission", async () => {
    const { data: project } = await createProjectAs(owner, "Owner Only Project");
    await addMemberToProject(project.id, member.id, "COLLABORATOR");

    const { data, error } = await member.client
      .from("projects")
      .update({ name: "Should Fail" })
      .eq("id", project.id)
      .select()
      .single();

    expect(error).not.toBeNull();
  });
});

describe("projects — delete", () => {
  test("owner can delete a project", async () => {
    const { data: project } = await createProjectAs(owner, "To Be Deleted");

    const { error } = await owner.client
      .from("projects")
      .delete()
      .eq("id", project.id);

    expect(error).toBeNull();

    const { data, error: fetchError } = await getProjectAs(owner, project.id);
    expect(data).toBeNull();
    expect(fetchError).not.toBeNull();
  });

  test("outsider cannot delete a project they don't own", async () => {
    const { data: project } = await createProjectAs(owner, "Safe Project");

    const { error } = await outsider.client
      .from("projects")
      .delete()
      .eq("id", project.id);

    expect(error).toBeDefined();

    const { data } = await getProjectAs(owner, project.id);
    expect(data).not.toBeNull();
  });

  test("collaborator cannot delete project without delete:project permission", async () => {
    const { data: project } = await createProjectAs(owner, "Protected Delete");
    await addMemberToProject(project.id, member.id, "COLLABORATOR");

    const { error } = await member.client
      .from("projects")
      .delete()
      .eq("id", project.id);

    expect(error).toBeDefined();

    const { data } = await getProjectAs(owner, project.id);
    expect(data).not.toBeNull();
  });

  test("deleting a project cascades to project_members", async () => {
    const { data: project } = await createProjectAs(owner, "Cascade Test");
    await addMemberToProject(project.id, member.id, "COLLABORATOR");

    await owner.client.from("projects").delete().eq("id", project.id);

    const { data: members } = await admin
      .from("project_members")
      .select("*")
      .eq("project_id", project.id);

    expect(members).toHaveLength(0);
  });
});
