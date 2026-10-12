import { adminClient, authenticate, endpoint, json, readBody } from '../_shared/backend.ts';
import { companyUrl, domainOf, ResearchError } from '../_shared/research-core.ts';

export const handler = endpoint(async (req) => {
  const db = adminClient();
  const { ownerId } = await authenticate(req, db);
  const body = await readBody(req);
  let query = db.from('projects')
    .select('id, domain, updated_at, research_jobs(id, status, created_at)')
    .eq('owner_id', ownerId)
    .order('updated_at', { ascending: false }).limit(50)
    .order('created_at', { referencedTable: 'research_jobs', ascending: false })
    .limit(1, { referencedTable: 'research_jobs' });
  if (body.domain !== undefined) query = query.eq('domain', domainOf(companyUrl(body.domain)));
  const { data, error } = await query;
  if (error) throw new ResearchError('DATABASE_UNAVAILABLE', 'Could not load saved research projects.', 503);
  return json({ projects: data.map(project => ({
    id: project.id, domain: project.domain, updated_at: project.updated_at,
    latestJob: project.research_jobs[0] ?? null,
  })) });
});
if (import.meta.main) Deno.serve(handler);
