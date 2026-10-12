import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, PRODUCT_ROUTES } from '../../context/NavigationContext';
import useAuthSession from '../../hooks/useAuthSession';
import { latestJobForDomain, researchPath, researchStatus, startResearch, validateResearchResult } from '../../lib/companyResearch';
import AutoGtmNavigation from './AutoGtmNavigation';
import AutoGtmRail from './AutoGtmRail';
import CrispChatWidget from './CrispChatWidget';

function SourceLinks({ urls }) {
  return <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
    {(urls || []).map((url, index) => <li key={url}><a className="break-all text-emerald-700 underline" href={url} target="_blank" rel="noreferrer">Source {index + 1}</a></li>)}
  </ul>;
}

function Facts({ title, facts }) {
  return <section className="min-w-0 rounded-xl border border-black/10 p-4">
    <h3 className="font-semibold">{title}</h3>
    {!facts?.length ? <p className="mt-2 text-sm text-gray-500">Not found in the researched pages.</p> :
      <ul className="mt-3 space-y-4">{facts.map((fact, index) => <li key={`${fact.name}-${index}`} className="min-w-0 break-words">
        <p className="text-sm font-medium">{fact.name}</p>
        {fact.description && <p className="mt-1 text-sm leading-relaxed text-gray-600">{fact.description}</p>}
        <SourceLinks urls={fact.source_urls} />
      </li>)}</ul>}
  </section>;
}

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
  const title = profile?.company_name || data?.project.domain || domain;
  const buttonStyle = 'min-h-11 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50';

  return <div className="flex h-dvh w-full flex-col overflow-hidden bg-white font-sans text-gray-900 md:flex-row">
    <AutoGtmNavigation completedSteps={complete ? [1] : []} currentPhase={running ? 'research_company_loading' : 'research_company'}
      companyData={{ name: title, domain: data?.project.domain || domain, description: profile?.business_description }}
      competitors={[]} campaigns={[]} userEmail={session?.user.email || 'Not signed in'} />
    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto pb-24">
      <AutoGtmRail currentStep={1} />
      <div className="mx-auto w-full max-w-4xl space-y-5 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Company research</p>
            <h1 className="mt-1 break-all text-2xl font-bold">{title}</h1></div>
          <button type="button" className="min-h-11 text-sm text-emerald-700 underline" onClick={() => navigate(PRODUCT_ROUTES.AUTO_GTM)}>All projects</button>
        </div>
        {(loading || authLoading) && <p role="status" className="text-sm text-gray-500">Loading your research…</p>}
        {!authLoading && !session && <section className="rounded-xl border border-black/10 p-5">
          <p className="mb-4 text-sm">Sign in to view your saved company research.</p><button className={buttonStyle} onClick={signIn}>Sign in</button>
        </section>}
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p>{error}</p><button className="mt-3 min-h-11 font-semibold underline" onClick={() => setReload(value => value + 1)}>Refresh status</button>
        </div>}
        {data?.warning && <p role="status" className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">{data.warning}</p>}
        {!loading && session && !job && !error && <section className="rounded-xl border border-black/10 p-5">
          <p className="mb-4 text-sm">No saved research for this company yet. Research up to 10 public pages.</p>
          <button className={buttonStyle} disabled={starting} onClick={newResearch}>{starting ? 'Starting…' : 'Research company'}</button>
        </section>}
        {running && <section aria-live="polite" className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
          <h2 className="font-semibold">{job.status === 'mapping' ? 'Finding company pages' : 'Researching company pages'}</h2>
          <p className="mt-2 text-sm text-gray-600">{job.selected_urls.length ? `${job.pages_completed} of ${job.selected_urls.length} pages scraped. Preparing facts and sources.` : 'Discovering About, Products, Pricing and Contact pages.'}</p>
          {!!job.selected_urls.length && <progress className="mt-4 h-2 w-full accent-emerald-600" value={job.pages_completed} max={job.selected_urls.length} aria-label="Pages scraped" />}
          <p className="mt-3 text-xs text-gray-500">You can leave this page and return to your project later.</p>
        </section>}
        {failed && <section role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="font-semibold">Research could not finish</h2><p className="mt-2 text-sm">{job.error_message}</p>
          <button className={`${buttonStyle} mt-4`} disabled={starting} onClick={newResearch}>{starting ? 'Starting…' : 'Start a new attempt'}</button>
        </section>}
        {complete && profile && <article className="min-w-0 space-y-5" aria-label="Saved company profile">
          <div className="rounded-xl border border-emerald-200 p-5">
            <p className="text-xs font-semibold text-emerald-700">Saved profile · {profile.source_urls.length} source pages</p>
            <h2 className="mt-3 text-lg font-semibold">Business description</h2>
            {profile.descriptions?.length ? profile.descriptions.map((description, index) => <div key={index} className="mt-3">
              <p className="break-words text-sm leading-relaxed text-gray-700">{description.text}</p><SourceLinks urls={description.source_urls} />
            </div>) : <p className="mt-2 text-sm text-gray-500">Not found in the researched pages.</p>}
          </div>
          {profile.warnings?.map(warning => <p key={warning} className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">{warning}</p>)}
          <div className="grid min-w-0 gap-4 lg:grid-cols-2"><Facts title="Products and services" facts={profile.products} /><Facts title="Customers and segments" facts={profile.customers} /><Facts title="Locations" facts={profile.locations} /></div>
          <section className="min-w-0 rounded-xl border border-black/10 p-5"><h3 className="font-semibold">Researched sources</h3>
            <ul className="mt-3 space-y-2">{profile.source_urls.map(url => <li key={url} className="min-w-0"><a href={url} target="_blank" rel="noreferrer" className="break-all text-sm text-emerald-700 underline">{url}</a></li>)}</ul>
          </section>
          <p className="text-sm text-gray-500">Company research is complete. Competitor research, customer discovery and outreach are upcoming steps.</p>
          <button className={buttonStyle} disabled={starting} onClick={newResearch}>{starting ? 'Starting…' : 'Research again (up to 10 pages)'}</button>
        </article>}
        {!!data?.events?.length && <section className="rounded-xl border border-black/10 p-5"><h2 className="text-sm font-semibold">Research activity</h2>
          <ol className="mt-3 space-y-3 text-sm text-gray-600">{data.events.map(event => <li key={event.id} className="flex flex-wrap justify-between gap-2"><span>{event.message}{event.pages_completed > 0 ? ` · ${event.pages_completed} pages` : ''}</span><time className="text-xs text-gray-400" dateTime={event.created_at}>{new Date(event.created_at).toLocaleTimeString()}</time></li>)}</ol>
        </section>}
      </div>
    </main>
    <CrispChatWidget />
  </div>;
}
