import React from 'react';

const STEPS = [
  { step: 1, label: 'Research your company' },
  { step: 2, label: 'Explore competitors' },
  { step: 3, label: 'Define campaigns' },
  { step: 4, label: 'Find potential customers' },
  { step: 5, label: 'Find decision makers' },
  { step: 6, label: 'Write emails' },
];

export default function AutoGtmRail({ currentStep = 1, onStepClick }) {
  return (
    <>
    <nav
      aria-label="Workflow progress"
      className="w-full max-w-4xl mx-auto px-4 py-4 flex shrink-0 items-center justify-between relative"
    >
      {/* Background horizontal connecting line */}
      <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[1px] bg-black/[0.08] -z-0 pointer-events-none" />

      {STEPS.map((s) => {
        const isCompleted = s.step < currentStep;
        const isActive = s.step === currentStep;
        const isPending = s.step > currentStep;

        if (isActive) {
          return (
            <div
              key={s.step}
              aria-current="step"
              aria-label={`Step ${s.step}: ${s.label}`}
              className="z-10 size-9 shrink-0 bg-white border border-black/15 shadow-xs rounded-full flex items-center justify-center gap-2 animate-card-enter transition-all sm:h-auto sm:w-auto sm:px-3.5 sm:py-1.5"
            >
              {/* Green pulsing dot */}
              <span className="hidden size-2 rounded-full bg-[#10b981] animate-pulse-dot sm:block" />
              <span className="text-[13px] font-semibold text-gray-900 tracking-tight whitespace-nowrap">
                {s.step}<span className="hidden sm:inline"> {s.label}</span>
              </span>
            </div>
          );
        }

        if (isCompleted) {
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => onStepClick && onStepClick(s.step)}
              className="z-10 size-9 shrink-0 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-xs hover:scale-105 transition-all cursor-pointer sm:size-7"
              title={`Step ${s.step}: ${s.label}`}
            >
              {s.step}
            </button>
          );
        }

        // Pending
        return (
          <div
            key={s.step}
            className="z-10 size-9 shrink-0 rounded-full bg-white border border-black/20 text-gray-400 flex items-center justify-center font-medium text-xs shadow-2xs sm:size-7"
          >
            {s.step}
          </div>
        );
      })}
    </nav>
    <p className="px-4 pb-3 text-center text-xs font-medium text-gray-600 sm:hidden">
      Step {currentStep} of {STEPS.length} · {STEPS.find((step) => step.step === currentStep)?.label}
    </p>
    </>
  );
}
