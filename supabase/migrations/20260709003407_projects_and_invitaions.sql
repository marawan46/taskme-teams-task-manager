-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists pgcrypto;
create extension if not exists pg_cron;

-- ============================================================
-- Types
-- ============================================================
create type project_role as enum ('OWNER', 'MANAGER', 'COLLABORATOR');
create type invitation_status as enum ('PENDING', 'ACCEPTED', 'EXPIRED');
create type project_permission as enum (
  'update:project',
  'delete:project',

  'invite:members',
  'remove:members',

  'read:milestones',
  'add:milestones',
  'update:milestones',
  'delete:milestones',

  'read:tasks',
  'add:tasks',
  'update:tasks',
  'delete:tasks',
  'approve:tasks'
);

-- ============================================================
-- Tables (order matters — every FK target must already exist)
-- ============================================================

create table projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text default null,
  created_by  uuid not null references auth.users(id),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
  constraint projects_name_not_empty check (char_length(name) > 0)
);

create table project_members (
  project_id uuid not null references projects(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       project_role not null default 'COLLABORATOR',
  joined_at  timestamptz default now(),
  primary key (project_id, user_id)
);

create table project_member_permissions (
  project_id  uuid not null,
  user_id     uuid not null,
  permission  project_permission not null,
  granted_by  uuid not null references auth.users(id),
  granted_at  timestamptz default now(),
  primary key (project_id, user_id, permission),
  foreign key (project_id, user_id) references project_members(project_id, user_id) on delete cascade
);

create table project_invitations (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  email       text not null,
  role        project_role not null default 'COLLABORATOR',
  invited_by  uuid not null references auth.users(id),
  token       uuid not null default gen_random_uuid(),
  status      invitation_status not null default 'PENDING',
  expires_at  timestamptz not null default (now() + interval '7 days'),
  created_at  timestamptz default now(),
  accepted_at timestamptz,

  constraint project_invitations_email_is_lowercase check (email = lower(email)),
  constraint project_invitations_role_not_owner check (role <> 'OWNER')
);

-- one PENDING invite per email per project — NOT a blanket unique constraint,
-- otherwise a re-invite after expiry/acceptance would be permanently blocked
create unique index project_invitations_pending_email_idx
  on project_invitations (project_id, lower(email))
  where status = 'PENDING';

create unique index project_invitations_token_idx
  on project_invitations (token);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table projects enable row level security;
alter table project_members enable row level security;
alter table project_member_permissions enable row level security;
alter table project_invitations enable row level security;

revoke all on table projects from anon, authenticated, service_role;
revoke all on table project_members from anon, authenticated, service_role;
revoke all on table project_member_permissions from anon, authenticated, service_role;
revoke all on table project_invitations from anon, authenticated, service_role;

-- ============================================================
-- Helper functions
-- SECURITY DEFINER + owned by the migration role (table owner) means
-- queries inside these functions bypass RLS entirely — this is what
-- breaks the recursion, since policies below call these functions
-- instead of querying project_members/project_member_permissions directly.
-- ============================================================

create or replace function get_project_role(p_project_id uuid)
returns project_role
language sql
security definer
stable
set search_path = public, auth, extensions
as $$
  select role
  from project_members
  where project_id = p_project_id
    and user_id = auth.uid();
$$;

create or replace function has_permission(
  p_project_id uuid,
  p_permission project_permission
)
returns boolean
language sql
security definer
stable
set search_path = public, auth, extensions
as $$
  select coalesce(get_project_role(p_project_id) = 'OWNER', false)
    or exists (
      select 1
      from project_member_permissions
      where project_id = p_project_id
        and user_id = auth.uid()
        and permission = p_permission
    );
$$;

create or replace function verified_email_for_current_user()
returns text
language sql
security definer
stable
set search_path = public, auth, extensions
as $$
  select lower(u.email)
  from auth.users u
  where u.id = auth.uid()
    and u.email_confirmed_at is not null
    and u.email is not null;
$$;

revoke all on function get_project_role(uuid) from public;
revoke all on function has_permission(uuid, project_permission) from public;
revoke all on function verified_email_for_current_user() from public;

grant execute on function get_project_role(uuid) to authenticated, service_role;
grant execute on function has_permission(uuid, project_permission) to authenticated, service_role;
grant execute on function verified_email_for_current_user() to authenticated, service_role;

-- ============================================================
-- Policies — projects
-- ============================================================

create policy projects_select_members
on projects for select
to authenticated
using (created_by = auth.uid() or get_project_role(id) is not null );

create policy projects_insert_self
on projects for insert
to authenticated
with check ( (select auth.uid()) = created_by );

create policy projects_update_permitted
on projects for update
to authenticated
using ( has_permission(id, 'update:project') )
with check ( has_permission(id, 'update:project') );

create policy projects_delete_permitted
on projects for delete
to authenticated
using ( get_project_role(id) is not null and has_permission(id, 'delete:project') );


-- ============================================================
-- Policies — project_members
-- ============================================================

create policy project_members_select_fellow_members
on project_members for select
to authenticated
using ( get_project_role(project_id) is not null );

-- No insert/update/delete policies. Membership rows are only ever
-- written by add_owner_on_project_create() and accept_project_invitation(),
-- both SECURITY DEFINER. Role changes / removals ('remove:members') have
-- no function yet — add one (SECURITY DEFINER, permission-checked) rather
-- than opening a client-facing UPDATE/DELETE policy.

-- ============================================================
-- Policies — project_member_permissions
-- ============================================================

create policy project_member_permissions_select_self_or_owner
on project_member_permissions for select
to authenticated
using (
  user_id = auth.uid()
  or get_project_role(project_id) = 'OWNER'
);

-- No write policies — rows are only written by apply_default_permissions()
-- (SECURITY DEFINER). Per-manager permission overrides need their own
-- SECURITY DEFINER function (owner-only) when you build that UI.

-- ============================================================
-- Policies — project_invitations
-- ============================================================

create policy project_invitations_select_relevant
on project_invitations for select
to authenticated
using (
  invited_by = auth.uid()
  or has_permission(project_id, 'invite:members')
  or coalesce(verified_email_for_current_user(), '') = email
);

-- Creation is plain app-logic + RLS (a single insert with no multi-step
-- state to coordinate), enforced here rather than in a function:
--   - invited_by must be the caller themselves, never a client-supplied id
--   - the caller must actually hold invite:members on the project
-- Row-level defaults/constraints still apply regardless of this policy:
-- email must be lowercase, role can't be OWNER, and only one PENDING
-- invite per (project, email) is allowed (see the partial unique index).
-- The app is still responsible for checking "already an active member"
-- before inserting — there's no DB constraint for that case.
create policy project_invitations_insert_permitted
on project_invitations for insert
to authenticated
with check (
  invited_by = auth.uid()
  and has_permission(project_id, 'invite:members')
);

-- No update/delete policies — acceptance (the only write after creation)
-- goes through accept_project_invitation() below, since it's a multi-step,
-- atomic state transition that a row-level policy can't express.

-- ============================================================
-- Table grants (base privileges — RLS above still applies to authenticated)
-- ============================================================

grant select, insert, update on table projects to authenticated;
grant select on table project_members to authenticated;
grant select on table project_member_permissions to authenticated;
grant select, insert on table project_invitations to authenticated;

grant select, insert, update, delete on table projects to service_role,authenticated;
grant select, insert, update, delete on table project_members to service_role;
grant select, insert, update, delete on table project_member_permissions to service_role;
grant select, insert, update, delete on table project_invitations to service_role;

-- ============================================================
-- Triggers
-- ============================================================

create or replace function apply_default_permissions()
returns trigger
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  -- role changed (not a fresh insert): clear the old bundle first so a
  -- downgrade (e.g. MANAGER -> COLLABORATOR) doesn't leave stale grants
  if tg_op = 'UPDATE' then
    if old.role is distinct from new.role then
      delete from project_member_permissions
      where project_id = new.project_id
        and user_id = new.user_id;
    end if;
  end if;

  if new.role = 'MANAGER' then
    insert into project_member_permissions (project_id, user_id, permission, granted_by)
    select new.project_id, new.user_id, perm, new.user_id
    from unnest(array[
      'invite:members',
      'read:milestones', 'add:milestones', 'update:milestones', 'delete:milestones',
      'read:tasks', 'add:tasks', 'update:tasks', 'delete:tasks', 'approve:tasks'
    ]::project_permission[]) as perm
    on conflict do nothing;
  elsif new.role = 'OWNER' then
    insert into project_member_permissions (project_id, user_id, permission, granted_by)
    select new.project_id, new.user_id, perm, new.user_id
    from unnest(enum_range(null::project_permission)) as perm
    on conflict do nothing;
  end if;

  return new;
end;
$$;

create trigger on_member_role_set
after insert or update of role on project_members
for each row execute function apply_default_permissions();

create or replace function add_owner_on_project_create()
returns trigger
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  insert into project_members (project_id, user_id, role)
  values (new.id, new.created_by, 'OWNER');
  return new;
end;
$$;

create trigger on_project_created
after insert on projects
for each row execute function add_owner_on_project_create();

-- ============================================================
-- Invitation flow functions
-- ============================================================

create or replace function accept_project_invitation(
  p_token uuid
)
returns table (
  ok boolean,
  code text,
  message text,
  invitation project_invitations
)
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_invitation project_invitations;
  v_current_email text;
begin
  if auth.uid() is null then
    return query select false, 'not_authenticated', 'authentication required', null::project_invitations;
    return;
  end if;

  v_current_email := verified_email_for_current_user();
  if v_current_email is null then
    return query select false, 'email_verification_required', 'verified email is required', null::project_invitations;
    return;
  end if;

  select * into v_invitation
  from project_invitations
  where token = p_token
    and status = 'PENDING'
  for update;

  if not found then
    return query select false, 'not_found_or_used', 'invitation not found or already used', null::project_invitations;
    return;
  end if;

  if v_invitation.expires_at <= now() then
    update project_invitations
      set status = 'EXPIRED'
    where id = v_invitation.id
    returning * into v_invitation;

    return query select false, 'expired', 'invitation expired', v_invitation;
    return;
  end if;

  if v_current_email <> v_invitation.email then
    return query select false, 'wrong_account', 'invitation was sent to a different verified email', null::project_invitations;
    return;
  end if;

  insert into project_members (project_id, user_id, role)
  values (v_invitation.project_id, auth.uid(), v_invitation.role);

  update project_invitations
    set status = 'ACCEPTED',
        accepted_at = now()
  where id = v_invitation.id
  returning * into v_invitation;

  return query select true, null, null, v_invitation;
  return;
exception
  when unique_violation then
    return query select false, 'already_member', 'project member already exists', v_invitation;
    return;
end;
$$;

create or replace function sweep_expired_project_invitations()
returns integer
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_rows integer;
begin
  update project_invitations
    set status = 'EXPIRED'
  where status = 'PENDING'
    and expires_at <= now();

  get diagnostics v_rows = row_count;
  return v_rows;
end;
$$;

do $$
begin
  if not exists (
    select 1 from cron.job where jobname = 'sweep-expired-project-invitations'
  ) then
    perform cron.schedule(
      'sweep-expired-project-invitations',
      '0 * * * *',
      $cron$select public.sweep_expired_project_invitations();$cron$
    );
  end if;
exception
  when undefined_table or undefined_function then
    null;
end;
$$;

revoke all on function accept_project_invitation(uuid) from public;
revoke all on function sweep_expired_project_invitations() from public;

grant execute on function accept_project_invitation(uuid) to authenticated, service_role;
grant execute on function sweep_expired_project_invitations() to service_role;