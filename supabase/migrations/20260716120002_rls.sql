-- Row Level Security for TaskMe.
--
-- Rule: a user may read/write rows belonging to a team they are a member of.
-- Membership checks use SECURITY DEFINER helpers so policies never recurse
-- through the table they protect.

create or replace function public.is_team_member(_team_id uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.team_members
    where team_id = _team_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_team_admin(_team_id uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.team_members
    where team_id = _team_id and user_id = auth.uid() and role in ('owner', 'admin')
  );
$$;

create or replace function public.is_project_member(_project_id uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.projects p
    join public.team_members m on m.team_id = p.team_id
    where p.id = _project_id and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_task_member(_task_id uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.tasks t
    join public.projects p on p.id = t.project_id
    join public.team_members m on m.team_id = p.team_id
    where t.id = _task_id and m.user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.projects enable row level security;
alter table public.labels enable row level security;
alter table public.tasks enable row level security;
alter table public.task_labels enable row level security;
alter table public.comments enable row level security;

-- profiles: any signed-in user can read (needed to render assignees); update own.
create policy "profiles readable" on public.profiles
  for select to authenticated using (true);
create policy "profiles update own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- teams
create policy "teams select members" on public.teams
  for select to authenticated using (public.is_team_member(id));
create policy "teams insert own" on public.teams
  for insert to authenticated with check (owner_id = auth.uid());
create policy "teams update owner" on public.teams
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "teams delete owner" on public.teams
  for delete to authenticated using (owner_id = auth.uid());

-- team_members
create policy "members select same team" on public.team_members
  for select to authenticated using (public.is_team_member(team_id));
create policy "members insert admin" on public.team_members
  for insert to authenticated with check (public.is_team_admin(team_id));
create policy "members update admin" on public.team_members
  for update to authenticated using (public.is_team_admin(team_id));
create policy "members delete admin or self" on public.team_members
  for delete to authenticated using (public.is_team_admin(team_id) or user_id = auth.uid());

-- projects
create policy "projects select members" on public.projects
  for select to authenticated using (public.is_team_member(team_id));
create policy "projects insert members" on public.projects
  for insert to authenticated with check (public.is_team_member(team_id));
create policy "projects update members" on public.projects
  for update to authenticated using (public.is_team_member(team_id));
create policy "projects delete admin" on public.projects
  for delete to authenticated using (public.is_team_admin(team_id));

-- labels
create policy "labels select members" on public.labels
  for select to authenticated using (public.is_team_member(team_id));
create policy "labels write members" on public.labels
  for all to authenticated
  using (public.is_team_member(team_id)) with check (public.is_team_member(team_id));

-- tasks
create policy "tasks select members" on public.tasks
  for select to authenticated using (public.is_project_member(project_id));
create policy "tasks insert members" on public.tasks
  for insert to authenticated
  with check (public.is_project_member(project_id) and created_by = auth.uid());
create policy "tasks update members" on public.tasks
  for update to authenticated using (public.is_project_member(project_id));
create policy "tasks delete members" on public.tasks
  for delete to authenticated using (public.is_project_member(project_id));

-- task_labels
create policy "task_labels select" on public.task_labels
  for select to authenticated using (public.is_task_member(task_id));
create policy "task_labels write" on public.task_labels
  for all to authenticated
  using (public.is_task_member(task_id)) with check (public.is_task_member(task_id));

-- comments
create policy "comments select" on public.comments
  for select to authenticated using (public.is_task_member(task_id));
create policy "comments insert own" on public.comments
  for insert to authenticated
  with check (public.is_task_member(task_id) and author_id = auth.uid());
create policy "comments delete own" on public.comments
  for delete to authenticated using (author_id = auth.uid());
