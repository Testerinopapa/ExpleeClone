import { adminClient, authenticate, callbackToken, endpoint, json, readBody, secret } from '../_shared/backend.ts';
import { companyUrl, domainOf, extractionFormat, isUuid, ResearchError, selectPages } from '../_shared/research-core.ts';
import { firecrawl } from '../_shared/firecrawl.ts';
import { type Job, updateJob } from '../_shared/jobs.ts';

export const handler = endpoint(async (req) => {
  const db = adminClient();
  const user = await authenticate(req, db);
  const body = await readBody(req);
  const website = companyUrl(body.website);
  website.pathname = '/';
  if (!isUuid(body.request_id)) throw new ResearchError('INVALID_REQUEST', 'A unique request ID is required.');
  secret('FIRECRAWL_API_KEY'); // Check availability before reserving a job; never return the value.
  const { data, error } = await db.rpc('autogtm_reserve_job', {
    p_owner: user.id, p_domain: domainOf(website), p_url: website.href, p_request: body.request_id,
  });
  if (error) {
    if (error.message.includes('DAILY_LIMIT')) throw new ResearchError('DAILY_LIMIT', 'You can start up to five research jobs in 24 hours.', 429);
    if (error.message.includes('REQUEST_CONFLICT')) throw new ResearchError('REQUEST_CONFLICT', 'This request belongs to another website.', 409);
    throw new ResearchError('DATABASE_UNAVAILABLE', 'Could not create the project. Confirm the research backend is deployed.', 503);
  }
  const job = data.job as Job;
  if (!data.created) return json({ job }, 200);
  let submitted = false;
  try {
    let links: { url?: string }[] = [];
    try {
      const map = await firecrawl('/map', { url: website.href, limit: 100, includeSubdomains: false, ignoreQueryParameters: true, sitemap: 'include' });
      links = Array.isArray(map.links) ? map.links : [];
    } catch (error) {
      if (!(error instanceof ResearchError) || !['PROVIDER_UNAVAILABLE', 'PROVIDER_RESPONSE'].includes(error.code)) throw error;
      // Discovery can fail independently; the homepage is still useful evidence.
    }
    const urls = selectPages(website.href, links);
    await updateJob(db, job.id, 'mapping', { p_urls: urls });
    const token = await callbackToken(job.id);
    submitted = true;
    const batch = await firecrawl('/batch/scrape', {
      urls, maxConcurrency: 2, ignoreInvalidURLs: false, onlyMainContent: true,
      formats: [extractionFormat], parsers: [], timeout: 30000,
      webhook: {
        url: `${secret('SUPABASE_URL')}/functions/v1/firecrawl-webhook?job_id=${job.id}`,
        headers: { 'x-autogtm-token': token }, events: ['started', 'completed', 'failed'],
      },
    });
    if (!isUuid(batch.id)) throw new ResearchError('PROVIDER_RESPONSE', 'The provider did not confirm the research job.', 502);
    const started = await updateJob(db, job.id, 'scraping', { p_provider: batch.id });
    return json({ job: started }, 202);
  } catch (error) {
    const known = error instanceof ResearchError;
    // A timeout after POST may still have created a paid provider job. Do not submit again.
    // The authenticated started/completed callback can attach its ID and recover it.
    if (submitted && (!known || ['PROVIDER_UNAVAILABLE', 'PROVIDER_RESPONSE', 'SAVE_FAILED'].includes(error.code))) {
      return json({ job, warning: 'Waiting for provider confirmation. This job will recover through its callback; do not start a duplicate.' }, 202);
    }
    await updateJob(db, job.id, 'failed', { p_error_code: known ? error.code : 'START_FAILED',
      p_error_message: known ? error.message : 'Could not start company research.' });
    throw error;
  }
});
if (import.meta.main) Deno.serve(handler);
