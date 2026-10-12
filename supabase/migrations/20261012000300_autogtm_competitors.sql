-- Step 2 belongs to the exact researched profile, retaining its project/owner RLS.
alter table public.company_profiles add column competitor_research jsonb not null default
  '{"status":"pending","version":0,"queries":[],"searches_used":0,"candidates":[],"results":[],"warnings":[],"batch_attempted":false,"provider_job_id":null,"pages_completed":0}';

-- Compare-and-swap serializes paid work across tabs, retries and callbacks.
create function public.autogtm_save_competitors(p_job uuid, p_owner uuid, p_version integer, p_state jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare previous jsonb; saved jsonb;
begin
  select competitor_research into previous from public.company_profiles
    where job_id = p_job and owner_id = p_owner for update;
  if not found then raise exception 'PROFILE_NOT_FOUND'; end if;
  if (previous->>'version')::integer <> p_version or previous->>'status' = 'completed' then
    return jsonb_build_object('applied', false, 'state', previous);
  end if;
  if jsonb_typeof(p_state) is distinct from 'object'
    or coalesce(p_state->>'status', '') not in ('searching','submitting','scraping','completed','failed')
    or jsonb_typeof(p_state->'queries') is distinct from 'array'
    or jsonb_typeof(p_state->'candidates') is distinct from 'array'
    or jsonb_typeof(p_state->'results') is distinct from 'array'
    or jsonb_typeof(p_state->'warnings') is distinct from 'array'
    or jsonb_typeof(p_state->'batch_attempted') is distinct from 'boolean'
    or jsonb_typeof(p_state->'searches_used') is distinct from 'number'
    or jsonb_typeof(p_state->'pages_completed') is distinct from 'number' then
    raise exception 'INVALID_COMPETITOR_STATE';
  end if;
  if jsonb_array_length(p_state->'queries') > 3
    or jsonb_array_length(p_state->'candidates') > 10
    or jsonb_array_length(p_state->'results') > 10
    or (p_state->>'pages_completed')::integer not between 0 and 10
    or (p_state->>'searches_used')::integer not between (previous->>'searches_used')::integer and 3
    or (p_state->>'searches_used')::integer > jsonb_array_length(p_state->'queries')
    or (jsonb_array_length(previous->'queries') > 0 and previous->'queries' <> p_state->'queries')
    or ((previous->>'batch_attempted')::boolean and
      (not (p_state->>'batch_attempted')::boolean or previous->'candidates' <> p_state->'candidates'))
    or (previous->>'provider_job_id' is not null and previous->>'provider_job_id' is distinct from p_state->>'provider_job_id') then
    raise exception 'COMPETITOR_LIMIT_OR_CONFLICT';
  end if;
  saved := p_state || jsonb_build_object('version', p_version + 1, 'updated_at', now());
  update public.company_profiles set competitor_research = saved where job_id = p_job and owner_id = p_owner;
  return jsonb_build_object('applied', true, 'state', saved);
end;
$$;
revoke all on function public.autogtm_save_competitors(uuid, uuid, integer, jsonb) from public, anon, authenticated;
grant execute on function public.autogtm_save_competitors(uuid, uuid, integer, jsonb) to service_role;
notify pgrst, 'reload schema';
