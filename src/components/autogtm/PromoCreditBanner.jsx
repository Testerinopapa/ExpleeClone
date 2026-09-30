import React from 'react';

export default function PromoCreditBanner({ onOpenTrialModal }) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-4 bg-white border border-black/[0.08] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-slide-up">
      <div className="flex items-center gap-3.5">
        <div className="size-10 rounded-lg bg-[#f8fafc] border border-black/[0.06] flex items-center justify-center shrink-0 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900 tracking-tight">
            $30 free credits — get new clients on autopilot
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            No upfront charge · 750 emails included · Start outbound in 60s
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenTrialModal}
        className="inline-flex items-center justify-center gap-1.5 bg-[#0d9467] hover:bg-[#0a7854] active:scale-[0.98] text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs cursor-pointer shrink-0"
      >
        <span>Start outreach for free</span>
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
  );
}
