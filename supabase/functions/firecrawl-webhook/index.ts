import { adminClient, endpoint, json, validCallback } from '../_shared/backend.ts';
import { isUuid, ResearchError } from '../_shared/research-core.ts';
import { findJob, reconcile, updateJob } from '../_shared/jobs.ts';
import { competitorCallback } from '../_shared/competitor-jobs.ts';

export const handler = endpoint(async (req) => {
  const params = new URL(req.url).searchParams;
  const id = params.get('job_id');
  const competitors = params.get('stage') === 'competitors';
  if (!isUuid(id) || !await validCallback(competitors ? `${id}:competitors` : id, req.headers.get('x-autogtm-token'))) {
    throw new ResearchError('UNAUTHORIZED', 'Invalid callback credentials.', 401);
  }
  const db = adminClient();
  if (competitors) {
    const body = await req.json();
    if (!isUuid(body.id)) throw new ResearchError('INVALID_REQUEST', 'Missing provider job ID.');
    await competitorCallback(db, id, body.id);
    return json({ received: true });
  }
  let job = await findJob(db, id);
  if (['completed', 'failed'].includes(job.status)) return json({ received: true });
  // Callback data is not a source of company facts. Fetch the result from Firecrawl instead.
  const body = await req.json();
  if (!isUuid(body.id)) throw new ResearchError('INVALID_REQUEST', 'Missing provider job ID.');
  if (job.provider_job_id && job.provider_job_id !== body.id) throw new ResearchError('INVALID_REQUEST', 'Job ID mismatch.');
  if (!job.provider_job_id) job = await updateJob(db, job.id, 'scraping', { p_provider: body.id });
  await reconcile(db, job);
  return json({ received: true });
});
if (import.meta.main) Deno.serve(handler);
