import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeEach, describe, expect, test } from "vitest";
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
let manager: AuthenticatedUser;
let collaborator: AuthenticatedUser;
let outsider: AuthenticatedUser;
let admin: SupabaseClient;

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
  manager = await createAuthenticatedUser(
    `manager${testRunId}@test.com`,
    "password123",
    "Manager User",
  );
  collaborator = await createAuthenticatedUser(
    `collaborator${testRunId}@test.com`,
    "password123",
    "Collaborator User",
  );
  outsider = await createAuthenticatedUser(
    `outsider${testRunId}@test.com`,
    "password123",
    "Outsider User",
  );
});

async function setupProject(
  roles: { manager?: boolean; collaborator?: boolean } = {},
) {
  const { data: project } = await createProjectAs(owner, "Test Project");

  if (roles.manager) {
    await addMemberToProject(project.id, manager.id, "MANAGER");
  }
  if (roles.collaborator) {
    await addMemberToProject(project.id, collaborator.id, "COLLABORATOR");
  }

  return project;
}

async function createTaskAs(
  user: AuthenticatedUser,
  projectId: string,
  title: string,
  overrides: Record<string, unknown> = {},
) {
  return user.client
    .from("tasks")
    .insert({
      project_id: projectId,
      created_by: user.id,
      assigned_to: user.id,
      title,
      ...overrides,
    })
    .select()
    .single();
}

async function getTasksAs(user: AuthenticatedUser, projectId: string) {
  return user.client
    .from("tasks")
    .select("*")
    .eq("project_id", projectId);
}

// ============================================================
// SELECT
// ============================================================

