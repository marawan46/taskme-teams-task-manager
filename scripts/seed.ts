import {
  createAuthenticatedUser,
  createProjectAs,
  addMemberToProject,
  createMilestoneAs,
  type AuthenticatedUser,
} from "../tests/utils/helpers";

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function createMyTaskGroup(user: AuthenticatedUser, name: string) {
  const { data, error } = await user.client
    .from("my_task_groups")
    .insert({ name, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  console.log(`    Created private task group: ${name}`);
  return data!;
}

async function createMyTask(
  user: AuthenticatedUser,
  groupId: string,
  name: string,
  overrides: Record<string, unknown> = {},
) {
  const { data, error } = await user.client
    .from("my_tasks")
    .insert({
      name,
      user_id: user.id,
      group_id: groupId,
      due_date: daysFromNow(14).toISOString(),
      ...overrides,
    })
    .select()
    .single();

  if (error) throw error;
  console.log(`      Created private task: ${name}`);
  return data!;
}

async function createSubtask(
  user: AuthenticatedUser,
  projectId: string,
  milestoneId: string,
  parentTaskId: string,
  title: string,
  overrides: Record<string, unknown> = {},
) {
  const { data, error } = await user.client
    .from("tasks")
    .insert({
      project_id: projectId,
      created_by: user.id,
      assigned_to: user.id,
      parent_milestone_id: milestoneId,
      parent_task_id: parentTaskId,
      title,
      status: "TODO",
      priority: 0,
      due_date: daysFromNow(7).toISOString(),
      ...overrides,
    })
    .select()
    .single();

  if (error) throw error;
  console.log(`        Subtask: ${title}`);
  return data!;
}

async function insertTask(
  user: AuthenticatedUser,
  projectId: string,
  milestoneId: string,
  title: string,
  overrides: Record<string, unknown> = {},
) {
  const { data, error } = await user.client
    .from("tasks")
    .insert({
      project_id: projectId,
      created_by: user.id,
      assigned_to: user.id,
      parent_milestone_id: milestoneId,
      title,
      status: "TODO",
      priority: 0,
      due_date: daysFromNow(14).toISOString(),
      ...overrides,
    })
    .select()
    .single();

  if (error) throw error;
  console.log(`    Task: ${title}`);
  return data!;
}

async function main() {
  console.log("Seeding database for Marawan Walied...\n");

  // --- Users ---
  console.log("Creating users...");
  const marawan = await createAuthenticatedUser(
    "marawan@example.com",
    "password123",
    "Marawan Walied",
  );
  const owner = await createAuthenticatedUser(
    "owner@example.com",
    "password123",
    "Alice Owner",
  );

  // --- Project 1: Marawan is OWNER (created by him) ---
  console.log("\nCreating project: Website Redesign (Marawan as owner)...");
  const { data: project1 } = await createProjectAs(marawan, "Website Redesign");
  if (!project1) throw new Error("Failed to create project 1");

  const { data: milestone1 } = await createMilestoneAs(marawan, project1.id, "Design Phase");
  if (!milestone1) throw new Error("Failed to create milestone 1");

  console.log("  Creating tasks...");
  const task1 = await insertTask(marawan, project1.id, milestone1.id, "Create wireframes", {
    description: "Design wireframes for all pages",
    status: "TODO",
    priority: 2,
  });

  await createSubtask(marawan, project1.id, milestone1.id, task1.id, "Homepage wireframe");
  await createSubtask(marawan, project1.id, milestone1.id, task1.id, "Dashboard wireframe");

  const task2 = await insertTask(marawan, project1.id, milestone1.id, "Design system tokens", {
    status: "IN_PROGRESS",
    priority: 3,
  });

  await createSubtask(marawan, project1.id, milestone1.id, task2.id, "Define color palette");

  // --- Project 2: Marawan is COLLABORATOR (created by owner) ---
  console.log("\nCreating project: Mobile App MVP (owner creates, Marawan joins)...");
  const { data: project2 } = await createProjectAs(owner, "Mobile App MVP");
  if (!project2) throw new Error("Failed to create project 2");

  await addMemberToProject(project2.id, marawan.id, "COLLABORATOR");
  console.log("  Added Marawan as COLLABORATOR");

  const { data: milestone2 } = await createMilestoneAs(owner, project2.id, "Planning");
  if (!milestone2) throw new Error("Failed to create milestone 2");

  console.log("  Creating tasks...");
  const task3 = await insertTask(owner, project2.id, milestone2.id, "Define feature list", {
    assigned_to: marawan.id,
    status: "TODO",
    priority: 3,
  });

  await createSubtask(owner, project2.id, milestone2.id, task3.id, "Research competitor apps");
  await createSubtask(owner, project2.id, milestone2.id, task3.id, "Write PRD document");

  // --- Project 3: Marawan is MANAGER ---
  console.log("\nCreating project: API Integration (owner creates, Marawan as manager)...");
  const { data: project3 } = await createProjectAs(owner, "API Integration");
  if (!project3) throw new Error("Failed to create project 3");

  await addMemberToProject(project3.id, marawan.id, "MANAGER");
  console.log("  Added Marawan as MANAGER");

  const { data: milestone3 } = await createMilestoneAs(owner, project3.id, "Backend Setup");
  if (!milestone3) throw new Error("Failed to create milestone 3");

  console.log("  Creating tasks...");
  const task4 = await insertTask(marawan, project3.id, milestone3.id, "Set up REST endpoints", {
    status: "UNDER_REVIEW",
    priority: 2,
  });

  await createSubtask(marawan, project3.id, milestone3.id, task4.id, "Auth endpoints");
  await createSubtask(marawan, project3.id, milestone3.id, task4.id, "CRUD endpoints");

  // --- Private Tasks for Marawan ---
  console.log("\nCreating private tasks for Marawan...");
  const personalGroup = await createMyTaskGroup(marawan, "Personal");
  const workGroup = await createMyTaskGroup(marawan, "Work");

  console.log("  Creating private tasks...");
  await createMyTask(marawan, personalGroup.id, "Buy groceries", {
    priority: 1,
    description: "Milk, eggs, bread, coffee",
  });
  await createMyTask(marawan, personalGroup.id, "Gym session", {
    priority: 0,
  });
  await createMyTask(marawan, personalGroup.id, "Read documentation", {
    priority: 2,
    description: "Finish reading the Supabase RLS docs",
  });

  await createMyTask(marawan, workGroup.id, "Review PR #42", {
    priority: 2,
    due_date: daysFromNow(2).toISOString(),
  });
  await createMyTask(marawan, workGroup.id, "Update deployment docs", {
    priority: 1,
  });

  console.log("\n--- Seed complete ---");
  console.log("  Users: Marawan Walied (marawan@example.com), Alice Owner (owner@example.com)");
  console.log("  Projects: 3 (Website Redesign [owner], Mobile App MVP [collaborator], API Integration [manager])");
  console.log("  Project tasks: 4 (with 7 subtasks)");
  console.log("  Private tasks: 5 (across 2 groups)");
  console.log("  Password for all users: password123");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
