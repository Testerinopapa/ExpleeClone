import React from 'react';

export default function CompetitorSkeletonCard() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 bg-white rounded-2xl border border-black/[0.08] p-6 shadow-xs animate-card-enter">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Product & Queries */}
        <div className="space-y-4">
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              PRODUCT
            </div>
            {/* Pale gray product box */}
            <div className="bg-[#f8fafc] border border-black/[0.04] p-3 rounded-lg space-y-2">
              <div className="h-3.5 bg-gray-200/80 rounded w-4/5" />
              <div className="h-2.5 bg-gray-200/60 rounded w-full" />
            </div>

            <div className="mt-2.5 space-y-1.5 pl-1">
              <div className="h-2.5 bg-gray-200/60 rounded w-11/12" />
              <div className="h-2.5 bg-gray-200/50 rounded w-9/12" />
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              QUERIES
            </div>
            <div className="space-y-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-black/[0.06] bg-white px-3 py-2 shadow-2xs"
                >
                  <div className="size-3 rounded-full bg-gray-200/80 shrink-0" />
                  <div className="h-2.5 bg-gray-200/70 rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Competitors */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            <span>COMPETITORS</span>
            <div className="h-3 bg-gray-200/60 rounded w-16" />
          </div>

          <div className="space-y-1.5">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-[#f8fafc] border border-black/[0.04] px-3 py-2"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="size-4 rounded-full bg-gray-200/80 shrink-0" />
                  <div className="h-2.5 bg-gray-200/70 rounded w-28" />
                </div>
                <div className="size-3 rounded bg-gray-200/60 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
