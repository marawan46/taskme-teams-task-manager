-- ============================================================
-- Table: my_task_groups
-- ============================================================

create table my_task_groups (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  name        text not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- my_tasks — add group and completed columns
-- ============================================================

alter table my_tasks
  add column group_id  uuid references my_task_groups(id) on delete cascade,
  add column completed boolean not null default false;

-- Backfill existing tasks into a default group per user
insert into my_task_groups (user_id, name)
select distinct user_id, 'General'
from my_tasks
on conflict do nothing;

update my_tasks
set group_id = g.id
from my_task_groups g
where g.user_id = my_tasks.user_id
  and my_tasks.group_id is null;

alter table my_tasks alter column group_id set not null;

-- ============================================================
-- Indexes
-- ============================================================

create index my_task_groups_user_id_idx on my_task_groups (user_id);
create index my_tasks_group_id_idx on my_tasks (group_id);

-- ============================================================
-- Row Level Security — my_task_groups
-- ============================================================

alter table my_task_groups enable row level security;

create policy my_task_groups_select_own
on my_task_groups for select
to authenticated
using ( auth.uid() = user_id );

create policy my_task_groups_insert_own
on my_task_groups for insert
to authenticated
with check ( auth.uid() = user_id );

create policy my_task_groups_update_own
on my_task_groups for update
to authenticated
using ( auth.uid() = user_id )
with check ( auth.uid() = user_id );

create policy my_task_groups_delete_own
on my_task_groups for delete
to authenticated
using ( auth.uid() = user_id );

-- ============================================================
-- Row Level Security — my_tasks (tighten to group ownership)
-- ============================================================

drop policy my_tasks_insert_own on my_tasks;

create policy my_tasks_insert_own
on my_tasks for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1 from my_task_groups g
    where g.id = group_id
      and g.user_id = auth.uid()
  )
);

drop policy my_tasks_update_own on my_tasks;

create policy my_tasks_update_own
on my_tasks for update
to authenticated
using ( auth.uid() = user_id )
with check (
  auth.uid() = user_id
  and exists (
    select 1 from my_task_groups g
    where g.id = group_id
      and g.user_id = auth.uid()
  )
);

-- ============================================================
-- Table grants
-- ============================================================

revoke all on table my_task_groups from public;
grant select, insert, update, delete on table my_task_groups to authenticated;
grant select, insert, update, delete on table my_task_groups to service_role;
