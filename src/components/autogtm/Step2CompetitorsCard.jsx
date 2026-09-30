import React, { useState } from 'react';
import {
  normalizeDeterminants,
  normalizeSearchQueries,
  normalizeCompetitors,
} from '../../lib/autogtmNormalizer';

const FALLBACK_DETERMINANTS = [
  'Game-based English learning for ESL learners',
  'English-only ESL focus, not a multi-language app',
  'Vocabulary, speaking, reading, and grammar taught through games',
  'Indie platform built on Lovable (keethub.lovable.app)',
];

const FALLBACK_QUERIES = [
  'gamified English learning',
  'ESL learning games',
  'English vocabulary app',
];

const FALLBACK_COMPETITORS = [
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

export default function Step2CompetitorsCard({
  determinants = [],
  searchQueries = [],
  competitors = [],
  onNext = null,
}) {
  const [showAll, setShowAll] = useState(false);

  const normDets = normalizeDeterminants(determinants);
  const defaultDeterminants = normDets.length > 0 ? normDets : FALLBACK_DETERMINANTS;

  const normQueries = normalizeSearchQueries(searchQueries);
  const defaultQueries = normQueries.length > 0 ? normQueries : FALLBACK_QUERIES;

  const normComps = normalizeCompetitors(competitors);
  const defaultCompetitors = normComps.length > 0 ? normComps : FALLBACK_COMPETITORS;

  const displayedCompetitors = showAll ? defaultCompetitors : defaultCompetitors.slice(0, 12);
  const remainingCount = defaultCompetitors.length - 12;

  // Domain icons generator
  const getFavicon = (domain) => {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 bg-white rounded-2xl border border-black/[0.08] p-6 shadow-sm animate-card-enter">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Product & Queries */}
        <div className="space-y-4">
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              PRODUCT
            </div>
            <div className="bg-[#f8fafc] border border-black/[0.04] p-3 rounded-lg text-xs font-semibold text-gray-900 leading-snug">
              {defaultDeterminants[0]}
            </div>

            <div className="mt-2.5 space-y-1.5 pl-1">
              {defaultDeterminants.slice(1).map((det, idx) => (
                <div key={idx} className="text-xs text-gray-600 leading-relaxed">
                  {det}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              QUERIES
            </div>
            <div className="space-y-1.5">
              {defaultQueries.map((query, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-xs text-gray-700 shadow-2xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400 shrink-0"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                  <span className="truncate">{query}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Competitors */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              COMPETITORS
            </div>
            <div className="inline-flex items-center gap-1 rounded bg-black/[0.02] border border-black/[0.08] px-2 py-0.5 text-[11px] font-medium text-gray-700">
              <span className="text-gray-500">✓</span>
              <span>{defaultCompetitors.length} found</span>
            </div>
          </div>

          <div className="space-y-1">
            {displayedCompetitors.map((comp, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-md bg-[#f8fafc] border border-black/[0.04] px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <img
                  src={getFavicon(comp.domain)}
                  alt=""
                  className="size-3.5 rounded shrink-0 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="truncate text-xs font-mono">{comp.domain}</span>
              </div>
            ))}
          </div>

          {remainingCount > 0 && (
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-gray-500 hover:text-gray-900 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer py-1"
              >
                <span>{showAll ? 'Show less' : `+${remainingCount} more`}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={showAll ? 'rotate-180' : ''}
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {onNext && (
        <div className="mt-5 pt-3 border-t border-black/[0.04] flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0d9467] hover:text-[#096647] transition-colors"
          >
            <span>Continue to campaigns</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
