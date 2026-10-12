import { useEffect, useRef, useState } from 'react';
import { useNavigation, PRODUCT_ROUTES } from '../context/NavigationContext';
import { latestJobForDomain, normalizeWebsite, requestedWebsite, researchStatus, startResearch, validateResearchResult } from '../lib/companyResearch';
import useAuthSession from './useAuthSession';

// Data only: the workflow owns its existing presentation and animation timing.
export default function useCompanyResearch(domain) {
  const { navigate } = useNavigation();
  const { session, loading: authLoading } = useAuthSession();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [revision, setRevision] = useState(0);
  const jobId = useRef(new URLSearchParams(window.location.search).get('job'));
  const resolution = useRef(null);
  const newAttempt = useRef(false);
  const userId = session?.user.id;

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    let timer;
    let failures = 0;
    const controller = new AbortController();
    setData(null); setError(null);

    let website;
    try {
      website = normalizeWebsite(domain).website;
      const pending = requestedWebsite();
      if (pending && normalizeWebsite(pending).domain === normalizeWebsite(domain).domain) {
        website = normalizeWebsite(pending).website;
      }
    } catch (err) { setError(err); return; }

    if (!userId) {
      sessionStorage.setItem('autogtm-pending-domain', website);
      navigate(PRODUCT_ROUTES.SIGN_IN);
      return;
    }

    const poll = async (id) => {
      try {
        const result = await researchStatus(id, controller.signal);
        if (!active) return;
        validateResearchResult(result, domain, id);
        if (result.job.status === 'completed' && !result.profile) {
          throw new Error('The company profile is not available yet. Please retry.');
        }
        setData(result); failures = 0;
        setError(result.job.status === 'failed' ? new Error(result.job.error_message || 'Company research could not finish.') : null);
        if (!['completed', 'failed'].includes(result.job.status)) {
          timer = setTimeout(() => poll(id), 5000);
        }
      } catch (err) {
        if (!active || err.name === 'AbortError') return;
        setData(null); setError(err);
        if (!['UNAUTHORIZED', 'NOT_FOUND', 'PROJECT_MISMATCH'].includes(err.code) && failures++ < 4) {
          timer = setTimeout(() => poll(id), Math.min(30000, 5000 * 2 ** failures));
        }
      }
    };

    // Reuse an in-flight start during React effect replays. The server also
    // deduplicates interrupted submissions using startResearch's request ID.
    const key = `${userId}:${domain}`;
    if (!resolution.current || resolution.current.key !== key) {
      const forceNew = newAttempt.current;
      resolution.current = { key, promise: (async () => {
        const existing = forceNew ? null : jobId.current || await latestJobForDomain(domain);
        if (existing) return existing;
        return (await startResearch(website)).job.id;
      })() };
    }

    resolution.current.promise.then(id => {
      if (!active) return;
      jobId.current = id;
      newAttempt.current = false;
      const url = new URL(window.location.href);
      url.searchParams.set('job', id);
      window.history.replaceState({}, '', url);
      sessionStorage.removeItem('autogtm-pending-domain');
      poll(id);
    }).catch(err => { if (active) setError(err); });

    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [domain, userId, authLoading, navigate, revision]);

  const retry = () => {
    if (!error) return;
    if (error.code === 'UNAUTHORIZED') {
      sessionStorage.setItem('autogtm-pending-domain', domain);
      navigate(PRODUCT_ROUTES.SIGN_IN);
      return;
    }
    // Only an explicitly retried terminal failure starts another crawl.
    if (data?.job.status === 'failed') newAttempt.current = true;
    resolution.current = null;
    setError(null);
    setRevision(value => value + 1);
  };

  return { data, error, retry, session };
}
