import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, test } from "vitest";
import dotenv from "dotenv";
import {
  createAuthenticatedUser,
  type AuthenticatedUser,
} from "../utils/helpers";

dotenv.config({ path: ".env.local" });

let user: AuthenticatedUser;
let other: AuthenticatedUser;
let admin: SupabaseClient;

beforeEach(async () => {
  admin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const testRunId = Date.now() + Math.random().toString(36).slice(2, 9);

  user = await createAuthenticatedUser(
    `user${testRunId}@test.com`,
    "password123",
    "Test User",
  );
  other = await createAuthenticatedUser(
    `other${testRunId}@test.com`,
    "password123",
    "Other User",
  );
});

async function createTaskAs(
  u: AuthenticatedUser,
  name: string,
  overrides: Record<string, unknown> = {},
) {
  return u.client
    .from("my_tasks")
    .insert({ name, user_id: u.id, ...overrides })
    .select()
    .single();
}

async function getTasksAs(u: AuthenticatedUser) {
  return u.client.from("my_tasks").select("*").eq("user_id", u.id);
}

// ============================================================
// SELECT
// ============================================================

describe("my_tasks — SELECT", () => {
  test("user can read own tasks", async () => {
    await createTaskAs(user, "Task 1");

    const { data, error } = await getTasksAs(user);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  test("user cannot read other user's tasks", async () => {
    await createTaskAs(other, "Private Task");

    const { data, error } = await getTasksAs(user);

    expect(error).toBeNull();
    expect(data).toHaveLength(0);
  });
});

// ============================================================
// INSERT
// ============================================================

describe("my_tasks — INSERT", () => {
  test("user can create a task", async () => {
    const { data, error } = await createTaskAs(user, "Buy groceries");

    expect(error).toBeNull();
    expect(data.name).toBe("Buy groceries");
    expect(data.user_id).toBe(user.id);
    expect(data.priority).toBe(0);
  });

  test("user can set priority 0, 1, or 2", async () => {
    for (const p of [0, 1, 2]) {
      const { data, error } = await createTaskAs(user, `P${p}`, {
        priority: p,
      });
      expect(error).toBeNull();
      expect(data.priority).toBe(p);
    }
  });

  test("priority outside 0-2 is rejected", async () => {
    const { error } = await createTaskAs(user, "Bad Priority", {
      priority: 3,
    });
    expect(error).not.toBeNull();
  });

  test("negative priority is rejected", async () => {
    const { error } = await createTaskAs(user, "Negative", {
      priority: -1,
    });
    expect(error).not.toBeNull();
  });

  test("user_id cannot be spoofed", async () => {
    const { error } = await user.client
      .from("my_tasks")
      .insert({ name: "Spoofed", user_id: other.id })
      .select()
      .single();

    expect(error).not.toBeNull();
  });

  test("fields default correctly", async () => {
    const { data, error } = await createTaskAs(user, "Defaults");

    expect(error).toBeNull();
    expect(data.description).toBeNull();
    expect(data.content).toBeNull();
    expect(data.due_date).toBeNull();
  });
});

// ============================================================
// UPDATE
// ============================================================

describe("my_tasks — UPDATE", () => {
  test("user can update own task", async () => {
    const { data: task } = await createTaskAs(user, "Original");

    const { data, error } = await user.client
      .from("my_tasks")
      .update({ name: "Updated", priority: 2 })
      .eq("id", task.id)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data.name).toBe("Updated");
    expect(data.priority).toBe(2);
  });

  test("user cannot update other user's task", async () => {
    const { data: task } = await createTaskAs(other, "Other's Task");

    const { data, error } = await user.client
      .from("my_tasks")
      .update({ name: "Hacked" })
      .eq("id", task.id)
      .select()
      .single();

    expect(error).not.toBeNull();
  });
});

// ============================================================
// DELETE
// ============================================================

describe("my_tasks — DELETE", () => {
  test("user can delete own task", async () => {
    const { data: task } = await createTaskAs(user, "To Delete");

    const { error } = await user.client
      .from("my_tasks")
      .delete()
      .eq("id", task.id);

    expect(error).toBeNull();

    const { data } = await getTasksAs(user);
    expect(data).toHaveLength(0);
  });

  test("user cannot delete other user's task", async () => {
    const { data: task } = await createTaskAs(other, "Protected");

    const response = await user.client
      .from("my_tasks")
      .delete()
      .eq("id", task.id);

    expect(response.status).toBe(204);

    const { data } = await getTasksAs(other);
    expect(data).toHaveLength(1);
  });
});
