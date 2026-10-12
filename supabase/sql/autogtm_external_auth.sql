-- Upgrade only: apply after the original AutoGTM setup, in project cvpeezzkzsbosyuhmhmf.
-- Preserves existing data. Run once, only after deployment approval.
begin;

-- Keep login on its original project; research lives in this database.
-- Additive follow-up: works after the original migration or SQL-editor setup.
create table public.research_owners (
  id uuid primary key default gen_random_uuid(),
  auth_issuer text not null,
  auth_subject uuid not null,
  created_at timestamptz not null default now(),
  unique (auth_issuer, auth_subject)
);
alter table public.research_owners enable row level security;
revoke all on public.research_owners from public, anon, authenticated;
grant all on public.research_owners to service_role;

-- Preserve any existing research under its ORIGINAL issuer. Do not transfer
-- ownership by email, or treat equal subject UUIDs from two issuers as one user.
insert into public.research_owners(id, auth_issuer, auth_subject)
select distinct owner_id, 'https://cvpeezzkzsbosyuhmhmf.supabase.co/auth/v1', owner_id
from public.projects;

alter table public.projects drop constraint projects_owner_id_fkey;
alter table public.projects add constraint projects_owner_id_fkey
  foreign key (owner_id) references public.research_owners(id) on delete cascade;

-- Cross-project sessions do not authorize direct PostgREST access. All reads and
-- writes pass through Edge Functions, which verify auth and filter by owner ID.
-- RLS remains enabled; there are no client-access policies on research tables.
drop policy projects_owner_read on public.projects;
drop policy research_jobs_owner_read on public.research_jobs;
drop policy company_profiles_owner_read on public.company_profiles;
drop policy job_events_owner_read on public.job_events;
revoke all on public.projects, public.research_jobs, public.company_profiles, public.job_events from public, anon, authenticated;

notify pgrst, 'reload schema';

commit;
