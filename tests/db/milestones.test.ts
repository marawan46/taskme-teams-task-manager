import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeEach, describe, expect, test } from "vitest";
import dotenv from "dotenv";
import {
     addMemberToProject,
     createAuthenticatedUser,
     createProjectAs,
     createMilestoneAs,
     getMilestonesAs,
     type AuthenticatedUser,
} from "../utils/helpers";

dotenv.config({ path: ".env.local" });

let owner: AuthenticatedUser;
let manager: AuthenticatedUser;
let collaborator: AuthenticatedUser;
let outsider: AuthenticatedUser;
let admin: SupabaseClient;

// afterAll(async () => {
//      await clearTestData();
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



// ============================================================
// SELECT
// ============================================================

describe("milestones — SELECT", () => {
     test("owner can read milestones", async () => {
          const project = await setupProject({
               manager: true,
               collaborator: true,
          });
          await createMilestoneAs(owner, project.id, "M1");

          const { data, error } = await getMilestonesAs(owner, project.id);

          expect(error).toBeNull();
          expect(data).toHaveLength(1);
     });

     test("manager can read milestones", async () => {
          const project = await setupProject({ manager: true });
          await createMilestoneAs(owner, project.id, "M1");

          const { data, error } = await getMilestonesAs(manager, project.id);

          expect(error).toBeNull();
          expect(data).toHaveLength(1);
     });

     test("collaborator can read milestones", async () => {
          const project = await setupProject({ collaborator: true });
          await createMilestoneAs(owner, project.id, "M1");

          const { data, error } = await getMilestonesAs(
               collaborator,
               project.id,
          );

          expect(error).toBeNull();
          expect(data).toHaveLength(1);
     });

     test("outsider cannot read milestones", async () => {
          const project = await setupProject();
          await createMilestoneAs(owner, project.id, "M1");

          const { data, error } = await getMilestonesAs(outsider, project.id);

          expect(error).toBeNull();
          expect(data).toHaveLength(0);
     });
});

// ============================================================
// INSERT
// ============================================================

describe("milestones — INSERT", () => {
     test("owner can create a milestone", async () => {
          const project = await setupProject();

          const { data, error } = await createMilestoneAs(
               owner,
               project.id,
               "Launch",
          );

          expect(error).toBeNull();
          expect(data.title).toBe("Launch");
          expect(data.created_by).toBe(owner.id);
     });

     test("manager can create a milestone", async () => {
          const project = await setupProject({ manager: true });

          const { data, error } = await createMilestoneAs(
               manager,
               project.id,
               "Beta",
          );

          expect(error).toBeNull();
          expect(data.title).toBe("Beta");
          expect(data.created_by).toBe(manager.id);
     });

     test("collaborator cannot create a milestone", async () => {
          const project = await setupProject({ collaborator: true });

          const { data, error } = await createMilestoneAs(
               collaborator,
               project.id,
               "Should Fail",
          );

          expect(error).not.toBeNull();
     });

     test("outsider cannot create a milestone", async () => {
          const project = await setupProject();

          const { data, error } = await createMilestoneAs(
               outsider,
               project.id,
               "Should Fail",
          );

          expect(error).not.toBeNull();
     });
});

// ============================================================
// UPDATE
// ============================================================

describe("milestones — UPDATE", () => {
     test("owner can update a milestone", async () => {
          const project = await setupProject();
          const { data: milestone } = await createMilestoneAs(
               owner,
               project.id,
               "Original",
          );

          const { data, error } = await owner.client
               .from("milestones")
               .update({ title: "Updated" })
               .eq("id", milestone.id)
               .select()
               .single();

          expect(error).toBeNull();
          expect(data.title).toBe("Updated");
     });

     test("manager can update a milestone", async () => {
          const project = await setupProject({ manager: true });
          const { data: milestone } = await createMilestoneAs(
               owner,
               project.id,
               "Original",
          );

          const { data, error } = await manager.client
               .from("milestones")
               .update({ title: "Manager Update" })
               .eq("id", milestone.id)
               .select()
               .single();

          expect(error).toBeNull();
          expect(data.title).toBe("Manager Update");
     });

     test("collaborator cannot update a milestone", async () => {
          const project = await setupProject({ collaborator: true });
          const { data: milestone } = await createMilestoneAs(
               owner,
               project.id,
               "Protected",
          );

          const { data, error } = await collaborator.client
               .from("milestones")
               .update({ title: "Should Fail" })
               .eq("id", milestone.id)
               .select()
               .single();

          expect(error).not.toBeNull();
     });

     test("outsider cannot update a milestone", async () => {
          const project = await setupProject();
          const { data: milestone } = await createMilestoneAs(
               owner,
               project.id,
               "Protected",
          );

          const { data, error } = await outsider.client
               .from("milestones")
               .update({ title: "Should Fail" })
               .eq("id", milestone.id)
               .select()
               .single();

          expect(error).not.toBeNull();
     });
});

// ============================================================
// DELETE
// ============================================================

describe("milestones — DELETE", () => {
     test("owner can delete a milestone", async () => {
          const project = await setupProject();
          const { data: milestone } = await createMilestoneAs(
               owner,
               project.id,
               "To Delete",
          );

          const { error } = await owner.client
               .from("milestones")
               .delete()
               .eq("id", milestone.id);

          expect(error).toBeNull();

          const { data } = await getMilestonesAs(owner, project.id);
          expect(data).toHaveLength(0);
     });

     test("manager can delete a milestone", async () => {
          const project = await setupProject({ manager: true });
          const { data: milestone } = await createMilestoneAs(
               owner,
               project.id,
               "To Delete",
          );

          const { error } = await manager.client
               .from("milestones")
               .delete()
               .eq("id", milestone.id);

          expect(error).toBeNull();

          const { data } = await getMilestonesAs(manager, project.id);
          expect(data).toHaveLength(0);
     });

     test("collaborator cannot delete a milestone", async () => {
          const project = await setupProject({ collaborator: true });
          const { data: milestone } = await createMilestoneAs(
               owner,
               project.id,
               "Protected",
          );

          const response = await collaborator.client
               .from("milestones")
               .delete()
               .eq("id", milestone.id);
          expect(response.status).toBe(204);
          const { data } = await getMilestonesAs(owner, project.id);
          expect(data).toHaveLength(1);
     });

     test("outsider cannot delete a milestone", async () => {
          const project = await setupProject();
          const { data: milestone } = await createMilestoneAs(
               owner,
               project.id,
               "Protected",
          );

          const response = await outsider.client
               .from("milestones")
               .delete()
               .eq("id", milestone.id);

          expect(response.status).toBe(204);

          const { data } = await getMilestonesAs(owner, project.id);
          expect(data).toHaveLength(1);
     });
});
