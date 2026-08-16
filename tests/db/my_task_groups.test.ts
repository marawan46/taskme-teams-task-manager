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

async function createGroupAs(
  u: AuthenticatedUser,
  name: string,
  overrides: Record<string, unknown> = {},
) {
  return u.client
    .from("my_task_groups")
    .insert({ name, user_id: u.id, ...overrides })
    .select()
    .single();
}

async function getGroupsAs(u: AuthenticatedUser) {
  return u.client.from("my_task_groups").select("*").eq("user_id", u.id);
}

// ============================================================
// SELECT
// ============================================================

describe("my_task_groups — SELECT", () => {
  test("user can read own groups", async () => {
    await createGroupAs(user, "Groceries");

    const { data, error } = await getGroupsAs(user);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe("Groceries");
  });

  test("user cannot read other user's groups", async () => {
    await createGroupAs(other, "Private Group");

    const { data, error } = await getGroupsAs(user);

    expect(error).toBeNull();
    expect(data).toHaveLength(0);
  });
});

// ============================================================
// INSERT
// ============================================================

describe("my_task_groups — INSERT", () => {
  test("user can create a group", async () => {
    const { data, error } = await createGroupAs(user, "Work");

    expect(error).toBeNull();
    expect(data.name).toBe("Work");
    expect(data.user_id).toBe(user.id);
  });

  test("user_id cannot be spoofed", async () => {
    const { error } = await user.client
      .from("my_task_groups")
      .insert({ name: "Spoofed", user_id: other.id })
      .select()
      .single();

    expect(error).not.toBeNull();
  });
});

// ============================================================
// UPDATE
// ============================================================

describe("my_task_groups — UPDATE", () => {
  test("user can rename own group", async () => {
    const { data: group } = await createGroupAs(user, "Old Name");

    const { data, error } = await user.client
      .from("my_task_groups")
      .update({ name: "New Name" })
      .eq("id", group.id)
      .select()
      .single();

    expect(error).toBeNull();
    expect(data.name).toBe("New Name");
  });

  test("user cannot rename other user's group", async () => {
    const { data: group } = await createGroupAs(other, "Protected");

    const { data, error } = await user.client
      .from("my_task_groups")
      .update({ name: "Hacked" })
      .eq("id", group.id)
      .select()
      .single();

    expect(error).not.toBeNull();
    expect(data).toBeNull();
  });
});

// ============================================================
// DELETE
// ============================================================

describe("my_task_groups — DELETE", () => {
  test("user can delete own group and its tasks cascade", async () => {
    const { data: group } = await createGroupAs(user, "To Delete");

    const { data: task } = await user.client
      .from("my_tasks")
      .insert({
        name: "Inside Group",
        user_id: user.id,
        group_id: group.id,
        due_date: new Date(),
      })
      .select()
      .single();

    expect(task).not.toBeNull();

    const { error } = await user.client
      .from("my_task_groups")
      .delete()
      .eq("id", group.id);

    expect(error).toBeNull();

    const { data: tasks } = await user.client
      .from("my_tasks")
      .select("*")
      .eq("group_id", group.id);

    expect(tasks).toHaveLength(0);
  });

  test("user cannot delete other user's group", async () => {
    const { data: group } = await createGroupAs(other, "Protected");

    const { data, error } = await user.client
      .from("my_task_groups")
      .delete()
      .eq("id", group.id)
      .select();

    expect(error).toBeNull();
    expect(data).toHaveLength(0);

    const { data: remaining } = await getGroupsAs(other);
    expect(remaining).toHaveLength(1);
  });
});
