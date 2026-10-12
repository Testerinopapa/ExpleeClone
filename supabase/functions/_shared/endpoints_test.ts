import { strict as assert } from 'node:assert';
import { handler as start } from '../start-research/index.ts';
import { handler as status } from '../research-status/index.ts';
import { handler as projects } from '../research-projects/index.ts';
import { handler as webhook } from '../firecrawl-webhook/index.ts';
import { callbackToken } from './backend.ts';
import { batchStatus } from './firecrawl.ts';
import { AUTH_ISSUER, AUTH_PROJECT_URL } from './auth-project.ts';

const owner = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
const authSubject = 'dddddddd-dddd-4ddd-dddd-dddddddddddd';
const jobId = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb';
const provider = 'cccccccc-cccc-4ccc-cccc-cccccccccccc';
const base = { id: jobId, project_id: jobId, owner_id: owner, status: 'scraping', provider_job_id: provider,
  selected_urls: ['https://company.com/'], pages_completed: 0, created_at: new Date().toISOString() };
const response = (body: unknown, code = 200) => new Response(JSON.stringify(body), { status: code, headers: { 'Content-Type': 'application/json' } });
const request = (body: unknown, token = 'user-token') => new Request('https://local.test/function', {
  method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

async function withMock(run: (calls: { url: URL; body: Record<string, unknown> | null }[]) => Promise<void>, route: (url: URL, body: Record<string, unknown> | null) => Response) {
  const original = globalThis.fetch;
  const env = { SUPABASE_URL: 'https://test.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test-service-key', FIRECRAWL_API_KEY: 'test-firecrawl-key' };
  const previous = Object.fromEntries(Object.keys(env).map(key => [key, Deno.env.get(key)]));
  const calls: { url: URL; body: Record<string, unknown> | null }[] = [];
  for (const [key, value] of Object.entries(env)) Deno.env.set(key, value);
  globalThis.fetch = (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : null;
    calls.push({ url, body });
    if (url.pathname === '/auth/v1/user') {
      assert.equal(url.origin, AUTH_PROJECT_URL);
      return Promise.resolve(response({ id: authSubject, email: 'user@company.com', is_anonymous: false }));
    }
    if (url.pathname === '/rest/v1/research_owners') {
      assert.equal(url.origin, env.SUPABASE_URL);
      assert.equal(body?.auth_issuer, AUTH_ISSUER);
      assert.equal(body?.auth_subject, authSubject);
      return Promise.resolve(response({ id: owner }));
    }
    return Promise.resolve(route(url, body));
  };
  try { await run(calls); }
  finally {
    globalThis.fetch = original;
    for (const [key, value] of Object.entries(previous)) value === undefined ? Deno.env.delete(key) : Deno.env.set(key, value);
  }
}

Deno.test('start rejects missing authorization before making any network calls', async () => {
  await withMock(async calls => {
    const result = await start(new Request('https://local.test', { method: 'POST', body: '{}' }));
    assert.equal(result.status, 401); assert.equal(calls.length, 0);
  }, () => { throw new Error('Unexpected request'); });
});
Deno.test('start sends only ten prioritized URLs and server-side callback credentials', async () => {
  await withMock(async calls => {
    const result = await start(request({ website: 'company.com', request_id: crypto.randomUUID() }));
    assert.equal(result.status, 202);
    const batch = calls.find(call => call.url.pathname === '/v2/batch/scrape')?.body;
    assert.ok(batch);
    assert.equal((batch.urls as string[]).length, 10);
    assert.ok((batch.urls as string[]).includes('https://company.com/contact'));
    assert.equal(batch.maxConcurrency, 2);
    assert.equal((batch.formats as { type: string }[])[0].type, 'json');
    const data = JSON.stringify(await result.json());
    assert.ok(!data.includes('test-firecrawl-key') && !data.includes('x-autogtm-token'));
  }, (url, body) => {
    if (url.pathname.endsWith('/autogtm_reserve_job')) {
      assert.equal(body?.p_owner, owner);
      return response({ job: { ...base, status: 'mapping', provider_job_id: null }, created: true });
    }
    if (url.pathname.endsWith('/autogtm_update_job')) return response({ ...base, status: body?.p_status });
    if (url.pathname === '/v2/map') return response({ success: true, links: ['about', 'pricing', 'contact', ...Array.from({ length: 20 }, (_, i) => `products/${i}`)].map(path => ({ url: `https://company.com/${path}` })) });
    if (url.pathname === '/v2/batch/scrape') return response({ success: true, id: provider });
    throw new Error(`Unexpected ${url.pathname}`);
  });
});
Deno.test('duplicate request reuses job without calling Firecrawl', async () => {
  await withMock(async calls => {
    const result = await start(request({ website: 'company.com', request_id: crypto.randomUUID() }));
    assert.equal(result.status, 200);
    assert.ok(!calls.some(call => call.url.hostname === 'api.firecrawl.dev'));
  }, () => response({ job: base, created: false }));
});
Deno.test('status and project listing filter by the mapped owner', async () => {
  await withMock(async calls => {
    const result = await status(request({ job_id: jobId }));
    assert.equal(result.status, 404);
    const list = await projects(request({ domain: 'company.com', owner_id: authSubject }));
    assert.equal(list.status, 200);
    assert.deepEqual(await list.json(), { projects: [] });
    assert.ok(!calls.some(call => call.url.hostname === 'api.firecrawl.dev'));
  }, url => {
    assert.equal(url.searchParams.get('owner_id'), `eq.${owner}`);
    if (url.pathname.endsWith('/projects')) {
      assert.equal(url.searchParams.get('domain'), 'eq.company.com');
      return response([]);
    }
    return response(null);
  });
});
Deno.test('webhook rejects invalid or another job token without DB/provider access', async () => {
  await withMock(async calls => {
    for (const token of ['bad', await callbackToken(provider)]) {
      const result = await webhook(new Request(`https://local.test?job_id=${jobId}`, { method: 'POST', headers: { 'x-autogtm-token': token }, body: '{}' }));
      assert.equal(result.status, 401);
    }
    assert.equal(calls.length, 0);
  }, () => { throw new Error('Unexpected request'); });
});
Deno.test('valid callback fetches provider facts instead of trusting payload data', async () => {
  await withMock(async () => {
    const result = await webhook(new Request(`https://local.test?job_id=${jobId}`, { method: 'POST', headers: { 'x-autogtm-token': await callbackToken(jobId) }, body: JSON.stringify({ id: provider, data: [{ json: { company_name: 'Fake' } }] }) }));
    assert.equal(result.status, 200);
  }, (url, body) => {
    if (url.pathname.endsWith('/research_jobs')) return response(base);
    if (url.hostname === 'api.firecrawl.dev') return response({ status: 'completed', completed: 1, data: [{ metadata: { sourceURL: 'https://company.com/' }, json: { company_name: 'Actual', business_description: 'Makes widgets' } }] });
    if (url.pathname.endsWith('/autogtm_update_job')) {
      assert.equal((body?.p_profile as { company_name: string }).company_name, 'Actual');
      return response({ ...base, status: 'completed' });
    }
    throw new Error('Unexpected request');
  });
});
Deno.test('completed batch pagination collects all pages', async () => {
  await withMock(async () => {
    const result = await batchStatus(provider);
    assert.equal(result.data.length, 2);
  }, url => response({ status: 'completed', data: [{ json: { business_description: 'Evidence' } }], next: url.search ? null : `https://api.firecrawl.dev/v2/batch/scrape/${provider}?skip=1` }));
});
