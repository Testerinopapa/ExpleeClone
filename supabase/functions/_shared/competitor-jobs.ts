import { callbackToken, secret, type Admin } from './backend.ts';
import { batchStatus, firecrawl } from './firecrawl.ts';
import { isUuid, ResearchError } from './research-core.ts';
import { collectCandidates, competitorExtraction, competitorQueries, rankCompetitors, type CompanyProfile, type CompetitorState } from './competitor-core.ts';

const LEASE_MS = 120_000;
export async function findCompetitorProfile(db: Admin, jobId: string, owner?: string): Promise<CompanyProfile> {
  let query = db.from('company_profiles').select('*').eq('job_id', jobId);
  if (owner) query = query.eq('owner_id', owner);
  const { data, error } = await query.maybeSingle();
  if (error) throw new ResearchError('DATABASE_UNAVAILABLE', 'Could not load competitor research. Confirm the Step 2 migration is deployed.', 503);
  if (!data) throw new ResearchError('NOT_FOUND', 'A completed company profile was not found for this project.', 404);
  if (!data.competitor_research) throw new ResearchError('DATABASE_UNAVAILABLE', 'The Step 2 migration has not been deployed.', 503);
  return data as CompanyProfile;
}

async function save(db: Admin, profile: CompanyProfile, state: CompetitorState, changes: Partial<CompetitorState>) {
  const { data, error } = await db.rpc('autogtm_save_competitors', {
    p_job: profile.job_id, p_owner: profile.owner_id, p_version: state.version, p_state: { ...state, ...changes },
  });
  if (error) throw new ResearchError('SAVE_FAILED', 'Could not save competitor research. Refresh to resume the saved job.', 503);
  return data as { applied: boolean; state: CompetitorState };
}
const stale = (state: CompetitorState) => !state.updated_at || Date.now() - Date.parse(state.updated_at) > LEASE_MS;
const warnings = (state: CompetitorState, message: string) => [...new Set([...state.warnings, message])].slice(0, 10);
function canRetry(state: CompetitorState) {
  return state.status === 'failed' && !state.batch_attempted &&
    (state.searches_used < state.queries.length || state.candidates.length > 0);
}
export function competitorSnapshot(profile: CompanyProfile, state: CompetitorState) {
  return { job_id: profile.job_id, project_id: profile.project_id, research: {
    status: state.status, queries: state.queries, searches_used: state.searches_used,
    candidates_count: state.candidates.length, pages_completed: state.pages_completed,
    results: state.results, warnings: state.warnings, error: state.error || null,
    error_code: state.error_code || null, can_retry: canRetry(state),
  } };
}

export async function reconcileCompetitors(db: Admin, profile: CompanyProfile, state: CompetitorState): Promise<CompetitorState> {
  if (state.status === 'completed' || !state.provider_job_id) return state;
  try {
    const result = await batchStatus(state.provider_job_id);
    const pages_completed = Math.min(state.candidates.length, Math.max(state.pages_completed, Number(result.completed) || 0));
    if (result.status === 'completed') {
      if (!result.data.some((page: { markdown?: string }) => page.markdown?.trim())) {
        throw new ResearchError('NO_USABLE_CONTENT', 'The competitor websites did not return readable content.', 422);
      }
      const results = rankCompetitors(profile, state.candidates, result.data);
      return (await save(db, profile, state, { status: 'completed', results, pages_completed, error: null, error_code: null,
        warnings: results.length < state.candidates.length ? warnings(state, 'Some candidates lacked readable, relevant first-party evidence and were omitted.') : state.warnings })).state;
    }
    if (['failed', 'cancelled'].includes(result.status)) throw new ResearchError('CRAWL_FAILED', 'Firecrawl could not finish researching the competitors.', 422);
    if (result.status !== 'scraping') throw new ResearchError('PROVIDER_RESPONSE', 'The provider returned an unknown competitor job state.', 502);
    return (await save(db, profile, state, { status: 'scraping', pages_completed, error: null, error_code: null })).state;
  } catch (error) {
    if (error instanceof ResearchError && ['RESULT_EXPIRED', 'NO_USABLE_CONTENT', 'CRAWL_FAILED'].includes(error.code)) {
      return (await save(db, profile, state, { status: 'failed', error: error.message, error_code: error.code })).state;
    }
    throw error; // A temporary polling failure must not discard a running provider job.
  }
}

