import React, { useRef, useState, useEffect } from 'react';

const sources = [
  {
    icon: (
      <div className="p-2 bg-blue-500 rounded-full flex items-center justify-center">
        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </div>
    ),
    value: "310M",
    label: "company websites",
  },
  {
    icon: (
      <div className="h-10 w-[42px] overflow-hidden flex-shrink-0">
        <img
          src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg"
          alt="LinkedIn"
          className="h-10 w-auto min-w-[48px]"
        />
      </div>
    ),
    value: "74M",
    label: "LinkedIn company profiles",
  },
  {
    icon: (
      <img
        src="https://www.gstatic.com/images/branding/product/2x/maps_96dp.png"
        alt="Google Maps"
        className="w-10 h-10"
      />
    ),
    value: "210M",
    label: "Google Maps places",
  },
  {
    icon: (
      <div className="p-2 bg-gray-500 rounded-full flex items-center justify-center">
        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v1h20V7L12 2zM4 10v10h3V10H4zm6 0v10h4V10h-4zm7 0v10h3V10h-3zM2 22h20v-2H2v2z" />
        </svg>
      </div>
    ),
    value: "100M+",
    label: "registry records",
  },
];

export default function B2BDataSourcesSection() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const height = el.offsetHeight;
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / (height - vh)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#090B0B]"
      style={{ height: '160vh' }}
    >
      <div className="sticky top-0 min-h-screen flex flex-col justify-center pt-16 pb-16">
        <div className="container mx-auto max-w-[1200px] px-4">
          <span className="block text-2xl md:text-3xl font-normal text-foreground tracking-[-0.02em] text-center mb-16">
            The first{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(0.283turn, rgba(5, 172, 130, 1) 0%, rgba(21, 173, 220, 1) 100%)',
              }}
            >
              all-in-one
            </span>{' '}
            company database
          </span>

          <div className="relative max-w-[1000px] mx-auto">
            {/* 4 Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-12">
              {sources.map((item, i) => {
                const m = scrollProgress;
                const n = Math.max(0, Math.min(1, (m - 0.4) / 0.08));
                const s = Math.max(0, (m - 0.48) / 0.52);
                const t = 10 * Math.sin(n * Math.PI);
                const r = [-120, -40, 40, 120][i] * s;

                const style = {
                  transform: `translate(${r}px, ${t + 80 * s}px) scale(${1 - 0.4 * s})`,
                  opacity: Math.max(0.1, 1 - 0.9 * s),
                  boxShadow: `0 ${10 + 10 * n}px ${20 + 20 * n}px rgba(34, 197, 94, ${
                    0.2 * n * (1 - s) + 0.15 * s
                  })`,
                  transition: 'transform 0.15s ease-out, opacity 0.15s ease-out, box-shadow 0.2s ease-out',
                };

                return (
                  <div
                    key={item.label}
                    className="text-center glass-window glass-window--inset"
                    style={style}
                  >
                    <div className="glass-window-inner p-5">
                      <div className="w-11 h-11 mx-auto mb-3 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div className="text-2xl font-bold text-white">{item.value}</div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ultimate Business Profile Card */}
            <div className="flex justify-center">
              {(() => {
                const m = scrollProgress;
                const s = Math.max(0, (m - 0.42) / 0.58);
                const ultimateStyle = {
                  transform: `translateY(${-(100 * s)}px) scale(${Math.min(1.1, 0.85 + 0.25 * s)})`,
                  opacity: Math.min(1, 0.2 + 0.8 * s),
                  boxShadow: `0 ${10 + 25 * s}px ${40 + 50 * s}px rgba(34, 197, 94, ${0.4 * s})`,
                  transition: 'transform 0.15s ease-out, opacity 0.15s ease-out, box-shadow 0.2s ease-out',
                  zIndex: 10,
                  position: 'relative',
                };

                return (
                  <div
                    className="max-w-[600px] text-center glass-window glass-window--inset"
                    style={ultimateStyle}
                  >
                    <div className="glass-window-inner p-8">
                      <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">
                        ✨ Ultimate Business Profile
                      </h3>
                      <p className="leading-relaxed mb-6 text-muted-foreground">
                        Reveals what{' '}
                        <span className="text-brand-400 font-medium">the company truly does</span>{' '}
                        — generated by
                        <br className="hidden md:block" />
                        deep-research AI agent analyzing at least 5 web pages,
                        <br className="hidden md:block" />
                        LinkedIn, Google Maps, and government registries data.
                      </p>
                      <a
                        className="gtm-demo-cta inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 text-black hover:shadow-[0_6px_16px_-6px_rgba(0,255,194,0.4)]"
                        href="https://explee.link/db-demo?utm_content=global"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="8" x2="16" y1="13" y2="13" />
                          <line x1="8" x2="16" y1="17" y2="17" />
                          <line x1="8" x2="10" y1="9" y2="9" />
                        </svg>
                        Request Data Sample
                      </a>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
