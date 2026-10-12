import { supabase } from '../integrations/supabase/client';

export function normalizeWebsite(value) {
  let url;
  if (typeof value !== 'string' || !value.trim()) throw new Error('Enter a company website.');
  try { url = new URL(value.includes('://') ? value.trim() : `https://${value.trim()}`); }
  catch { throw new Error('Enter a valid company website.'); }
  if (!['https:', 'http:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password || url.port) {
    throw new Error('Enter a public company website without credentials or a custom port.');
  }
  url.pathname = '/'; url.search = ''; url.hash = '';
  return { website: url.href, domain: url.hostname.replace(/^www\./, '').replace(/\.$/, '') };
}

export function requestedWebsite() {
  return new URLSearchParams(window.location.search).get('website') || sessionStorage.getItem('autogtm-pending-domain') || '';
}

export function validateResearchResult(result, domain, jobId) {
  const mismatch = () => Object.assign(new Error('The saved research does not match this website. Return to your projects and start research for the correct website.'), { code: 'PROJECT_MISMATCH' });
  if (!result?.job || !result?.project || result.job.id !== jobId) throw mismatch();
  let resultDomain;
  try { resultDomain = normalizeWebsite(result.project.domain).domain; }
  catch { throw mismatch(); }
  if (resultDomain !== normalizeWebsite(domain).domain || result.job.project_id !== result.project.id ||
      (result.profile && (result.profile.job_id !== jobId || result.profile.project_id !== result.project.id))) throw mismatch();
  return result;
}

async function invoke(name, body, signal) {
  const unavailable = name === 'campaigns' ? 'Could not reach campaign planning. Check your connection and that the Phase 3 backend has been deployed.' : 'Could not reach company research. Check your connection and that the backend has been deployed.';
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw Object.assign(new Error('Sign in to research a company.'), { code: 'UNAUTHORIZED' });
  let response;
  try {
    response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${name}`, {
      method: 'POST', signal,
      headers: { 'Content-Type': 'application/json', apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${data.session.access_token}` },
      body: JSON.stringify(body),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error(unavailable);
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(result.error?.message || unavailable), { code: result.error?.code });
  return result;
}

export async function startResearch(value) {
  const { website, domain } = normalizeWebsite(value);
  const { data } = await supabase.auth.getSession();
  const key = `autogtm-request:${data.session?.user.id}:${domain}`;
  const requestId = sessionStorage.getItem(key) || crypto.randomUUID();
  sessionStorage.setItem(key, requestId);
  const result = await invoke('start-research', { website, request_id: requestId });
  if (!result?.job?.id) throw new Error('The server did not return a research job. Please try again.');
  sessionStorage.removeItem(key);
  return { ...result, domain };
}

export const researchStatus = (id, signal) => invoke('research-status', { job_id: id }, signal);
export const competitorResearch = (id, retry, signal) => invoke('competitor-research', { job_id: id, retry }, signal);
export const campaignRequest = (id, action = 'load', values = {}, signal) => invoke('campaigns', { ...values, job_id: id, action }, signal);
export const researchPath = (domain, jobId) => `/auto-gtm/company/${encodeURIComponent(domain)}/explore?job=${encodeURIComponent(jobId)}`;

export async function listResearchProjects() {
  const { projects } = await invoke('research-projects', {});
  return projects;
}

export async function latestJobForDomain(domain) {
  const { projects } = await invoke('research-projects', { domain });
  return projects[0]?.latestJob?.id || null;
}
