-- ============================================================
-- Table: my_tasks
-- ============================================================

create table my_tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  name        text not null,
  description text default null,
  content     text default null,
  priority    smallint not null default 0 check (priority between 0 and 2),
  due_date    timestamptz not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- Row Level Security — my_tasks
-- ============================================================

alter table my_tasks enable row level security;

create policy my_tasks_select_own
on my_tasks for select
to authenticated
using ( auth.uid() = user_id );

create policy my_tasks_insert_own
on my_tasks for insert
to authenticated
with check ( auth.uid() = user_id );

create policy my_tasks_update_own
on my_tasks for update
to authenticated
using ( auth.uid() = user_id )
with check ( auth.uid() = user_id );

create policy my_tasks_delete_own
on my_tasks for delete
to authenticated
using ( auth.uid() = user_id );

-- ============================================================
-- Table grants
-- ============================================================

revoke all on table my_tasks from public;
grant select, insert, update, delete on table my_tasks to authenticated;
grant select, insert, update, delete on table my_tasks to service_role;
