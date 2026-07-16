-- TaskMe core schema
-- Tables: profiles, teams, team_members, projects, labels, tasks, task_labels, comments

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  is_personal boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.team_members (
  team_id uuid not null references public.teams (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  name text not null,
  key text not null,
  color text not null default '#6366f1',
  description text,
  created_at timestamptz not null default now(),
  unique (team_id, key)
);

create table public.labels (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  name text not null,
  color text not null default '#6366f1'
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  seq integer not null default 0,
  title text not null,
  description text,
  status text not null default 'todo'
    check (status in ('backlog', 'todo', 'in_progress', 'in_review', 'done')),
  priority text not null default 'medium'
    check (priority in ('urgent', 'high', 'medium', 'low')),
  due_date date,
  assignee_id uuid references public.profiles (id) on delete set null,
  created_by uuid not null references public.profiles (id) on delete cascade,
  position double precision not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_labels (
  task_id uuid not null references public.tasks (id) on delete cascade,
  label_id uuid not null references public.labels (id) on delete cascade,
  primary key (task_id, label_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- Indexes on foreign keys / hot filter columns
create index idx_team_members_user on public.team_members (user_id);
create index idx_projects_team on public.projects (team_id);
create index idx_labels_team on public.labels (team_id);
create index idx_tasks_project on public.tasks (project_id);
create index idx_tasks_assignee on public.tasks (assignee_id);
create index idx_tasks_created_by on public.tasks (created_by);
create index idx_tasks_status on public.tasks (project_id, status);
create index idx_task_labels_label on public.task_labels (label_id);
create index idx_comments_task on public.comments (task_id);
create index idx_comments_author on public.comments (author_id);
