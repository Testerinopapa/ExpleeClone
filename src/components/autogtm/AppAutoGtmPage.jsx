import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import AutoGtmNavigation from './AutoGtmNavigation';
import CrispChatWidget from './CrispChatWidget';
import useAuthSession from '../../hooks/useAuthSession';
import { listResearchProjects, normalizeWebsite, requestedWebsite, researchPath, startResearch } from '../../lib/companyResearch';

export default function AppAutoGtmPage() {
  const { navigate } = useNavigation();
  const { session, loading: authLoading } = useAuthSession();
  const [domain, setDomain] = useState(requestedWebsite);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const submitting = useRef(false);
  const [projects, setProjects] = useState([]);
  const [projectsError, setProjectsError] = useState('');
  const [projectsLoading, setProjectsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setProjects([]); setProjectsError('');
    if (!session) return;
    setProjectsLoading(true);
    listResearchProjects().then(data => { if (active) setProjects(data); })
      .catch(err => { if (active) setProjectsError(err.message); })
      .finally(() => { if (active) setProjectsLoading(false); });
    return () => { active = false; };
  }, [session?.user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting.current || authLoading) return;
    setError('');
    try {
      const normalized = normalizeWebsite(domain);
      sessionStorage.setItem('autogtm-pending-domain', normalized.website);
      if (!session) { navigate('/sign-in'); return; }
      submitting.current = true; setSaving(true);
      const result = await startResearch(normalized.website);
      sessionStorage.removeItem('autogtm-pending-domain');
      navigate(researchPath(result.domain, result.job.id));
    } catch (err) { setError(err.message); }
    finally { submitting.current = false; setSaving(false); }
  };

  return (
    <div className="flex h-dvh w-full flex-col bg-white text-[#0a0a0a] overflow-hidden font-sans md:flex-row">
      {/* Sidebar */}
      <AutoGtmNavigation
        completedSteps={[]}
        userEmail={session?.user.email || 'Not signed in'}
      />

      {/* Main Area */}
      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center overflow-y-auto bg-white p-4 pb-24 md:p-6 md:[scrollbar-gutter:stable]">
        <div className="my-auto flex w-full max-w-[560px] shrink-0 flex-col py-6 sm:px-4 sm:py-12 animate-card-enter">
          {/* Tag */}
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Explee
          </p>

          {/* Heading */}
          <h1 className="mt-2 text-3xl sm:text-[32px] font-bold tracking-tight leading-tight text-gray-900">
            Let's find your first customers
          </h1>

          {/* Subtitle */}
          <p className="mt-2.5 text-sm text-gray-500 leading-relaxed">
            Enter your company website to research up to 10 pages and save a company profile with sources.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-7">
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <input
                id="company-domain-input"
                type="text"
                aria-label="Company website"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                placeholder="Your company website"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  if (error) setError('');
                }}
                className="h-11 w-full min-w-0 shrink-0 px-3.5 rounded-lg border border-black/15 bg-white text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0d9467] focus:ring-1 focus:ring-[#0d9467] transition-all shadow-2xs sm:flex-1 sm:text-sm"
              />

              <button
                type="submit"
                disabled={saving || authLoading}
                className="min-h-11 px-4 rounded-lg bg-[#0d9467] hover:bg-[#0a7854] active:scale-[0.98] text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
              >
                <span>{saving ? 'Starting research…' : authLoading ? 'Loading…' : session ? 'Create my project' : 'Sign in to research'}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </div>

            {error && (
              <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </form>

          <section className="mt-8" aria-label="Saved projects">
            <h2 className="text-sm font-semibold">Your projects</h2>
            {projectsLoading && <p role="status" className="mt-2 text-sm text-gray-500">Loading projects…</p>}
            {projectsError && <p role="alert" className="mt-2 text-sm text-red-600">{projectsError}</p>}
            {!session && !authLoading && <p className="mt-2 text-sm text-gray-500">Sign in to create projects and view saved research.</p>}
            {session && !projectsLoading && !projectsError && !projects.length && <p className="mt-2 text-sm text-gray-500">Your first company profile will appear here.</p>}
            <div className="mt-3 space-y-2">
              {projects.filter(project => project.latestJob).map(project => (
                <button key={project.id} type="button" onClick={() => navigate(researchPath(project.domain, project.latestJob.id))}
                  className="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border border-black/10 p-3 text-left hover:bg-gray-50">
                  <span className="min-w-0 break-all text-sm font-medium">{project.domain}</span>
                  <span className="shrink-0 text-xs capitalize text-gray-500">{project.latestJob.status}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Research details */}
          <div className="mt-9 space-y-3">
            {/* Card 1 */}
            <div className="rounded-xl border border-black/[0.08] bg-white p-4 flex items-start gap-3.5 shadow-2xs hover:border-black/15 transition-all">
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.03] text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-900 leading-tight">
                  We research your company
                </div>
                <div className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                  Read About, Products, Pricing and Contact pages first.
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-black/[0.08] bg-white p-4 flex items-start gap-3.5 shadow-2xs hover:border-black/15 transition-all">
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.03] text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-900 leading-tight">
                  We organize company facts
                </div>
                <div className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                  Save business descriptions, products, customers and locations.
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-black/[0.08] bg-white p-4 flex items-start gap-3.5 shadow-2xs hover:border-black/15 transition-all">
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.03] text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                  <path d="m21.854 2.147-10.94 10.939"></path>
                </svg>
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-900 leading-tight">
                  We keep the sources
                </div>
                <div className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                  Review the original pages behind each extracted fact.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Crisp floating chat */}
      <CrispChatWidget />
    </div>
  );
}
