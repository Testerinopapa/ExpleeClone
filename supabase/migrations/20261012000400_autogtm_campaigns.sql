-- Editable campaign plans inherit the researched profile's project and ownership.
alter table public.company_profiles add column campaign_plan jsonb;

create function public.autogtm_save_campaigns(p_job uuid, p_owner uuid, p_version integer, p_plan jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare previous jsonb; saved jsonb;
begin
  select campaign_plan into previous from public.company_profiles
    where job_id = p_job and owner_id = p_owner for update;
  if not found then raise exception 'PROFILE_NOT_FOUND'; end if;
  if coalesce((previous->>'version')::integer, 0) <> p_version then
    return jsonb_build_object('applied', false, 'plan', previous);
  end if;
  if jsonb_typeof(p_plan) is distinct from 'object'
    or p_plan->>'status' is distinct from 'completed'
    or jsonb_typeof(p_plan->'campaigns') is distinct from 'array'
    or jsonb_typeof(p_plan->'selected_ids') is distinct from 'array' then
    raise exception 'INVALID_CAMPAIGN_PLAN';
  end if;
  if jsonb_array_length(p_plan->'campaigns') > 12
    or jsonb_array_length(p_plan->'selected_ids') > 12
    or exists (select 1 from jsonb_array_elements(p_plan->'campaigns') c where coalesce(c->>'id', '') = '')
    or (select count(*) from jsonb_array_elements(p_plan->'campaigns')) <>
       (select count(distinct c->>'id') from jsonb_array_elements(p_plan->'campaigns') c)
    or (select count(*) from jsonb_array_elements_text(p_plan->'selected_ids')) <>
       (select count(distinct id) from jsonb_array_elements_text(p_plan->'selected_ids') id)
    or exists (select 1 from jsonb_array_elements_text(p_plan->'selected_ids') id
      where not exists (select 1 from jsonb_array_elements(p_plan->'campaigns') c where c->>'id' = id)) then
    raise exception 'INVALID_CAMPAIGN_SELECTION';
  end if;
  saved := p_plan || jsonb_build_object('version', p_version + 1,
    'created_at', coalesce(previous->'created_at', to_jsonb(now())), 'updated_at', now());
  update public.company_profiles set campaign_plan = saved where job_id = p_job and owner_id = p_owner;
  return jsonb_build_object('applied', true, 'plan', saved);
end;
$$;
revoke all on function public.autogtm_save_campaigns(uuid, uuid, integer, jsonb) from public, anon, authenticated;
grant execute on function public.autogtm_save_campaigns(uuid, uuid, integer, jsonb) to service_role;
notify pgrst, 'reload schema';
