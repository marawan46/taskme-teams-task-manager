create or replace function prevent_invitation_for_existing_member()
returns trigger
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_user_id uuid;
begin
  select id into v_user_id
  from profiles
  where lower(email) = lower(new.email);

  if v_user_id is not null then
    if exists (
      select 1
      from project_members
      where project_id = new.project_id
        and user_id = v_user_id
    ) then
      raise exception 'email_already_member';
    end if;
  end if;

  return new;
end;
$$;

create trigger check_not_existing_member
before insert on project_invitations
for each row execute function prevent_invitation_for_existing_member();
