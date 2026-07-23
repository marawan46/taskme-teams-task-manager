-- ============================================================
-- Types
-- ============================================================

create type task_status as enum ('TODO', 'IN_PROGRESS', 'UNDER_REVIEW', 'DONE');

-- ============================================================
-- Table: tasks
-- ============================================================

create table tasks (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references projects(id) on delete cascade,
  parent_task_id  uuid references tasks(id) on delete set null,
  parent_milestone_id    uuid references milestones(id) on delete cascade,
  assigned_to     uuid not null references auth.users(id),
  created_by      uuid not null references auth.users(id),
  title           text not null,
  priority        smallint not null default 0 check (priority >= 0 and priority <= 3),
  description     text default null,
  status          task_status not null default 'TODO',
  due_date        timestamptz default null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ============================================================
-- State machine: valid status transitions
--   TODO         -> IN_PROGRESS
--   IN_PROGRESS  -> UNDER_REVIEW
--   UNDER_REVIEW -> DONE          (approve)
--   UNDER_REVIEW -> IN_PROGRESS   (reject → redo)
-- ============================================================

create or replace function enforce_task_status_transition()
returns trigger
language plpgsql
as $$
begin
  if old.status = new.status then
    return new;
  end if;

  case old.status
    when 'TODO' then
      if new.status <> 'IN_PROGRESS' then
        raise exception 'TODO can only transition to IN_PROGRESS, got %', new.status;
      end if;
    when 'IN_PROGRESS' then
      if new.status <> 'UNDER_REVIEW' then
        raise exception 'IN_PROGRESS can only transition to UNDER_REVIEW, got %', new.status;
      end if;
    when 'UNDER_REVIEW' then
      if new.status not in ('DONE', 'IN_PROGRESS') then
        raise exception 'UNDER_REVIEW can only transition to DONE or IN_PROGRESS, got %', new.status;
      end if;
    when 'DONE' then
      raise exception 'DONE is a terminal status — no transitions allowed';
    else
      raise exception 'unexpected status %', old.status;
  end case;

  return new;
end;
$$;

create trigger on_task_status_change
before update of status on tasks
for each row execute function enforce_task_status_transition();

-- ============================================================
-- Table: milestones
-- ============================================================

create table milestones (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  created_by  uuid not null references auth.users(id),
  title       text not null,
  description text default null,
  due_date    timestamptz default null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- Row Level Security — tasks
-- ============================================================

alter table tasks enable row level security;

create policy tasks_select_members
on tasks for select
to authenticated
using ( get_project_role(project_id) is not null );

create policy tasks_insert_permitted
on tasks for insert
to authenticated
with check ( has_permission(project_id, 'add:tasks') );

create policy tasks_update_permitted
on tasks for update
to authenticated
using ( has_permission(project_id, 'update:tasks') )
with check ( has_permission(project_id, 'update:tasks') );

create policy tasks_delete_permitted
on tasks for delete
to authenticated
using ( has_permission(project_id, 'delete:tasks') );

-- ============================================================
-- Row Level Security — milestones
-- ============================================================

alter table milestones enable row level security;

create policy milestones_select_members
on milestones for select
to authenticated
using ( get_project_role(project_id) is not null );

create policy milestones_insert_permitted
on milestones for insert
to authenticated
with check ( has_permission(project_id, 'add:milestones') );

create policy milestones_update_permitted
on milestones for update
to authenticated
using ( has_permission(project_id, 'update:milestones') )
with check ( has_permission(project_id, 'update:milestones') );

create policy milestones_delete_permitted
on milestones for delete
to authenticated
using ( has_permission(project_id, 'delete:milestones') );

-- ============================================================
-- Table grants
-- ============================================================

revoke all on table tasks from public;
grant select, insert, update, delete on table tasks to authenticated;
grant select, insert, update, delete on table tasks to service_role;

revoke all on table milestones from public;
grant select, insert, update, delete on table milestones to authenticated;
grant select, insert, update, delete on table milestones to service_role;
