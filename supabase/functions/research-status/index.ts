import { adminClient, authenticate, endpoint, json, readBody } from '../_shared/backend.ts';
import { isUuid, ResearchError } from '../_shared/research-core.ts';
import { findJob, reconcile, snapshot } from '../_shared/jobs.ts';

export const handler = endpoint(async (req) => {
  const db = adminClient();
  const user = await authenticate(req, db);
  const body = await readBody(req);
  if (!isUuid(body.job_id)) throw new ResearchError('INVALID_REQUEST', 'A valid job ID is required.');
  let job = await findJob(db, body.job_id, user.id);
  let warning: string | undefined;
  try { job = await reconcile(db, job); }
  catch (error) {
    if (!(error instanceof ResearchError)) throw error;
    warning = error.message;
  }
  return json({ ...await snapshot(db, job), warning });
});
if (import.meta.main) Deno.serve(handler);
