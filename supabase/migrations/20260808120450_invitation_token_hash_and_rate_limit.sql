create or replace function void_project_invitation(
  p_invitation_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_invitation project_invitations;
begin
  if auth.uid() is null then
    return false;
  end if;

  select * into v_invitation
  from project_invitations
  where id = p_invitation_id;

  if not found then
    return false;
  end if;

  if v_invitation.invited_by <> auth.uid()
     and not has_permission(v_invitation.project_id, 'invite:members') then
    return false;
  end if;

  delete from project_invitations
  where id = p_invitation_id;

  return true;
end;
$$;

revoke all on function void_project_invitation(uuid) from public;
grant execute on function void_project_invitation(uuid) to authenticated, service_role;
