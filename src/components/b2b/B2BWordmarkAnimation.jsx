import React from 'react';

export default function B2BWordmarkAnimation() {
  return (
    <>
      {/* Spacer that pushes page scroll so the fixed bottom wordmark is revealed */}
      <div className="wordmark-reveal-spacer" />

      {/* Fixed bottom container for the glowing dot matrix Explee animation */}
      <div className="wordmark-fixed-bottom pointer-events-none">
        <div className="wordmark-grid-wrap flex items-center justify-center w-full max-w-[1200px] mx-auto overflow-hidden px-4">
          <video
            src="/assets/explee-footer-animation-10sec.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-contain select-none opacity-90"
          />
        </div>
      </div>
    </>
  );
}
