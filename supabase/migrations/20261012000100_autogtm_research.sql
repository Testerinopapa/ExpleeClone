-- Additive migration. Deliberately fail on name collisions; never replace existing tables.
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  domain text not null check (length(domain) between 3 and 253),
  website_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, domain),
  unique (id, owner_id)
);

create table public.research_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  owner_id uuid not null,
  request_id uuid not null,
  status text not null default 'mapping' check (status in ('mapping', 'scraping', 'completed', 'failed')),
  provider_job_id text unique,
  selected_urls text[] not null default '{}',
  pages_completed integer not null default 0 check (pages_completed between 0 and 10),
  error_code text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  finished_at timestamptz,
  foreign key (project_id, owner_id) references public.projects(id, owner_id) on delete cascade,
  unique (owner_id, request_id),
  unique (id, project_id, owner_id),
  check (cardinality(selected_urls) <= 10)
);
create unique index autogtm_one_active_job on public.research_jobs(project_id)
  where status in ('mapping', 'scraping');
create index autogtm_jobs_owner_created on public.research_jobs(owner_id, created_at desc);
create index autogtm_jobs_project_created on public.research_jobs(project_id, created_at desc);

create table public.company_profiles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  job_id uuid not null unique,
  owner_id uuid not null,
  company_name text,
  business_description text,
  descriptions jsonb not null default '[]',
  products jsonb not null default '[]',
  customers jsonb not null default '[]',
  locations jsonb not null default '[]',
  source_urls text[] not null,
  warnings text[] not null default '{}',
  created_at timestamptz not null default now(),
  foreign key (job_id, project_id, owner_id) references public.research_jobs(id, project_id, owner_id) on delete cascade,
  check (cardinality(source_urls) between 1 and 10)
);
create index autogtm_profiles_project on public.company_profiles(project_id, created_at desc);

create table public.job_events (
  id bigint generated always as identity primary key,
  job_id uuid not null,
  project_id uuid not null,
  owner_id uuid not null,
  status text not null,
  message text not null,
  pages_completed integer not null default 0,
  created_at timestamptz not null default now(),
  foreign key (job_id, project_id, owner_id) references public.research_jobs(id, project_id, owner_id) on delete cascade
);
create index autogtm_events_job on public.job_events(job_id, id);

alter table public.projects enable row level security;
alter table public.research_jobs enable row level security;
alter table public.company_profiles enable row level security;
alter table public.job_events enable row level security;
create policy projects_owner_read on public.projects for select to authenticated using (owner_id = (select auth.uid()));
create policy research_jobs_owner_read on public.research_jobs for select to authenticated using (owner_id = (select auth.uid()));
create policy company_profiles_owner_read on public.company_profiles for select to authenticated using (owner_id = (select auth.uid()));
create policy job_events_owner_read on public.job_events for select to authenticated using (owner_id = (select auth.uid()));
-- All writes go through authenticated Edge Functions. Clients cannot forge results or owners.
revoke all on public.projects, public.research_jobs, public.company_profiles, public.job_events from anon, authenticated;
revoke all on sequence public.job_events_id_seq from anon, authenticated;
grant select on public.projects, public.research_jobs, public.company_profiles, public.job_events to authenticated;
grant all on public.projects, public.research_jobs, public.company_profiles, public.job_events to service_role;
grant usage, select on sequence public.job_events_id_seq to service_role;

