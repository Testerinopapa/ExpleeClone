import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { ResearchError } from './research-core.ts';
import { AUTH_ISSUER, AUTH_PROJECT_URL, AUTH_PROJECT_PUBLISHABLE_KEY } from './auth-project.ts';

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
export const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
export function secret(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new ResearchError('NOT_CONFIGURED', 'Company research is not configured on the server.', 503);
  return value;
}
export function adminClient() {
  return createClient(secret('SUPABASE_URL'), secret('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false, autoRefreshToken: false } });
}
export type Admin = ReturnType<typeof adminClient>;
export async function authenticate(req: Request, db: Admin) {
  const match = req.headers.get('Authorization')?.match(/^Bearer (.+)$/i);
  if (!match) throw new ResearchError('UNAUTHORIZED', 'Sign in to research a company.', 401);
  // Validate with the issuer of the session, never with the scraping project.
  const auth = createClient(AUTH_PROJECT_URL, AUTH_PROJECT_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await auth.auth.getUser(match[1]);
  if (error || !data.user || data.user.is_anonymous) throw new ResearchError('UNAUTHORIZED', 'Your session expired. Please sign in again.', 401);
  // External identities have local research-owner IDs. A matching email or UUID
  // from a different project must never inherit another account's saved results.
  const { data: owner, error: ownerError } = await db.from('research_owners')
    .upsert({ auth_issuer: AUTH_ISSUER, auth_subject: data.user.id }, { onConflict: 'auth_issuer,auth_subject' })
    .select('id').single();
  if (ownerError || !owner) throw new ResearchError('DATABASE_UNAVAILABLE', 'Research account setup is unavailable. Confirm the two-project migration is deployed.', 503);
  return { user: data.user, ownerId: owner.id as string };
}
export function endpoint(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST.' } }, 405);
    try { return await handler(req); }
    catch (error) {
      const known = error instanceof ResearchError;
      // Never return/log raw provider responses, authorization headers or database errors.
      return json({ error: { code: known ? error.code : 'INTERNAL_ERROR', message: known ? error.message : 'Research is temporarily unavailable. Please try again.' } }, known ? error.status : 500);
    }
  };
}
export async function readBody(req: Request) {
  const body = await req.text();
  if (body.length > 4096) throw new ResearchError('INVALID_REQUEST', 'Request too large.', 413);
  try { return JSON.parse(body) as Record<string, unknown>; }
  catch { throw new ResearchError('INVALID_REQUEST', 'Invalid JSON request.'); }
}
export async function callbackToken(jobId: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret('SUPABASE_SERVICE_ROLE_KEY')), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`autogtm-webhook-v1:${jobId}`));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}
export async function validCallback(jobId: string, actual: string | null) {
  if (!actual || actual.length !== 64) return false;
  const expected = await callbackToken(jobId);
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
