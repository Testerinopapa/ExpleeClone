import React from 'react';

export default function Step1CompanyCard({ company, onNext, nextPending = false }) {
  const name = company?.name || company?.domain || 'Company';
  const domain = company?.domain || '';
  const description =
    company?.description ||
    'No business description was found on the researched pages.';
  const initial = name ? name.charAt(0).toUpperCase() : 'K';

  return (
    <article aria-label="Saved company profile" className="w-full min-w-0 max-w-xl mx-auto mt-12 bg-white rounded-2xl border border-black/[0.08] p-6 shadow-sm animate-card-enter">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="size-11 rounded-full bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center font-bold text-base shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <h2 className="break-words text-base font-bold text-gray-900 tracking-tight">{name}</h2>
            <p className="break-all text-xs text-gray-500 font-mono">{domain}</p>
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
      <p className="break-words whitespace-pre-line text-sm text-gray-600 leading-relaxed pt-2 border-t border-black/[0.04]">
        {description}
      </p>
      {company?.warnings?.map(warning => <p key={warning} role="status" className="mt-3 break-words text-xs text-amber-800">{warning}</p>)}

      {/* Optional Next Step Trigger */}
      {(onNext || nextPending) && (
        <div className="mt-5 pt-3 border-t border-black/[0.04] flex justify-end">
          <button
            type="button"
            onClick={onNext}
            disabled={nextPending}
            title={nextPending ? 'Competitor research is not connected yet.' : undefined}
            className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-[#0d9467] hover:text-[#096647] transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0"
          >
            <span>Continue to competitors</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>
      )}
    </article>
  );
}
