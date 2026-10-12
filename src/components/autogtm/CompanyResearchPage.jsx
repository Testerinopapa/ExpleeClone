import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, PRODUCT_ROUTES } from '../../context/NavigationContext';
import useAuthSession from '../../hooks/useAuthSession';
import { latestJobForDomain, researchPath, researchStatus, startResearch, validateResearchResult } from '../../lib/companyResearch';
import AutoGtmNavigation from './AutoGtmNavigation';
import AutoGtmRail from './AutoGtmRail';
import Step1CompanyCard from './Step1CompanyCard';
import AutoGtmErrorBoundary from './AutoGtmErrorBoundary';
import CrispChatWidget from './CrispChatWidget';

export default function CompanyResearchPage({ domain }) {
  const { navigate } = useNavigation();
  const { session, loading: authLoading } = useAuthSession();
  const [jobId, setJobId] = useState(() => new URLSearchParams(window.location.search).get('job'));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [starting, setStarting] = useState(false);
  const startingRef = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    setData(null); setError('');
    if (!session) { setLoading(false); return; }
    let active = true;
    let timer;
    const controller = new AbortController();
    let failures = 0;
    setLoading(true);
    const poll = async (id) => {
      try {
        const result = await researchStatus(id, controller.signal);
        if (!active) return;
        validateResearchResult(result, domain, id);
        setData(result); setError(''); setLoading(false); failures = 0;
        if (!['completed', 'failed'].includes(result.job.status)) timer = setTimeout(() => poll(id), 5000);
      } catch (err) {
        if (!active || err.name === 'AbortError') return;
        setData(null); setError(err.message); setLoading(false);
        // Retry read-only status calls with backoff. Never resubmit a crawl automatically.
        if (!['UNAUTHORIZED', 'NOT_FOUND', 'PROJECT_MISMATCH'].includes(err.code) && failures++ < 4) {
          timer = setTimeout(() => poll(id), Math.min(30000, 5000 * 2 ** failures));
        }
      }
    };
    const resolve = async () => {
      try {
        const id = jobId || await latestJobForDomain(domain);
        if (!active) return;
        if (!id) { setLoading(false); return; }
        if (!jobId) {
          window.history.replaceState({}, '', researchPath(domain, id));
          setJobId(id);
          return;
        }
        await poll(id);
      } catch (err) { if (active) { setError(err.message); setLoading(false); } }
    };
    resolve();
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [jobId, domain, session?.user.id, authLoading, reload]);

  const newResearch = async () => {
    if (startingRef.current) return;
    startingRef.current = true; setStarting(true); setError('');
    try {
      const result = await startResearch(domain);
      window.history.replaceState({}, '', researchPath(result.domain, result.job.id));
      setJobId(result.job.id); setReload(value => value + 1);
    } catch (err) { setError(err.message); }
    finally { startingRef.current = false; setStarting(false); }
  };
  const signIn = () => { sessionStorage.setItem('autogtm-pending-domain', domain); navigate(PRODUCT_ROUTES.SIGN_IN); };
  const job = data?.job;
  const profile = data?.profile;
  const complete = job?.status === 'completed';
  const failed = job?.status === 'failed';
  const running = job && !complete && !failed;
  const researching = !error && (loading || authLoading || starting || running);
  const phase = researching ? 'research_company_loading' : 'research_company';
  const company = {
    name: profile?.company_name || data?.project.domain || domain,
    domain: data?.project.domain || domain,
    description: profile?.business_description || profile?.descriptions?.map(item => item.text).join('\n\n'),
    warnings: profile?.warnings || [],
  };
  // Keep the original terminal-style feed, but only advance when the job does.
  const agentItems = researching ? [
    ...(data?.events || []).filter(event => event.status && event.status !== job?.status)
      .map(event => ({ label: event.message, status: 'done' })),
    { label: running
      ? job.status === 'mapping' ? `fetching ${domain}…`
        : `extracting what you sell and to who… ${job.pages_completed} of ${job.selected_urls.length} pages`
      : 'loading your research…', status: 'active' },
  ] : [];
  const cardStyle = 'w-full max-w-xl mx-auto mt-12 bg-white rounded-2xl border border-black/[0.08] p-6 shadow-sm animate-card-enter';
  const buttonStyle = 'min-h-11 mt-4 text-xs font-semibold text-[#0d9467] hover:text-[#096647] disabled:opacity-50';

  return <AutoGtmErrorBoundary>
    <div className="flex h-dvh w-full flex-col bg-[#fbfbfb] text-[#0a0a0a] overflow-hidden font-sans md:flex-row">
      <AutoGtmNavigation currentPhase={phase} completedSteps={complete ? [1] : []}
        companyData={company} competitors={[]} campaigns={[]}
        onRestart={() => navigate(PRODUCT_ROUTES.AUTO_GTM)}
        userEmail={session?.user.email || 'Not signed in'}
        activeAgentStep={researching ? 1 : null} activeAgentItems={agentItems} />

      <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-y-auto md:[scrollbar-gutter:stable] bg-[#fbfbfb] relative">
        <div className="w-full max-w-5xl mx-auto px-4 pt-3 flex shrink-0 flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className={`size-2 shrink-0 rounded-full ${failed || error ? 'bg-gray-400' : 'bg-[#10b981]'} ${researching ? 'animate-pulse-dot' : ''}`} />
            <span className="break-all text-[11px] font-mono text-gray-500">
              Phase: <strong className="text-gray-800">{phase}</strong>
            </span>
          </div>
        </div>

        <AutoGtmRail currentStep={1} />

        <main className="flex-1 min-w-0 px-4 pb-24 flex flex-col justify-start">
          {researching && <div role="status" aria-label="Company research progress" className="flex-1 flex flex-col items-center justify-center min-h-[55vh] space-y-2 select-none animate-card-enter">
            <div className="text-xs font-normal text-gray-400">Researching</div>
            <h1 className="max-w-full break-all text-center text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight font-mono">{domain}</h1>
          </div>}

          {complete && profile && !starting && <Step1CompanyCard company={company} nextPending />}

          {!authLoading && !session && <section className={cardStyle}>
            <h1 className="break-all text-base font-bold text-gray-900">{domain}</h1>
            <p className="mt-2 text-sm text-gray-600">Sign in to view your saved company research.</p>
            <button className={buttonStyle} onClick={signIn}>Sign in</button>
          </section>}

          {error && <section role="alert" className={cardStyle}>
            <h1 className="break-all text-base font-bold text-gray-900">{domain}</h1>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <button className={buttonStyle} onClick={() => setReload(value => value + 1)}>Refresh status</button>
          </section>}

          {!loading && session && !job && !error && !starting && <section className={cardStyle}>
            <h1 className="break-all text-base font-bold text-gray-900">{domain}</h1>
            <p className="mt-2 text-sm text-gray-600">No saved research for this company yet.</p>
            <button className={buttonStyle} onClick={newResearch}>Research company</button>
          </section>}

          {failed && !starting && <section role="alert" className={cardStyle}>
            <h2 className="text-base font-bold text-gray-900">Research could not finish</h2>
            <p className="mt-2 text-sm text-gray-600">{job.error_message}</p>
            <button className={buttonStyle} onClick={newResearch}>Start a new attempt</button>
          </section>}

          {data?.warning && <p role="status" className="mx-auto mt-4 w-full max-w-xl text-xs text-amber-800">{data.warning}</p>}
        </main>
        <CrispChatWidget />
      </div>
    </div>
  </AutoGtmErrorBoundary>;
}
