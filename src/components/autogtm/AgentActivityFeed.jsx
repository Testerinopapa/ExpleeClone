import React from 'react';

export default function AgentActivityFeed({
  step = 1,
  totalSteps = 6,
  items = [],
  companyDomain = 'keethub.lovable.app',
}) {
  return (
    <div className="w-full space-y-2 font-mono text-[11px] animate-slide-up select-none">
      {/* Header status */}
      <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[11px]">
        <span className="size-2 rounded-full bg-[#10b981] animate-pulse-dot shrink-0" />
        <span className="truncate">Explee agent is working on step {step} of {totalSteps}</span>
      </div>

      {/* Terminal log lines */}
      <div className="space-y-1.5 pl-3 border-l border-black/10 py-0.5">
        {items.map((item, idx) => {
          const isDone = item.status === 'done';
          const isActive = item.status === 'active';

          if (isDone) {
            return (
              <div key={idx} className="flex items-start gap-1.5 text-gray-400 font-mono text-[11px] leading-snug animate-row-enter">
                <span className="text-gray-400 select-none shrink-0">✓</span>
                <span className="break-words">{item.label}</span>
              </div>
            );
          }

          if (isActive) {
            return (
              <div key={idx} className="flex items-start gap-1.5 text-gray-900 font-medium font-mono text-[11px] leading-snug animate-row-enter">
                <span className="text-[#10b981] font-bold select-none shrink-0">›</span>
                <span className="break-words">
                  {item.label}
                  <span className="inline-block w-1.5 h-3 bg-gray-700 animate-caret-blink ml-1 align-middle" />
                </span>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
