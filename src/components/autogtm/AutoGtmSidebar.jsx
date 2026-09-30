import React, { useState } from 'react';
import { useNavigation, PRODUCT_ROUTES } from '../../context/NavigationContext';
import { normalizeSegments, normalizeCompetitors } from '../../lib/autogtmNormalizer';
import AgentActivityFeed from './AgentActivityFeed';

const DEFAULT_COMPETITORS = [
  { domain: 'langly.es' },
  { domain: 'playdiom.com' },
  { domain: 'wonderlang.net' },
  { domain: 'the-conversationalists.com' },
  { domain: 'revisionenglish.com' },
  { domain: 'immersive-english.com' },
  { domain: 'englishgeeks.com.br' },
  { domain: 'oxford-gear-kids.com' },
  { domain: 'ellinglish.com' },
  { domain: 'cookieplay.kr' },
  { domain: 'aslan.games' },
  { domain: 'playeng.ru' },
  { domain: 'letsgoreading.com' },
  { domain: 'ei-den.com' },
];

const DEFAULT_CAMPAIGNS = [
  { id: 'ge7hll', label: 'ESL teachers', count: '8.0K', icon: 'graduation-cap', percentage: 30 },
  { id: 'tqqyle', label: 'Language schools', count: '5.0K', icon: 'building', percentage: 22 },
  { id: 'seg-3', label: 'Private tutors', count: '12.0K', icon: 'users', percentage: 20 },
  { id: 'seg-4', label: 'After-school centers', count: '4.0K', icon: 'home', percentage: 15 },
  { id: 'seg-5', label: 'Homeschool parents', count: '6.0K', icon: 'clock', percentage: 8 },
  { id: 'seg-6', label: 'Small training firms', count: '1.2K', icon: 'building-2', percentage: 5 },
];

