import React, { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import AutoGtmSidebar from './AutoGtmSidebar';
import CrispChatWidget from './CrispChatWidget';

export default function AppAutoGtmPage() {
  const { navigate } = useNavigation();
  const [domain, setDomain] = useState('keethub.lovable.app');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!cleanDomain) {
      setError('Please enter a valid website domain');
      return;
    }

    // Navigate to workflow explore route
    navigate(`/auto-gtm/company/${cleanDomain}/explore?src=cabinet&phase=research_company_loading`);
  };

  return (
    <div className="flex h-screen w-full bg-white text-[#0a0a0a] overflow-hidden font-sans">
      {/* Sidebar */}
      <AutoGtmSidebar
        completedSteps={[]}
        userEmail={localStorage.getItem('auth_email') || 'gmalavaes@gmail.com'}
      />

      {/* Main Area */}
      <main className="flex-1 overflow-auto min-w-0 bg-white [scrollbar-gutter:stable] relative flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[560px] flex flex-col justify-center px-4 py-12 animate-card-enter">
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
            Your AI go-to-market agent. Enter your company website and we'll spin up your project — research, campaigns and outreach, all set up for you.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-7">
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <input
                id="company-domain-input"
                type="text"
                placeholder="Your company website"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  if (error) setError('');
                }}
                className="flex-1 h-10 px-3.5 rounded-lg border border-black/15 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0d9467] focus:ring-1 focus:ring-[#0d9467] transition-all shadow-2xs"
              />

              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-[#0d9467] hover:bg-[#0a7854] active:scale-[0.98] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
              >
                <span>Create my project</span>
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
              <p className="mt-2 text-xs text-red-500">{error}</p>
            )}
          </form>

          {/* 3 Feature Cards */}
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
                  Pull your positioning and map the market in seconds.
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
                  We build targeted campaigns
                </div>
                <div className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                  Ready-made segments of the customers worth reaching.
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
                  We reach out for you
                </div>
                <div className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                  Personalized emails to the right people, sent for you.
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
