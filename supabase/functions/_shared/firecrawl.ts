import { ResearchError, safeNextPage, type ScrapedPage } from './research-core.ts';
import { secret } from './backend.ts';

export async function firecrawl(path: string, body?: unknown, timeout = 20000) {
  let response: Response;
  try {
    response = await fetch(`https://api.firecrawl.dev/v2${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { Authorization: `Bearer ${secret('FIRECRAWL_API_KEY')}`, 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(timeout),
    });
  } catch (error) {
    if (error instanceof ResearchError) throw error;
    throw new ResearchError('PROVIDER_UNAVAILABLE', 'The research provider did not respond. Check this job again before starting another.', 503);
  }
  if (!response.ok) {
    if (response.status === 402) throw new ResearchError('CREDITS_EXHAUSTED', 'The Firecrawl credit allowance is exhausted. Research can resume when credits are available.', 402);
    if (response.status === 429) throw new ResearchError('PROVIDER_RATE_LIMIT', 'Firecrawl is busy. Please wait before trying again.', 429);
    if ([401, 403].includes(response.status)) throw new ResearchError('PROVIDER_CONFIGURATION', 'The server could not authenticate with the research provider.', 503);
    if (response.status === 404) throw new ResearchError('RESULT_EXPIRED', 'The provider result is no longer available. Start a new research job.', 410);
    throw new ResearchError('PROVIDER_UNAVAILABLE', 'The research provider is temporarily unavailable.', 503);
  }
  const result = await response.json();
  if (result.success === false) throw new ResearchError('PROVIDER_RESPONSE', 'The research provider could not process this website.', 502);
  return result;
}

export async function batchStatus(id: string) {
  const path = `/batch/scrape/${encodeURIComponent(id)}`;
  const result = await firecrawl(path, undefined, 6000);
  const pages: ScrapedPage[] = Array.isArray(result.data) ? result.data.slice(0, 10) : [];
  // Firecrawl also supplies `next` during scraping; paginate only terminal results.
  let next = result.status === 'completed' ? result.next : null;
  const visited = new Set<string>();
  while (next && pages.length < 10) {
    if (visited.has(next) || visited.size >= 10) throw new ResearchError('PROVIDER_RESPONSE', 'Unable to retrieve all company pages.', 502);
    visited.add(next);
    const page = await firecrawl(safeNextPage(next, id).replace(/^\/v2/, ''), undefined, 6000);
    if (Array.isArray(page.data)) pages.push(...page.data.slice(0, 10 - pages.length));
    next = page.next;
  }
  return { ...result, data: pages };
}
