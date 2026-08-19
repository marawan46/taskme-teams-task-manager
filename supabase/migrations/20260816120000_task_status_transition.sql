CREATE OR REPLACE FUNCTION public.update_task_status(
  p_task_id uuid,
  p_status public.task_status
)
RETURNS public.tasks
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_task public.tasks;
BEGIN

  UPDATE public.tasks
  SET
    status = p_status,
    updated_at = now()
  WHERE
    id = p_task_id
    AND (assigned_to = auth.uid() OR has_permission(project_id, 'update:tasks'))
  RETURNING * INTO updated_task;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'You are not assigned to this task';
  END IF;

  RETURN updated_task;
END;
$$;


REVOKE ALL ON FUNCTION public.update_task_status(uuid, public.task_status)
FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.update_task_status(uuid, public.task_status)
TO authenticated;