// Each request performs at most one search or one batch submission. Atomic
// reservations prevent effect replays, refreshes and concurrent tabs spending twice.
export async function advanceCompetitors(db: Admin, profile: CompanyProfile, retry = false): Promise<CompetitorState> {
  let state = profile.competitor_research;
  if (state.status === 'completed') return state;
  if (state.provider_job_id) {
    if (state.status === 'failed') return state;
    return reconcileCompetitors(db, profile, state);
  }
  if (state.batch_attempted) {
    if (!stale(state) || state.status === 'failed') return state;
    return (await save(db, profile, state, { status: 'failed', error_code: 'CONFIRMATION_MISSING',
      error: 'The competitor scrape was submitted but its confirmation was lost. Check Firecrawl activity; it will not be submitted twice.' })).state;
  }
  if (state.status === 'failed' && (!retry || !canRetry(state))) return state;
  if (state.working && !stale(state)) return state;
  const queries = state.queries.length ? state.queries : competitorQueries(profile);
  secret('FIRECRAWL_API_KEY');

  if (state.searches_used < queries.length) {
    const query = queries[state.searches_used];
    const claim = await save(db, profile, state, { status: 'searching', queries, working: true,
      searches_used: state.searches_used + 1, error: null, error_code: null,
      warnings: state.working ? warnings(state, 'An interrupted search was counted toward the limit and was not repeated.') : state.warnings });
    if (!claim.applied) return claim.state;
    state = claim.state;
    try {
      // Search snippets only. Scraping search results here would multiply credit use.
      const result = await firecrawl('/search', { query, limit: 8, sources: ['web'] });
      if (!Array.isArray(result.data?.web)) throw new ResearchError('PROVIDER_RESPONSE', 'The provider returned an invalid competitor search result.', 502);
      return (await save(db, profile, state, { working: false, candidates: collectCandidates(profile, state.candidates, result.data.web),
        search_successes: (state.search_successes || 0) + 1 })).state;
    } catch (error) {
      const known = error instanceof ResearchError;
      return (await save(db, profile, state, { status: 'failed', working: false,
        warnings: warnings(state, 'An unsuccessful search was counted toward the three-search limit.'),
        error_code: known ? error.code : 'SEARCH_FAILED', error: known ? error.message : 'Could not search for competitors.' })).state;
    }
  }
  if (!state.candidates.length) {
    return (await save(db, profile, state, { status: state.search_successes ? 'completed' : 'failed', working: false,
      error: state.search_successes ? null : 'The search limit was reached without a successful search.',
      error_code: state.search_successes ? null : 'SEARCH_LIMIT' })).state;
  }
  const claim = await save(db, profile, state, { status: 'submitting', batch_attempted: true, working: false, error: null, error_code: null });
  if (!claim.applied) return claim.state;
  state = claim.state;
  try {
    const token = await callbackToken(`${profile.job_id}:competitors`);
    const batch = await firecrawl('/batch/scrape', {
      urls: state.candidates.map(candidate => candidate.url), maxConcurrency: 2, ignoreInvalidURLs: false,
      onlyMainContent: true, formats: ['markdown', competitorExtraction], parsers: [], timeout: 30000,
      webhook: { url: `${secret('SUPABASE_URL')}/functions/v1/firecrawl-webhook?job_id=${profile.job_id}&stage=competitors`,
        headers: { 'x-autogtm-token': token }, events: ['started', 'completed', 'failed'] },
    });
    if (!isUuid(batch.id)) throw new ResearchError('PROVIDER_RESPONSE', 'The provider did not confirm the competitor scrape.', 502);
    return (await save(db, profile, state, { status: 'scraping', provider_job_id: batch.id })).state;
  } catch (error) {
    // A lost POST response can still mean a paid job exists. Its authenticated
    // webhook may recover the ID; never blindly POST the batch again.
    if (!(error instanceof ResearchError) || ['PROVIDER_UNAVAILABLE', 'PROVIDER_RESPONSE', 'SAVE_FAILED'].includes(error.code)) return state;
    return (await save(db, profile, state, { status: 'failed', error_code: error.code, error: error.message })).state;
  }
}

export async function competitorCallback(db: Admin, jobId: string, providerId: string) {
  const profile = await findCompetitorProfile(db, jobId);
  let state = profile.competitor_research;
  if (!state.batch_attempted || (state.provider_job_id && state.provider_job_id !== providerId)) {
    throw new ResearchError('INVALID_REQUEST', 'Competitor job ID mismatch.');
  }
  if (state.status === 'completed') return;
  if (!state.provider_job_id) state = (await save(db, profile, state, { status: 'scraping', provider_job_id: providerId, error: null, error_code: null })).state;
  await reconcileCompetitors(db, profile, state);
}
