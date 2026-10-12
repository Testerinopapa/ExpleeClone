import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import AutoGtmNavigation from './AutoGtmNavigation';
import AutoGtmRail from './AutoGtmRail';
import AgentActivityFeed from './AgentActivityFeed';
import PromoCreditBanner from './PromoCreditBanner';
import Step1CompanyCard from './Step1CompanyCard';
import CompetitorSkeletonCard from './CompetitorSkeletonCard';
import Step2CompetitorsCard from './Step2CompetitorsCard';
import Step3CampaignsGrid from './Step3CampaignsGrid';
import TableSkeleton from './TableSkeleton';
import Step4CompaniesTable from './Step4CompaniesTable';
import PeopleSkeleton from './PeopleSkeleton';
import Step5PeopleTable from './Step5PeopleTable';
import Step6EmailComposer from './Step6EmailComposer';
import FinalTrialModal from './FinalTrialModal';
import FinalProjectDashboard from './FinalProjectDashboard';
import CrispChatWidget from './CrispChatWidget';
import AutoGtmErrorBoundary from './AutoGtmErrorBoundary';
import { normalizeSegments, normalizeCompetitors } from '../../lib/autogtmNormalizer';
import projectData from '../../data/autogtm_project_data.json';
import useCompanyResearch from '../../hooks/useCompanyResearch';
import useCompetitorResearch from '../../hooks/useCompetitorResearch';

const PHASES = [
  'research_company_loading',
  'research_company',
  'research_competitors_loading',
  'research_competitors',
  'research_segments_loading',
  'research_segments',
  'outreach_companies_loading',
  'outreach_companies',
  'outreach_people_loading',
  'outreach_people',
  'outreach_emails_loading',
  'outreach_emails',
  'final',
];