create function public.autogtm_reserve_job(p_owner uuid, p_domain text, p_url text, p_request uuid)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare p public.projects; j public.research_jobs;
begin
  -- Serialize reservations per user, including the daily credit protection limit.
  perform pg_advisory_xact_lock(hashtextextended(p_owner::text, 0));
  select * into j from public.research_jobs where owner_id = p_owner and request_id = p_request;
  if found then
    if not exists (select 1 from public.projects where id = j.project_id and domain = p_domain) then
      raise exception 'REQUEST_CONFLICT';
    end if;
    return jsonb_build_object('job', to_jsonb(j), 'created', false);
  end if;
  insert into public.projects(owner_id, domain, website_url) values (p_owner, p_domain, p_url)
    on conflict (owner_id, domain) do update set domain = excluded.domain returning * into p;
  select * into j from public.research_jobs where project_id = p.id and status in ('mapping', 'scraping');
  if found then return jsonb_build_object('job', to_jsonb(j), 'created', false); end if;
  if (select count(*) from public.research_jobs where owner_id = p_owner and created_at > now() - interval '24 hours') >= 5 then
    raise exception 'DAILY_LIMIT';
  end if;
  insert into public.research_jobs(project_id, owner_id, request_id) values (p.id, p_owner, p_request) returning * into j;
  insert into public.job_events(job_id, project_id, owner_id, status, message)
    values (j.id, p.id, p_owner, 'mapping', 'Finding company pages');
  return jsonb_build_object('job', to_jsonb(j), 'created', true);
end;
$$;

-- Atomic progress/profile/event writes; duplicate callbacks cannot regress a terminal job.
create function public.autogtm_update_job(
  p_job uuid, p_status text, p_urls text[] default null, p_provider text default null,
  p_completed integer default 0, p_profile jsonb default null,
  p_error_code text default null, p_error_message text default null
) returns public.research_jobs language plpgsql security invoker set search_path = '' as $$
declare j public.research_jobs; old_status text; old_completed integer;
begin
  select * into strict j from public.research_jobs where id = p_job for update;
  if j.status in ('completed', 'failed') then return j; end if;
  if p_provider is not null and j.provider_job_id is not null and p_provider <> j.provider_job_id then
    raise exception 'PROVIDER_CONFLICT';
  end if;
  old_status := j.status; old_completed := j.pages_completed;
  if p_status = 'completed' then
    if p_profile is null then raise exception 'PROFILE_REQUIRED'; end if;
    insert into public.company_profiles(project_id, job_id, owner_id, company_name, business_description,
      descriptions, products, customers, locations, source_urls, warnings)
    values (j.project_id, j.id, j.owner_id, p_profile->>'company_name', p_profile->>'business_description',
      p_profile->'descriptions', p_profile->'products', p_profile->'customers', p_profile->'locations',
      array(select jsonb_array_elements_text(p_profile->'source_urls')),
      array(select jsonb_array_elements_text(p_profile->'warnings')));
  end if;
  update public.research_jobs set
    status = case when j.status = 'scraping' and p_status = 'mapping' then j.status else p_status end,
    selected_urls = coalesce(p_urls, j.selected_urls), provider_job_id = coalesce(p_provider, j.provider_job_id),
    pages_completed = greatest(j.pages_completed, least(10, p_completed)),
    error_code = p_error_code, error_message = p_error_message, updated_at = now(),
    finished_at = case when p_status in ('completed', 'failed') then now() else null end
    where id = j.id returning * into j;
  update public.projects set updated_at = now() where id = j.project_id;
  if old_status <> j.status or old_completed <> j.pages_completed then
    insert into public.job_events(job_id, project_id, owner_id, status, message, pages_completed)
    values (j.id, j.project_id, j.owner_id, j.status,
      case j.status when 'completed' then 'Company profile saved' when 'failed' then coalesce(p_error_message, 'Research failed')
        when 'scraping' then 'Researching company pages' else 'Finding company pages' end, j.pages_completed);
  end if;
  return j;
end;
$$;
revoke all on function public.autogtm_reserve_job(uuid, text, text, uuid) from public, anon, authenticated;
revoke all on function public.autogtm_update_job(uuid, text, text[], text, integer, jsonb, text, text) from public, anon, authenticated;
grant execute on function public.autogtm_reserve_job(uuid, text, text, uuid) to service_role;
grant execute on function public.autogtm_update_job(uuid, text, text[], text, integer, jsonb, text, text) to service_role;
