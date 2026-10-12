import { adminClient, authenticate, endpoint, json, readBody } from '../_shared/backend.ts';
import { isUuid, ResearchError } from '../_shared/research-core.ts';
import { advanceCompetitors, competitorSnapshot, findCompetitorProfile } from '../_shared/competitor-jobs.ts';

export const handler = endpoint(async (req) => {
  const db = adminClient();
  const { ownerId } = await authenticate(req, db);
  const body = await readBody(req);
  if (!isUuid(body.job_id)) throw new ResearchError('INVALID_REQUEST', 'A company research job ID is required.');
  const profile = await findCompetitorProfile(db, body.job_id, ownerId);
  const state = await advanceCompetitors(db, profile, body.retry === true);
  return json(competitorSnapshot(profile, state));
});
if (import.meta.main) Deno.serve(handler);
