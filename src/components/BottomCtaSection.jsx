import React, { useState, useEffect } from 'react';
import FlowCanvas from './FlowCanvas';

export default function BottomCtaSection() {
  const [showSecond, setShowSecond] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setShowSecond((prev) => !prev);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleCtaClick = () => {
    const input = document.getElementById('hero-website-input');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus();
    }
  };

  return (
    <section id="cta-section" className="flex items-end justify-center mb-8 relative overflow-hidden pt-12">
      <div className="w-full">
        <div aria-hidden="true" style={{ height: 0 }} />
        <div className="flex flex-col items-center">
          {/* Animated Heading */}
          <div className="animated-heading-module___hYpyG__root mb-8 relative select-none">
            {/* Sentence 1 */}
            <span
              aria-hidden={showSecond}
              className="animated-heading-module___hYpyG__sentenceRow"
            >
              <span
                className="animated-heading-module___hYpyG__animatedWord font-light text-muted-foreground mr-3"
                data-animate="true"
                data-state={showSecond ? 'exit' : 'enter'}
                style={{ '--delay': '0s' }}
              >
                You’ve
              </span>
              <span
                className="animated-heading-module___hYpyG__animatedWord font-normal text-muted-foreground mr-3"
                data-animate="true"
                data-state={showSecond ? 'exit' : 'enter'}
                style={{ '--delay': '0.09s' }}
              >
                heard it
              </span>
              <span
                className="animated-heading-module___hYpyG__animatedWord font-medium text-foreground"
                data-animate="true"
                data-state={showSecond ? 'exit' : 'enter'}
                style={{ '--delay': '0.18s' }}
              >
                all before
              </span>
            </span>

            {/* Sentence 2 */}
            <span
              aria-hidden={!showSecond}
              className="animated-heading-module___hYpyG__sentenceRow"
            >
              <span
                className="animated-heading-module___hYpyG__animatedWord font-light text-muted-foreground/60 mr-3"
                data-animate="true"
                data-state={showSecond ? 'enter' : 'exit'}
                style={{ '--delay': '0s' }}
              >
                This
              </span>
              <span
                className="animated-heading-module___hYpyG__animatedWord font-normal text-muted-foreground mr-3"
                data-animate="true"
                data-state={showSecond ? 'enter' : 'exit'}
                style={{ '--delay': '0.09s' }}
              >
                one really
              </span>
              <span
                className="animated-heading-module___hYpyG__animatedWord font-semibold text-foreground"
                data-animate="true"
                data-state={showSecond ? 'enter' : 'exit'}
                style={{ '--delay': '0.18s' }}
              >
                works
              </span>
            </span>
          </div>

          {/* Button and background canvas streams */}
          <div className="relative inline-flex flex-col items-center">
            <button
              type="button"
              onClick={handleCtaClick}
              className="inline-block bg-primary text-primary-foreground font-medium px-8 py-3.5 rounded-xl transition-all duration-300 hover:scale-105 relative z-10 shadow-lg cursor-pointer text-base"
            >
              Get $30 in credits to try it
            </button>

            {/* Downward stream canvas effect */}
            <div
              className="relative pointer-events-none overflow-visible"
              style={{ width: '100vw', height: '18.75vw', minHeight: '180px' }}
            >
              <div
                className="-rotate-90 origin-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ width: '18.75vw', minWidth: '180px', height: '100vw' }}
              >
                <FlowCanvas
                  width={300}
                  height={800}
                  config={{ numPaths: 9, dotsPerPath: 4, speed: 0.6 }}
                  preserveAspectRatio="xMidYMid meet"
                  className="w-full h-full block"
                />
              </div>

              {/* Bottom gradient fade to match background */}
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                  height: '45%',
                  background: 'linear-gradient(to top, var(--background), transparent)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