describe("tasks — SELECT", () => {
  test("owner can read tasks", async () => {
    const project = await setupProject({ manager: true, collaborator: true });
    await createTaskAs(owner, project.id, "T1");

    const { data, error } = await getTasksAs(owner, project.id);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  test("manager can read tasks", async () => {
    const project = await setupProject({ manager: true });
    await createTaskAs(owner, project.id, "T1");

    const { data, error } = await getTasksAs(manager, project.id);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  test("collaborator can read tasks", async () => {
    const project = await setupProject({ collaborator: true });
    await createTaskAs(owner, project.id, "T1");

    const { data, error } = await getTasksAs(collaborator, project.id);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  test("outsider cannot read tasks", async () => {
    const project = await setupProject();
    await createTaskAs(owner, project.id, "T1");

    const { data, error } = await getTasksAs(outsider, project.id);

    expect(error).toBeNull();
    expect(data).toHaveLength(0);
  });
});

// ============================================================
// INSERT
// ============================================================

describe("tasks — INSERT", () => {
  test("owner can create a task", async () => {
    const project = await setupProject();

    const { data, error } = await createTaskAs(
      owner,
      project.id,
      "Implement login",
    );

    expect(error).toBeNull();
    expect(data.title).toBe("Implement login");
    expect(data.created_by).toBe(owner.id);
    expect(data.status).toBe("TODO");
  });

  test("manager can create a task", async () => {
    const project = await setupProject({ manager: true });

    const { data, error } = await createTaskAs(
      manager,
      project.id,
      "Write tests",
    );

    expect(error).toBeNull();
    expect(data.title).toBe("Write tests");
    expect(data.created_by).toBe(manager.id);
  });

  test("collaborator cannot create a task", async () => {
    const project = await setupProject({ collaborator: true });

    const { data, error } = await createTaskAs(
      collaborator,
      project.id,
      "Should Fail",
    );

    expect(error).not.toBeNull();
  });

  test("outsider cannot create a task", async () => {
    const project = await setupProject();

    const { data, error } = await createTaskAs(
      outsider,
      project.id,
      "Should Fail",
    );

    expect(error).not.toBeNull();
  });

  test("task defaults to TODO status", async () => {
    const project = await setupProject();

    const { data } = await createTaskAs(owner, project.id, "Default Status");

    expect(data.status).toBe("TODO");
  });

  test("task stores assigned_to", async () => {
    const project = await setupProject({ manager: true });

    const { data, error } = await createTaskAs(owner, project.id, "Assigned", {
      assigned_to: manager.id,
    });

    expect(error).toBeNull();
    expect(data.assigned_to).toBe(manager.id);
  });

  test("parent_task_id links to a valid task", async () => {
    const project = await setupProject();
    const { data: parent } = await createTaskAs(owner, project.id, "Parent");

    const { data: child, error } = await createTaskAs(
      owner,
      project.id,
      "Child",
      { parent_task_id: parent.id },
    );

    expect(error).toBeNull();
    expect(child.parent_task_id).toBe(parent.id);
  });
});

// ============================================================
// UPDATE
// ============================================================

describe("tasks — UPDATE", () => {
  test("owner can update task title", async () => {
    const project = await setupProject();
    const { data: task } = await createTaskAs(owner, project.id, "Original");

    const { data, error } = await owner.client
      .from("tasks")
      .update({ title: "Updated" })
      .eq("id", task.id)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data.title).toBe("Updated");
  });

  test("manager can update a task", async () => {
    const project = await setupProject({ manager: true });
    const { data: task } = await createTaskAs(owner, project.id, "Original");

    const { data, error } = await manager.client
      .from("tasks")
      .update({ title: "Manager Update" })
      .eq("id", task.id)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data.title).toBe("Manager Update");
  });

  test("collaborator cannot update a task", async () => {
    const project = await setupProject({ collaborator: true });
    const { data: task } = await createTaskAs(owner, project.id, "Protected");

    const { data, error } = await collaborator.client
      .from("tasks")
      .update({ title: "Should Fail" })
      .eq("id", task.id)
      .select()
      .single();

    expect(error).not.toBeNull();
  });

  test("outsider cannot update a task", async () => {
    const project = await setupProject();
    const { data: task } = await createTaskAs(owner, project.id, "Protected");

    const { data, error } = await outsider.client
      .from("tasks")
      .update({ title: "Should Fail" })
      .eq("id", task.id)
      .select()
      .single();

    expect(error).not.toBeNull();
  });
});

// ============================================================
// DELETE
// ============================================================

describe("tasks — DELETE", () => {
  test("owner can delete a task", async () => {
    const project = await setupProject();
    const { data: task } = await createTaskAs(owner, project.id, "To Delete");

    const { error } = await owner.client
      .from("tasks")
      .delete()
      .eq("id", task.id);

    expect(error).toBeNull();

    const { data } = await getTasksAs(owner, project.id);
    expect(data).toHaveLength(0);
  });

  test("manager can delete a task", async () => {
    const project = await setupProject({ manager: true });
    const { data: task } = await createTaskAs(owner, project.id, "To Delete");

    const { error } = await manager.client
      .from("tasks")
      .delete()
      .eq("id", task.id);

    expect(error).toBeNull();

    const { data } = await getTasksAs(manager, project.id);
    expect(data).toHaveLength(0);
  });

  test("collaborator cannot delete a task", async () => {
    const project = await setupProject({ collaborator: true });
    const { data: task } = await createTaskAs(owner, project.id, "Protected");

    const response = await collaborator.client
      .from("tasks")
      .delete()
      .eq("id", task.id);

    expect(response.status).toBe(204);

    const { data } = await getTasksAs(owner, project.id);
    expect(data).toHaveLength(1);
  });

  test("outsider cannot delete a task", async () => {
    const project = await setupProject();
    const { data: task } = await createTaskAs(owner, project.id, "Protected");

    const response = await outsider.client
      .from("tasks")
      .delete()
      .eq("id", task.id);

    expect(response.status).toBe(204);

    const { data } = await getTasksAs(owner, project.id);
    expect(data).toHaveLength(1);
  });
});

// ============================================================
// Status transitions — state machine
// ============================================================

describe("tasks — status transitions", () => {
  async function updateStatus(
    user: AuthenticatedUser,
    taskId: string,
    newStatus: string,
  ) {
    return user.client
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId)
      .select()
      .single();
  }

  test("TODO -> IN_PROGRESS is allowed", async () => {
    const project = await setupProject();
    const { data: task } = await createTaskAs(owner, project.id, "Transition");

    const { data, error } = await updateStatus(owner, task.id, "IN_PROGRESS");

    expect(error).toBeNull();
    expect(data.status).toBe("IN_PROGRESS");
  });

  test("TODO -> UNDER_REVIEW is rejected", async () => {
    const project = await setupProject();
    const { data: task } = await createTaskAs(owner, project.id, "Bad Jump");

    const { error } = await updateStatus(owner, task.id, "UNDER_REVIEW");

    expect(error).not.toBeNull();
  });

  test("TODO -> DONE is rejected", async () => {
    const project = await setupProject();
    const { data: task } = await createTaskAs(owner, project.id, "Bad Jump");

    const { error } = await updateStatus(owner, task.id, "DONE");

    expect(error).not.toBeNull();
  });

  test("IN_PROGRESS -> UNDER_REVIEW is allowed", async () => {
    const project = await setupProject();
    const { data: task } = await createTaskAs(owner, project.id, "Flow");

    await updateStatus(owner, task.id, "IN_PROGRESS");
    const { data, error } = await updateStatus(
      owner,
      task.id,
      "UNDER_REVIEW",
    );

    expect(error).toBeNull();
    expect(data.status).toBe("UNDER_REVIEW");
  });

  test("IN_PROGRESS -> DONE is rejected", async () => {
    const project = await setupProject();
    const { data: task } = await createTaskAs(owner, project.id, "Bad Jump");

    await updateStatus(owner, task.id, "IN_PROGRESS");
    const { error } = await updateStatus(owner, task.id, "DONE");

    expect(error).not.toBeNull();
  });

  test("UNDER_REVIEW -> DONE is allowed", async () => {
    const project = await setupProject();
    const { data: task } = await createTaskAs(owner, project.id, "Approve");

    await updateStatus(owner, task.id, "IN_PROGRESS");
    await updateStatus(owner, task.id, "UNDER_REVIEW");
    const { data, error } = await updateStatus(owner, task.id, "DONE");

    expect(error).toBeNull();
    expect(data.status).toBe("DONE");
  });

  test("UNDER_REVIEW -> IN_PROGRESS is allowed (reject/retry)", async () => {
    const project = await setupProject();
    const { data: task } = await createTaskAs(owner, project.id, "Reject");

    await updateStatus(owner, task.id, "IN_PROGRESS");
    await updateStatus(owner, task.id, "UNDER_REVIEW");
    const { data, error } = await updateStatus(
      owner,
      task.id,
      "IN_PROGRESS",
    );

    expect(error).toBeNull();
    expect(data.status).toBe("IN_PROGRESS");
  });

  test("DONE -> IN_PROGRESS is rejected (terminal)", async () => {
    const project = await setupProject();
    const { data: task } = await createTaskAs(owner, project.id, "Terminal");

    await updateStatus(owner, task.id, "IN_PROGRESS");
    await updateStatus(owner, task.id, "UNDER_REVIEW");
    await updateStatus(owner, task.id, "DONE");
    const { error } = await updateStatus(owner, task.id, "IN_PROGRESS");

    expect(error).not.toBeNull();
  });

  test("DONE -> UNDER_REVIEW is rejected (terminal)", async () => {
    const project = await setupProject();
    const { data: task } = await createTaskAs(owner, project.id, "Terminal");

    await updateStatus(owner, task.id, "IN_PROGRESS");
    await updateStatus(owner, task.id, "UNDER_REVIEW");
    await updateStatus(owner, task.id, "DONE");
    const { error } = await updateStatus(owner, task.id, "UNDER_REVIEW");

    expect(error).not.toBeNull();
  });

  test("same status update is a no-op (no error)", async () => {
    const project = await setupProject();
    const { data: task } = await createTaskAs(owner, project.id, "Noop");

    const { data, error } = await updateStatus(owner, task.id, "TODO");

    expect(error).toBeNull();
    expect(data.status).toBe("TODO");
  });
});
