-- ============================================================
-- Add role_tag column to project_members
-- ============================================================
alter table project_members
  add column role_tag text default null;


-- ============================================================
-- SECURITY DEFINER function: update_member_info
-- Only OWNER or members with update:members permission can edit.
-- ============================================================
create or replace function update_member_info(
  p_project_id uuid,
  p_user_id    uuid,
  p_role_tag   text
)
returns void
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  if not has_permission(p_project_id, 'update:members') then
    raise exception 'insufficient_permissions';
  end if;

  update project_members
     set role_tag = p_role_tag
   where project_id = p_project_id
     and user_id    = p_user_id;
end;
$$;

revoke all on function update_member_info(uuid, uuid, text) from public;
grant execute on function update_member_info(uuid, uuid, text) to authenticated, service_role;