export default function AutoGtmWorkflowPage({ domain = 'keethub.lovable.app' }) {
  const { navigate } = useNavigation();
  const { data: research, error: researchError, retry: retryResearch, session } = useCompanyResearch(domain);
  const researchReady = research?.job.status === 'completed' && Boolean(research?.profile) && !researchError;
  const company = {
    name: research?.profile?.company_name || domain,
    domain,
    description: research?.profile?.business_description || research?.profile?.descriptions?.map(item => item.text).join(' ') || 'No business description was found on the researched pages.',
  };

  // Resolve initial phase from query string or default to first
  const [selectedPhase, setPhase] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qPhase = params.get('phase');
      if (qPhase && PHASES.includes(qPhase)) return qPhase;
    }
    return 'research_company_loading';
  });
  const competitorEnabled = researchReady && PHASES.indexOf(selectedPhase) >= 2;
  const { data: competitorData, error: competitorError, retry: retryCompetitors } = useCompetitorResearch(
    research?.job.id, research?.project.id, session?.user.id, competitorEnabled,
  );
  const competitorsReady = competitorData?.status === 'completed' && !competitorError;
  // Saved phase links and manual controls wait for the real results of steps 1–2.
  const phase = !researchReady ? 'research_company_loading'
    : competitorEnabled && !competitorsReady ? 'research_competitors_loading' : selectedPhase;
  const [competitorAnimationReady, setCompetitorAnimationReady] = useState(false);
  useEffect(() => {
    if (!competitorEnabled) { setCompetitorAnimationReady(false); return; }
    const timer = setTimeout(() => setCompetitorAnimationReady(true), 4600);
    return () => clearTimeout(timer);
  }, [competitorEnabled]);
  const [companyAnimationReady, setCompanyAnimationReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setCompanyAnimationReady(true), 4800);
    return () => clearTimeout(timer);
  }, []);

  const [activeSegment, setActiveSegment] = useState(null);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Guarantee normalized data at boundary for all UI consumers
  const normalizedCampaigns = normalizeSegments(projectData?.segments);
  const normalizedCompetitors = normalizeCompetitors(competitorData?.results || []);
  const determinants = [
    ...(research?.profile?.products || []).map(item => item.description ? `${item.name}: ${item.description}` : item.name),
    company.description,
    ...(research?.profile?.customers || []).map(item => item.description ? `${item.name}: ${item.description}` : item.name),
  ].filter(Boolean).slice(0, 4);

  // Sync phase change to URL with replaceState
  const changePhase = (nextPhase, userTriggered = false) => {
    if (!researchReady && nextPhase !== 'research_company_loading') return;
    if (!competitorsReady && PHASES.indexOf(nextPhase) > 2) nextPhase = 'research_competitors_loading';
    if (userTriggered) setIsAutoPlay(false);
    setPhase(nextPhase);

    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('phase', nextPhase);
      window.history.replaceState({}, '', currentUrl.toString());
    }

    if (nextPhase === 'final') {
      setIsTrialModalOpen(true);
    }
  };

  // Determine current numeric step (1 to 6)
  const getStepNumber = (p) => {
    if (p.startsWith('research_company')) return 1;
    if (p.startsWith('research_competitors')) return 2;
    if (p.startsWith('research_segments')) return 3;
    if (p.startsWith('outreach_companies')) return 4;
    if (p.startsWith('outreach_people')) return 5;
    if (p.startsWith('outreach_emails')) return 6;
    if (p === 'final') return 6;
    return 1;
  };

  const currentStep = getStepNumber(phase);

  // Determine which steps are completed for sidebar & rail
  const completedSteps = [];
  if (currentStep > 1 || phase === 'research_company') completedSteps.push(1);
  if (currentStep > 2 || phase === 'research_competitors') completedSteps.push(2);
  if (currentStep > 3 || phase === 'research_segments') completedSteps.push(3);
  if (currentStep > 4 || phase === 'outreach_companies') completedSteps.push(4);
  if (currentStep > 5 || phase === 'outreach_people') completedSteps.push(5);
  if (phase === 'outreach_emails' || phase === 'final') completedSteps.push(6);

  // Auto progression timers for loading phases
  useEffect(() => {
    if (!isAutoPlay) return;

    let timer;
    if (phase === 'research_company_loading') {
      if (researchReady && companyAnimationReady) {
        timer = setTimeout(() => changePhase('research_company'), 0);
      }
    } else if (phase === 'research_company') {
      timer = setTimeout(() => changePhase('research_competitors_loading'), 3500);
    } else if (phase === 'research_competitors_loading') {
      if (competitorsReady && competitorAnimationReady) {
        timer = setTimeout(() => changePhase('research_competitors'), 0);
      }
    } else if (phase === 'research_competitors') {
      timer = setTimeout(() => changePhase('research_segments_loading'), 3500);
    } else if (phase === 'research_segments_loading') {
      timer = setTimeout(() => changePhase('research_segments'), 4600);
    } else if (phase === 'research_segments') {
      timer = setTimeout(() => changePhase('outreach_companies_loading'), 3500);
    } else if (phase === 'outreach_companies_loading') {
      timer = setTimeout(() => changePhase('outreach_companies'), 4400);
    } else if (phase === 'outreach_companies') {
      timer = setTimeout(() => changePhase('outreach_people_loading'), 3500);
    } else if (phase === 'outreach_people_loading') {
      timer = setTimeout(() => changePhase('outreach_people'), 4200);
    } else if (phase === 'outreach_people') {
      timer = setTimeout(() => changePhase('outreach_emails_loading'), 3500);
    } else if (phase === 'outreach_emails_loading') {
      timer = setTimeout(() => changePhase('outreach_emails'), 7000);
    } else if (phase === 'outreach_emails') {
      timer = setTimeout(() => changePhase('final'), 4000);
    }

    return () => clearTimeout(timer);
  }, [phase, isAutoPlay, researchReady, companyAnimationReady, competitorsReady, competitorAnimationReady]);

  // Jump to a step when clicked on the rail
  const handleStepClick = (step) => {
    setIsAutoPlay(false);
    if (step === 1) changePhase('research_company', true);
    if (step === 2) changePhase('research_competitors', true);
    if (step === 3) changePhase('research_segments', true);
    if (step === 4) changePhase('outreach_companies', true);
    if (step === 5) changePhase('outreach_people', true);
    if (step === 6) changePhase('outreach_emails', true);
  };

  // Step tasks matching the reference video and spec
  const WORKFLOW_STEP_TASKS = {
    1: [
      `fetching ${domain}…`,
      'reading /pricing and /about…',
      'extracting what you sell and to who…',
      'building the company profile…',
    ],
    2: [
      `listing ${domain} products…`,
      competitorData?.queries?.length ? `searching "${competitorData.queries[Math.max(0, competitorData.searches_used - 1)]}"…` : 'finding relevant search queries…',
      competitorData?.candidates_count ? `researching ${competitorData.candidates_count} candidate websites…` : 'searching for competing businesses…',
    ],
    3: [
      'analyzing value proposition…',
      'identifying buyer segments…',
      'defining ICP criteria & personas…',
    ],
    4: [
      'building search queries from campaigns…',
      'querying the company index — 312,000+ companies…',
      'scoring fit for 1,284 domains…',
    ],
    5: [
      'identifying key decision makers…',
      'finding verified emails & LinkedIn…',
      'enriching contact profiles…',
    ],
    6: [
      'picking the hottest lead…',
      'reading their company signals…',
      'drafting the first email…',
      'personalizing the opener…',
    ],
  };

  const isRunningPhase = phase.endsWith('_loading');
  const [subtaskIndex, setSubtaskIndex] = useState(0);

  useEffect(() => {
    setSubtaskIndex(0);
  }, [phase]);

  useEffect(() => {
    if (!isRunningPhase) return;

    const tasks = WORKFLOW_STEP_TASKS[currentStep] || [];
    if (tasks.length <= 1) return;

    const interval = setInterval(() => {
      setSubtaskIndex((prev) => {
        if (prev < tasks.length - 1) return prev + 1;
        return prev;
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [phase, currentStep, isRunningPhase]);

  const currentStepTasks = WORKFLOW_STEP_TASKS[currentStep] || [];
  const activeError = researchError || (currentStep === 2 ? competitorError : null);
  const currentAgentItems = activeError ? [{ label: activeError.message, status: 'active' }] : isRunningPhase
    ? currentStepTasks.slice(0, subtaskIndex + 1).map((task, idx) => ({
        label: task,
        status: idx < subtaskIndex ? 'done' : 'active',
      }))
    : [];

  // Step 6 items derived from single source of truth (WORKFLOW_STEP_TASKS[6])
  const step6Items = currentStep === 6 && currentAgentItems.length > 0
    ? currentAgentItems
    : (WORKFLOW_STEP_TASKS[6] || []).map((task, idx) => ({
        label: task,
        status: idx < 3 ? 'done' : 'active',
      }));

  const showPromoBanner = [
    'outreach_companies_loading',
    'outreach_companies',
    'outreach_people_loading',
    'outreach_people',
    'outreach_emails_loading',
    'outreach_emails',
    'final',
  ].includes(phase);

  return (
    <AutoGtmErrorBoundary>
      <div className="flex h-dvh w-full flex-col bg-[#fbfbfb] text-[#0a0a0a] overflow-hidden font-sans md:flex-row">
        {/* Sidebar with completed context */}
        <AutoGtmNavigation
          currentPhase={phase}
          completedSteps={completedSteps}
          companyData={company}
          competitors={normalizedCompetitors}
          campaigns={normalizedCampaigns}
          activeSegment={activeSegment}
          onSelectSegment={(seg) => setActiveSegment(seg)}
          onRestart={() => navigate('/app-auto-gtm')}
          userEmail={session?.user.email || 'Not signed in'}
          activeAgentStep={isRunningPhase ? currentStep : null}
          activeAgentItems={currentAgentItems}
        />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-y-auto md:[scrollbar-gutter:stable] bg-[#fbfbfb] relative">
        {/* Top Header Controls / Auto-play status */}
        <div className="w-full max-w-5xl mx-auto px-4 pt-3 flex shrink-0 flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="size-2 rounded-full bg-[#10b981] animate-pulse-dot" />
            <span className="break-all text-[11px] font-mono text-gray-500">
              Phase: <strong className="text-gray-800">{phase}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="text-[11px] px-2.5 py-1 rounded-md border border-black/10 bg-white text-gray-600 hover:text-gray-900 transition shadow-2xs cursor-pointer"
            >
              {isAutoPlay ? '⏸ Pause Auto-play' : '▶ Resume Auto-play'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (researchError) {
                  setPhase('research_company_loading');
                  setIsAutoPlay(true);
                  retryResearch();
                  return;
                }
                if (currentStep === 2 && competitorError) {
                  setPhase('research_competitors_loading');
                  setIsAutoPlay(true);
                  retryCompetitors();
                  return;
                }
                const nextIdx = (PHASES.indexOf(phase) + 1) % PHASES.length;
                changePhase(PHASES[nextIdx], true);
              }}
              disabled={(!researchReady && !researchError) || (currentStep === 2 && !competitorsReady && (!competitorError || competitorError.canRetry === false))}
              className="text-[11px] px-2.5 py-1 rounded-md bg-[#0d9467] text-white hover:bg-[#0a7854] transition shadow-2xs cursor-pointer"
            >
              {activeError ? (activeError.canRetry === false ? 'Research failed' : 'Retry research') : 'Next Phase →'}
            </button>
          </div>
        </div>

        {/* Promo Credit Banner in steps 4, 5, 6 */}
        {showPromoBanner && (
          <div className="pt-2 px-4">
            <PromoCreditBanner onOpenTrialModal={() => setIsTrialModalOpen(true)} />
          </div>
        )}

        {/* Top Rail (Steps 1 to 6) */}
        <AutoGtmRail
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        {/* Dynamic Phase Stage Container */}
        <main className="flex-1 min-w-0 px-4 pb-24 flex flex-col justify-start">
          {/* Phase 1: research_company_loading */}
          {phase === 'research_company_loading' && (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[55vh] space-y-2 select-none animate-card-enter">
              <div role={researchError ? 'alert' : 'status'} className="text-xs font-normal text-gray-400">{researchError ? researchError.message : 'Researching'}</div>
              <div className="max-w-full break-all text-center text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight font-mono">
                {domain}
              </div>
            </div>
          )}

          {/* Phase 2: research_company */}
          {phase === 'research_company' && (
            <Step1CompanyCard
              company={company}
              onNext={() => changePhase('research_competitors_loading', true)}
            />
          )}

          {/* Phase 3: research_competitors_loading */}
          {phase === 'research_competitors_loading' && (
            competitorError ? <Step2CompetitorsCard determinants={determinants} searchQueries={competitorData?.queries || []} error={competitorError.message} /> : <CompetitorSkeletonCard />
          )}

          {/* Phase 4: research_competitors */}
          {phase === 'research_competitors' && (
            <Step2CompetitorsCard
              determinants={determinants}
              searchQueries={competitorData?.queries || []}
              competitors={competitorData?.results || []}
              warnings={competitorData?.warnings || []}
              onNext={() => changePhase('research_segments_loading', true)}
            />
          )}

          {/* Phase 5: research_segments_loading */}
          {phase === 'research_segments_loading' && (
            <CompetitorSkeletonCard />
          )}

          {/* Phase 6: research_segments */}
          {phase === 'research_segments' && (
            <Step3CampaignsGrid
              segments={normalizedCampaigns}
              activeSegmentId={activeSegment?.id}
              onSelectSegment={(seg) => setActiveSegment(seg)}
              onNext={() => changePhase('outreach_companies_loading', true)}
            />
          )}

          {/* Phase 7: outreach_companies_loading */}
          {phase === 'outreach_companies_loading' && (
            <TableSkeleton />
          )}

          {/* Phase 8: outreach_companies */}
          {phase === 'outreach_companies' && (
            <Step4CompaniesTable
              onNext={() => changePhase('outreach_people_loading', true)}
            />
          )}

          {/* Phase 9: outreach_people_loading */}
          {phase === 'outreach_people_loading' && (
            <PeopleSkeleton />
          )}

          {/* Phase 10: outreach_people */}
          {phase === 'outreach_people' && (
            <Step5PeopleTable
              onNext={() => changePhase('outreach_emails_loading', true)}
            />
          )}

          {/* Phase 11: outreach_emails_loading */}
          {phase === 'outreach_emails_loading' && (
            <div className="space-y-4">
              <div className="max-w-md mx-auto mb-2">
                <AgentActivityFeed
                  step={6}
                  items={step6Items}
                  companyDomain={domain}
                />
              </div>
              <Step6EmailComposer
                onClaimCredits={() => setIsTrialModalOpen(true)}
                onComplete={() => changePhase('outreach_emails', true)}
              />
            </div>
          )}

          {/* Phase 12: outreach_emails */}
          {phase === 'outreach_emails' && (
            <Step6EmailComposer
              onClaimCredits={() => setIsTrialModalOpen(true)}
              onComplete={() => changePhase('final', true)}
            />
          )}

          {/* Phase 13: final */}
          {phase === 'final' && (
            <FinalProjectDashboard
              companyData={company}
              onOpenTrialModal={() => setIsTrialModalOpen(true)}
            />
          )}
        </main>

        {/* Trial Offer Modal Overlay */}
        <FinalTrialModal
          isOpen={isTrialModalOpen}
          onClose={() => setIsTrialModalOpen(false)}
          companyDomain={domain}
          userEmail={session?.user.email || 'Not signed in'}
        />

        {/* Crisp Chat Widget */}
        <CrispChatWidget />
      </div>
    </div>
  </AutoGtmErrorBoundary>
);
}
