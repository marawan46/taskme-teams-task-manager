-- Triggers & functions.

-- Assign a per-project sequence number and a within-status board position
-- to each new task.
create or replace function public.set_task_defaults()
returns trigger language plpgsql as $$
begin
  if new.seq is null or new.seq = 0 then
    select coalesce(max(seq), 0) + 1 into new.seq
    from public.tasks where project_id = new.project_id;
  end if;
  if new.position is null or new.position = 0 then
    select coalesce(max(position), 0) + 1000 into new.position
    from public.tasks where project_id = new.project_id and status = new.status;
  end if;
  return new;
end;
$$;

create trigger tasks_set_defaults
  before insert on public.tasks
  for each row execute function public.set_task_defaults();

-- Touch updated_at on every task update.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- On signup: create the profile, a personal workspace, and a seeded starter
-- project so the app is never empty on first login.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _team_id uuid;
  _project_id uuid;
  _name text;
begin
  _name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    _name,
    new.raw_user_meta_data ->> 'avatar_url'
  );

  insert into public.teams (name, slug, owner_id, is_personal)
  values (_name || '''s Workspace', 'ws-' || substr(new.id::text, 1, 8), new.id, true)
  returning id into _team_id;

  insert into public.team_members (team_id, user_id, role)
  values (_team_id, new.id, 'owner');

  insert into public.projects (team_id, name, key, color, description)
  values (
    _team_id,
    'Getting Started',
    'TSK',
    '#6366f1',
    'Your first project — a few sample tasks to explore TaskMe.'
  )
  returning id into _project_id;

  insert into public.labels (team_id, name, color) values
    (_team_id, 'Design', '#8b5cf6'),
    (_team_id, 'Bug', '#ef4444'),
    (_team_id, 'Feature', '#22c55e');

  insert into public.tasks
    (project_id, title, description, status, priority, due_date, assignee_id, created_by)
  values
    (_project_id, 'Welcome to TaskMe 👋',
      'Open a task to see its details. Drag cards between columns on the board.',
      'todo', 'medium', current_date + 2, new.id, new.id),
    (_project_id, 'Set up your first real project', null,
      'todo', 'high', current_date + 5, new.id, new.id),
    (_project_id, 'Invite a teammate',
      'Head to Settings to add members to your workspace.',
      'backlog', 'low', null, null, new.id),
    (_project_id, 'Try the board, list and calendar views', null,
      'in_progress', 'medium', current_date, new.id, new.id),
    (_project_id, 'Explore priorities and labels', null,
      'in_review', 'urgent', current_date - 1, new.id, new.id),
    (_project_id, 'Mark this task as done', null,
      'done', 'medium', current_date - 3, new.id, new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
