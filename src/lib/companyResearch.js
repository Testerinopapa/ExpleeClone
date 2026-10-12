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
    throw new Error('Could not reach company research. Check your connection and that the backend has been deployed.');
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(result.error?.message || 'Company research is unavailable. Confirm the backend is deployed.'), { code: result.error?.code });
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
export const researchPath = (domain, jobId) => `/auto-gtm/company/${encodeURIComponent(domain)}/explore?job=${encodeURIComponent(jobId)}`;

export async function listResearchProjects() {
  const { data, error } = await supabase.from('projects')
    .select('id, domain, updated_at, research_jobs(id, status, created_at)')
    .order('updated_at', { ascending: false }).limit(50);
  if (error) throw new Error('Saved projects are unavailable. Confirm the database migration has been deployed.');
  return data.map(project => ({ ...project, latestJob: [...project.research_jobs].sort((a, b) => b.created_at.localeCompare(a.created_at))[0] }));
}

export async function latestJobForDomain(domain) {
  const { data: project, error } = await supabase.from('projects').select('id').eq('domain', domain).maybeSingle();
  if (error) throw new Error('Could not load the project. Confirm the database migration is deployed.');
  if (!project) return null;
  const { data, error: jobError } = await supabase.from('research_jobs').select('id').eq('project_id', project.id).order('created_at', { ascending: false }).limit(1);
  if (jobError) throw new Error('Could not load saved research.');
  return data[0]?.id || null;
}