export default function AutoGtmSidebar({
  currentPhase = '',
  completedSteps = [],
  companyData = null,
  competitors: rawCompetitors = null,
  campaigns: rawCampaigns = null,
  segments: rawSegments = null,
  activeSegment = null,
  onSelectSegment = null,
  onRestart = null,
  userEmail = 'gmalavaes@gmail.com',
  activeAgentStep = null,
  activeAgentItems = []
}) {
  const { navigate } = useNavigation();
  const [collapsed, setCollapsed] = useState(false);
  const [isPrimkeetOpen, setIsPrimkeetOpen] = useState(true);
  const [showMoreCompetitors, setShowMoreCompetitors] = useState(false);

  // 1. Inspect runtime shapes
  const rawCampaignSource = rawCampaigns ?? rawSegments ?? companyData?.segments;
  console.log('AutoGtmSidebar campaign source:', rawCampaignSource);
  console.log('isArray:', Array.isArray(rawCampaignSource));
  console.log('type:', typeof rawCampaignSource);

  const rawCompetitorSource = rawCompetitors ?? companyData?.competitors;

  // 2. Guarantee normalized array contracts
  const normalizedCampaigns = normalizeSegments(rawCampaignSource);
  const campaigns = normalizedCampaigns.length > 0 ? normalizedCampaigns : DEFAULT_CAMPAIGNS;

  const normalizedCompetitors = normalizeCompetitors(rawCompetitorSource);
  const competitors = normalizedCompetitors.length > 0 ? normalizedCompetitors : DEFAULT_COMPETITORS;

  // Helper to determine which step has completed or is active
  const hasStep1Done = completedSteps.includes(1);
  const hasStep2Done = completedSteps.includes(2);
  const hasStep3Done = completedSteps.includes(3);
  const hasStep4Done = completedSteps.includes(4);
  const hasStep5Done = completedSteps.includes(5);
  const hasStep6Done = completedSteps.includes(6);

  // Email initial for avatar
  const initial = (userEmail ? userEmail.charAt(0) : 'G').toUpperCase();

  const displayedCompetitors = showMoreCompetitors ? competitors : competitors.slice(0, 8);

  return (
    <aside
      className={`h-screen bg-white border-r border-black/[0.08] flex flex-col justify-between transition-all duration-200 select-none z-20 shrink-0 ${
        collapsed ? 'w-[68px]' : 'w-[280px] lg:w-[300px]'
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col border-b border-black/[0.06] shrink-0">
        <div className="flex items-center justify-between px-3.5 py-3 h-14">
          <a
            href="/app-auto-gtm"
            onClick={(e) => {
              e.preventDefault();
              if (onRestart) onRestart();
              else navigate(PRODUCT_ROUTES.AUTO_GTM || '/app-auto-gtm');
            }}
            aria-label="Explee home"
            className="inline-flex items-center gap-2 no-underline text-foreground group"
          >
            {/* Pixel-perfect Explee SVG brand logo */}
            <svg
              width="71"
              height="20"
              viewBox="0 0 100 28"
              fill="none"
              className="text-[#0a0a0a]"
              aria-label="Explee"
            >
              <rect y="16" width="12" height="6" transform="rotate(-90 0 16)" fill="currentColor" fillOpacity="0.48" />
              <rect x="6" y="22" width="6" height="12" transform="rotate(-90 6 22)" fill="currentColor" fillOpacity="0.48" />
              <rect x="12" y="10" width="6" height="6" transform="rotate(-90 12 10)" fill="#00FBBC" />
              <path
                d="M25.2 15.88C25.2 12.016 27.504 9.832 30.912 9.832C34.44 9.832 36.744 11.968 36.744 15.664V16.432H27.264C27.336 18.76 28.56 20.536 31.032 20.536C33.072 20.536 34.272 19.48 34.68 17.824H36.792C36.312 20.032 34.728 22.24 31.056 22.24C27.168 22.24 25.2 19.408 25.2 15.88ZM27.288 14.92H34.656C34.512 12.76 33.048 11.512 30.912 11.512C28.944 11.512 27.456 12.76 27.288 14.92ZM37.1261 22L41.1581 16L37.1261 10.072H39.5501L42.9581 15.184H43.3901L46.7981 10.072H49.2221L45.2141 16L49.2221 22H46.7981L43.3901 16.888H42.9581L39.5501 22H37.1261ZM50.9587 26.656V10.072H53.0947V11.728L52.7347 13.144H53.3347C53.8387 11.296 55.3988 9.832 58.1347 9.832C61.6147 9.832 63.7987 12.496 63.7987 16.048C63.7987 19.552 61.6147 22.24 58.1347 22.24C55.3988 22.24 53.8387 20.752 53.3347 18.904H52.7347L53.0947 20.344V26.656H50.9587ZM53.0947 16.048C53.0947 19.12 55.0387 20.416 57.4627 20.416C59.9107 20.416 61.6867 19.072 61.6867 16.048C61.6867 13 59.9107 11.656 57.4627 11.656C55.0387 11.656 53.0947 12.952 53.0947 16.048ZM64.3089 22V20.176H67.6449V6.184H65.1489V4.36H68.5329C69.3249 4.36 69.7809 4.768 69.7809 5.56V20.176H73.1169V22H64.3089ZM73.7653 15.88C73.7653 12.016 76.0693 9.832 79.4773 9.832C83.0053 9.832 85.3093 11.968 85.3093 15.664V16.432H75.8293C75.9013 18.76 77.1253 20.536 79.5973 20.536C81.6373 20.536 82.8373 19.48 83.2453 17.824H85.3573C84.8773 20.032 83.2933 22.24 79.6213 22.24C75.7333 22.24 73.7653 19.408 73.7653 15.88ZM75.8533 14.92H83.2213C83.0773 12.76 81.6133 11.512 79.4773 11.512C77.5093 11.512 76.0213 12.76 75.8533 14.92ZM87.1078 15.88C87.1078 12.016 89.4118 9.832 92.8198 9.832C96.3478 9.832 98.6518 11.968 98.6518 15.664V16.432H89.1718C89.2438 18.76 90.4678 20.536 92.9398 20.536C94.9798 20.536 96.1798 19.48 96.5878 17.824H98.6998C98.2198 20.032 96.6358 22.24 92.9638 22.24C89.0758 22.24 87.1078 19.408 87.1078 15.88ZM89.1958 14.92H96.5638C96.4198 12.76 94.9558 11.512 92.8198 11.512C90.8518 11.512 89.3638 12.76 89.1958 14.92Z"
                fill="currentColor"
              />
            </svg>
          </a>

          {/* Toggle sidebar button */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-400 hover:text-gray-700 hover:bg-black/[0.04] transition-colors"
            title="Toggle Sidebar"
          >
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
              className="lucide lucide-panel-left"
            >
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <path d="M9 3v18"></path>
            </svg>
          </button>
        </div>

        {/* Project Selector Trigger */}
        {!collapsed && (
          <div className="px-3 pb-2.5">
            <button
              type="button"
              className="w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm font-medium text-gray-800 hover:bg-black/[0.04] transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400 group-hover:text-gray-600 shrink-0"
                >
                  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                </svg>
                <span className="truncate font-semibold text-gray-800 text-[13px]">
                  {companyData?.name || 'Select project'}
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 shrink-0"
              >
                <path d="m7 15 5 5 5-5"></path>
                <path d="m7 9 5-5 5 5"></path>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Middle Scrollable Section: Completed Steps Summary */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs scrollbar-slim">
        {!collapsed && (
          <>
            {/* Step 1 Summary */}
            {hasStep1Done && (
              <div className="space-y-1.5 animate-slide-up">
                <div className="text-[11px] font-mono text-gray-400 tracking-tight flex items-center gap-1.5">
                  <span className="text-gray-400">✓</span>
                  <span>step 1 · Research your company</span>
                </div>

                {/* Collapsible PrimKeet Box */}
                <div className="rounded-lg border border-black/[0.08] bg-[#fafafa] p-2.5 space-y-2">
                  <button
                    type="button"
                    onClick={() => setIsPrimkeetOpen(!isPrimkeetOpen)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="size-5 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {companyData?.name ? companyData.name.charAt(0) : 'K'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-[12px] truncate">
                          {companyData?.name || 'PrimKeet'}
                        </div>
                        <div className="text-gray-400 text-[10px] truncate">
                          {companyData?.domain || 'keethub.lovable.app'}
                        </div>
                      </div>
                    </div>
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
                      className={`text-gray-400 transition-transform ${isPrimkeetOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </button>

                  {isPrimkeetOpen && (
                    <p className="text-[11px] text-gray-600 leading-relaxed pt-1 border-t border-black/[0.04]">
                      {companyData?.description ||
                        'PrimKeet is an English learning platform that teaches vocabulary, speaking, reading, and grammar through games designed for ESL learners. Users practice by playing games, earning points and badges, and competing on leaderboards.'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 Summary: Competitors */}
            {hasStep2Done && (
              <div className="space-y-2 pt-2 border-t border-black/[0.06] animate-slide-up">
                <div className="text-[11px] font-mono text-gray-400 tracking-tight flex items-center gap-1.5">
                  <span className="text-gray-400">✓</span>
                  <span>step 2 · Explore competitors</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                    <span>COMPETITORS {competitors.length}</span>
                    <button type="button" className="text-gray-400 hover:text-gray-600">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                    </button>
                  </div>

                  {/* 2-column grid of competitors with external link */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {displayedCompetitors.map((comp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-md bg-[#f8fafc] border border-black/[0.04] px-2 py-1 text-[11px] text-gray-700 truncate"
                      >
                        <span className="truncate">{comp.domain}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-400 shrink-0 ml-1"
                        >
                          <path d="M15 3h6v6"></path>
                          <path d="M10 14 21 3"></path>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        </svg>
                      </div>
                    ))}
                  </div>

                  {competitors.length > 8 && (
                    <button
                      type="button"
                      onClick={() => setShowMoreCompetitors(!showMoreCompetitors)}
                      className="text-[11px] text-gray-500 hover:text-gray-800 font-medium pt-0.5 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{showMoreCompetitors ? 'Show less' : `+${competitors.length - 8} more`}</span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={showMoreCompetitors ? 'rotate-180' : ''}
                      >
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3 Summary: Campaigns */}
            {hasStep3Done && (
              <div className="space-y-2 pt-2 border-t border-black/[0.06] animate-slide-up">
                <div className="text-[11px] font-mono text-gray-400 tracking-tight flex items-center gap-1.5">
                  <span className="text-gray-400">✓</span>
                  <span>step 3 · Define campaigns</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                    <span>CAMPAIGNS {campaigns.length}</span>
                    <button type="button" className="text-gray-400 hover:text-gray-600">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-1">
                    {campaigns.map((seg, idx) => {
                      const isSelected = activeSegment ? activeSegment.id === seg.id : idx === 0;
                      return (
                        <button
                          key={seg.id || idx}
                          type="button"
                          onClick={() => onSelectSegment && onSelectSegment(seg)}
                          className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-white border border-black/15 font-semibold text-gray-900 shadow-2xs'
                              : 'text-gray-600 hover:bg-black/[0.02]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-gray-400 shrink-0 text-xs">
                              {seg.icon === 'graduation-cap' && '🎓'}
                              {seg.icon === 'building' && '🏛️'}
                              {seg.icon === 'users' && '👥'}
                              {seg.icon === 'home' && '🏠'}
                              {seg.icon === 'clock' && '🕒'}
                              {seg.icon === 'baby' && '👶'}
                              {seg.icon === 'briefcase' && '💼'}
                              {seg.icon === 'building-2' && '🏢'}
                              {!['graduation-cap','building','users','home','clock','baby','briefcase','building-2'].includes(seg.icon) && '🏷️'}
                            </span>
                            <span className="text-[12px] truncate">{seg.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            {isSelected && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-500">
                                <circle cx="12" cy="12" r="10" />
                                <path d="m9 12 2 2 4-4" />
                              </svg>
                            )}
                            <span className="text-[11px] text-gray-500 font-mono">
                              {seg.count || `${seg.percentage || 10}%`}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 Summary */}
            {hasStep4Done && (
              <div className="pt-2 border-t border-black/[0.06] animate-slide-up">
                <div className="text-[11px] font-mono text-gray-400 tracking-tight flex items-center gap-1.5">
                  <span className="text-gray-400">✓</span>
                  <span>step 4 · Find potential customers</span>
                </div>
              </div>
            )}

            {/* Step 5 Summary */}
            {hasStep5Done && (
              <div className="pt-2 border-t border-black/[0.06] animate-slide-up">
                <div className="text-[11px] font-mono text-gray-400 tracking-tight flex items-center gap-1.5">
                  <span className="text-gray-400">✓</span>
                  <span>step 5 · Find decision makers</span>
                </div>
              </div>
            )}

            {/* Step 6 Summary */}
            {hasStep6Done && (
              <div className="pt-2 border-t border-black/[0.06] animate-slide-up">
                <div className="text-[11px] font-mono text-gray-400 tracking-tight flex items-center gap-1.5">
                  <span className="text-gray-400">✓</span>
                  <span>step 6 · Write emails</span>
                </div>
              </div>
            )}

            {/* Live Agent Activity Feed in Sidebar */}
            {activeAgentStep && activeAgentItems && activeAgentItems.length > 0 && (
              <div className="pt-2 border-t border-black/[0.06] animate-slide-up">
                <AgentActivityFeed
                  step={activeAgentStep}
                  totalSteps={6}
                  items={activeAgentItems}
                  companyDomain={companyData?.domain}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-3 border-t border-black/[0.08] shrink-0">
        <button
          type="button"
          className="w-full flex items-center justify-between rounded-lg p-1.5 text-left hover:bg-black/[0.04] transition-colors group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-6 rounded-full bg-black/10 text-gray-800 flex items-center justify-center font-bold text-xs shrink-0">
              {initial}
            </div>
            {!collapsed && (
              <div className="min-w-0 truncate">
                <div className="truncate text-xs font-normal text-gray-700">{userEmail}</div>
              </div>
            )}
          </div>
          {!collapsed && (
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
              className="text-gray-400 shrink-0"
            >
              <path d="m7 15 5 5 5-5"></path>
              <path d="m7 9 5-5 5 5"></path>
            </svg>
          )}
        </button>
      </div>
    </aside>
  );
}
