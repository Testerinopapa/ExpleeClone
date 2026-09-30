import React from 'react';

export default function Step1CompanyCard({ company, onNext }) {
  const name = company?.name || 'PrimKeet';
  const domain = company?.domain || 'keethub.lovable.app';
  const description =
    company?.description ||
    'PrimKeet is an English learning platform that teaches vocabulary, speaking, reading, and grammar through games designed for ESL learners. Users practice by playing games, earning points and badges, and competing on leaderboards.';
  const initial = name ? name.charAt(0).toUpperCase() : 'K';

  return (
    <div className="w-full max-w-xl mx-auto mt-12 bg-white rounded-2xl border border-black/[0.08] p-6 shadow-sm animate-card-enter">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="size-11 rounded-full bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center font-bold text-base shrink-0">
            {initial}
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">{name}</h2>
            <p className="text-xs text-gray-500 font-mono">{domain}</p>
          </div>
        </div>

        {/* Found Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-md bg-black/[0.02] border border-black/[0.08] px-2.5 py-1 text-xs font-medium text-gray-700 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-600"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Found</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed pt-2 border-t border-black/[0.04]">
        {description}
      </p>

      {/* Optional Next Step Trigger */}
      {onNext && (
        <div className="mt-5 pt-3 border-t border-black/[0.04] flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0d9467] hover:text-[#096647] transition-colors"
          >
            <span>Continue to competitors</span>
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
