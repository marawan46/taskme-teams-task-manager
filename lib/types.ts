/**
 * Application data types — hand-mirrored to the Supabase schema in
 * supabase/migrations. Row shapes match table columns; the `*With*` types are
 * the joined shapes returned by lib/queries.
 */

export type TaskStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "in_review"
  | "done";

export type Priority = "urgent" | "high" | "medium" | "low";

export type Role = "owner" | "admin" | "member";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  is_personal: boolean;
  created_at: string;
}

export interface TeamMember {
  team_id: string;
  user_id: string;
  role: Role;
  created_at: string;
}

export interface Project {
  id: string;
  team_id: string;
  name: string;
  key: string;
  color: string;
  description: string | null;
  created_at: string;
}

export interface Label {
  id: string;
  team_id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  project_id: string;
  seq: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  assignee_id: string | null;
  created_by: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  author_id: string;
  body: string;
  created_at: string;
}

/* ---- Joined / derived shapes ---- */

export interface TaskWithRelations extends Task {
  project: Pick<Project, "id" | "name" | "key" | "color">;
  assignee: Profile | null;
  labels: Label[];
}

export interface ProjectWithStats extends Project {
  task_count: number;
  done_count: number;
}

export interface MemberWithProfile extends TeamMember {
  profile: Profile;
}

export interface CommentWithAuthor extends Comment {
  author: Profile;
}
