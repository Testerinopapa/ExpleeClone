import React from 'react';
import { normalizeSegments } from '../../lib/autogtmNormalizer';

export default function Step3CampaignsGrid({
  segments = [],
  onSelectSegment = null,
  activeSegmentId = null,
  onNext = null,
}) {
  const displaySegments = normalizeSegments(segments);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 space-y-4 animate-card-enter">
      {/* 2x2 Grid of Segments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displaySegments.map((seg, idx) => {
          const isSelected = activeSegmentId ? activeSegmentId === seg.id : idx === 0;
          const criteriaList = Array.isArray(seg.criteria) ? seg.criteria : [];
          const exampleClientsList = Array.isArray(seg.exampleClients)
            ? seg.exampleClients
            : Array.isArray(seg.example_clients)
            ? seg.example_clients
            : [];
          const useCaseText = seg.useCase || seg.use_case || seg.label;

          return (
            <div
              key={seg.id || idx}
              onClick={() => onSelectSegment && onSelectSegment(seg)}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-xs cursor-pointer relative ${
                isSelected
                  ? 'border-black/30 shadow-md ring-1 ring-black/10'
                  : 'border-black/[0.08] hover:border-black/20'
              }`}
            >
              {/* Header: Icon + Title + Count Arc */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-[#f8fafc] border border-black/[0.06] flex items-center justify-center text-gray-700">
                    {seg.icon === 'users' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    )}
                    {seg.icon === 'home' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    )}
                    {seg.icon === 'graduation-cap' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                        <path d="M22 10v6" />
                        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                      </svg>
                    )}
                    {seg.icon === 'building' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="16" height="20" x="4" y="2" rx="2" />
                        <path d="M9 22v-4h6v4" />
                        <path d="M8 6h.01" />
                        <path d="M16 6h.01" />
                        <path d="M8 10h.01" />
                        <path d="M16 10h.01" />
                        <path d="M8 14h.01" />
                        <path d="M16 14h.01" />
                      </svg>
                    )}
                    {seg.icon === 'briefcase' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="20" height="14" x="2" y="7" rx="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    )}
                    {seg.icon === 'baby' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="8" />
                        <circle cx="9" cy="10" r="1" />
                        <circle cx="15" cy="10" r="1" />
                        <path d="M9 15a3 3 0 0 0 6 0" />
                      </svg>
                    )}
                    {!['users','home','graduation-cap','building','briefcase','baby'].includes(seg.icon) && (
                      <span className="text-sm">🎯</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm tracking-tight">{seg.label}</h3>
                </div>

                {/* Circular Count indicator */}
                <div className="relative size-9 flex items-center justify-center">
                  <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-gray-500"
                      strokeDasharray={`${seg.percentage || seg.percent || 20}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-mono font-semibold text-gray-600">
                    {seg.count || `${seg.percentage || 10}K`}
                  </span>
                </div>
              </div>

              {/* Use case snippet */}
              <p className="text-xs text-gray-700 leading-relaxed mb-3">
                {useCaseText ? (
                  <span dangerouslySetInnerHTML={{ __html: useCaseText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ) : (
                  seg.label
                )}
              </p>

              {/* PAIN */}
              {seg.pain && (
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    PAIN
                  </span>
                  <p className="text-xs text-gray-600 leading-snug">{seg.pain}</p>
                </div>
              )}

              {/* CRITERIA */}
              {criteriaList.length > 0 && (
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    CRITERIA
                  </span>
                  <ul className="space-y-0.5 text-xs text-gray-600">
                    {criteriaList.map((crit, cIdx) => (
                      <li key={cIdx} className="flex items-center gap-1.5">
                        <span className="text-gray-400">•</span>
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Example clients */}
              {exampleClientsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-black/[0.04]">
                  {exampleClientsList.map((ex, eIdx) => (
                    <span
                      key={eIdx}
                      className="rounded bg-[#f8fafc] border border-black/[0.05] px-2 py-0.5 text-[10px] text-gray-600"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {onNext && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0d9467] hover:text-[#096647] transition-colors"
          >
            <span>Continue to find companies</span>
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
