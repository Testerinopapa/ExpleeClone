import type { Admin } from './backend.ts';
import { batchStatus } from './firecrawl.ts';
import { buildProfile, ResearchError } from './research-core.ts';

export type Job = {
  id: string; project_id: string; owner_id: string; status: string; provider_job_id: string | null;
  selected_urls: string[]; pages_completed: number; created_at: string; updated_at: string;
};
export async function updateJob(db: Admin, id: string, status: string, values: Record<string, unknown> = {}): Promise<Job> {
  const { data, error } = await db.rpc('autogtm_update_job', { p_job: id, p_status: status, ...values });
  if (error) throw new ResearchError('SAVE_FAILED', 'Could not save research progress. Refresh to try again.', 503);
  return data as Job;
}
export async function findJob(db: Admin, id: string, owner?: string): Promise<Job> {
  let query = db.from('research_jobs').select('*').eq('id', id);
  if (owner) query = query.eq('owner_id', owner);
  const { data, error } = await query.maybeSingle();
  if (error) throw new ResearchError('DATABASE_UNAVAILABLE', 'Could not load the research job.', 503);
  if (!data) throw new ResearchError('NOT_FOUND', 'Research job not found.', 404);
  return data as Job;
}
export async function reconcile(db: Admin, job: Job): Promise<Job> {
  if (['completed', 'failed'].includes(job.status)) return job;
  if (!job.provider_job_id) {
    if (Date.now() - Date.parse(job.created_at) > 30 * 60 * 1000) {
      return await updateJob(db, job.id, 'failed', { p_error_code: 'START_INTERRUPTED',
        p_error_message: 'Research did not start or its confirmation was lost. Check Firecrawl activity before retrying.' });
    }
    return job;
  }
  try {
    const result = await batchStatus(job.provider_job_id);
    const count = Math.min(10, Math.max(0, Number(result.completed) || 0));
    if (result.status === 'completed') {
      const profile = buildProfile(result.data, job.selected_urls);
      return await updateJob(db, job.id, 'completed', { p_completed: count, p_profile: profile });
    }
    if (['failed', 'cancelled'].includes(result.status)) {
      return await updateJob(db, job.id, 'failed', { p_completed: count,
        p_error_code: 'CRAWL_FAILED', p_error_message: 'Firecrawl could not finish researching this website.' });
    }
    if (result.status !== 'scraping') throw new ResearchError('PROVIDER_RESPONSE', 'The provider returned an unknown job state.', 502);
    return await updateJob(db, job.id, 'scraping', { p_completed: count });
  } catch (error) {
    if (error instanceof ResearchError && ['NO_USABLE_CONTENT', 'RESULT_EXPIRED'].includes(error.code)) {
      return await updateJob(db, job.id, 'failed', { p_error_code: error.code, p_error_message: error.message });
    }
    throw error; // Transient polling failures must not destroy a running job.
  }
}
export async function snapshot(db: Admin, job: Job) {
  const [project, profile, events] = await Promise.all([
    db.from('projects').select('*').eq('id', job.project_id).single(),
    db.from('company_profiles').select('*').eq('job_id', job.id).maybeSingle(),
    db.from('job_events').select('*').eq('job_id', job.id).order('id', { ascending: true }).limit(100),
  ]);
  if (project.error || profile.error || events.error) throw new ResearchError('DATABASE_UNAVAILABLE', 'Could not load saved research.', 503);
  return { job, project: project.data, profile: profile.data, events: events.data };
}
