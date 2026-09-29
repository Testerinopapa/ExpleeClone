import React from 'react';

const logosRow1 = [
  { name: 'maildoso', type: 'svg', content: (
    <span className="font-bold text-lg tracking-tight text-white/70 hover:text-white transition-colors flex items-center gap-1.5 font-sans">
      <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
      maildoso
    </span>
  )},
  { name: 'AMPLIXITY', type: 'text', content: (
    <span className="font-extrabold text-sm tracking-widest uppercase text-white/70 hover:text-white transition-colors">
      AMPLIXITY
    </span>
  )},
  { name: 'apifdf', type: 'file', src: '/apifdf.svg', alt: 'apifdf' },
  { name: 'SLSBMB', type: 'text', content: (
    <span className="font-black text-base tracking-wider text-white/70 hover:text-white transition-colors">
      SLSBMB
    </span>
  )},
  { name: 'vivid', type: 'file', src: '/vivid.svg', alt: 'vivid' },
  { name: 'INXY Payments', type: 'text', content: (
    <span className="font-bold text-sm tracking-wide text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
      <span className="inline-block w-4 h-4 rounded-full border-2 border-white/70"></span>
      INXY <span className="font-normal text-xs text-white/50">Payments</span>
    </span>
  )},
];

const logosRow2 = [
  { name: 'ARIVAL', type: 'text', content: (
    <span className="font-extrabold text-base tracking-wider text-white/70 hover:text-white transition-colors">
      ARIVAL
    </span>
  )},
  { name: 'BrandsDistribution', type: 'text', content: (
    <span className="font-semibold text-sm tracking-tight text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
      <span className="inline-block w-2.5 h-3 bg-white/70 rounded-sm"></span>
      BrandsDistribution
    </span>
  )},
  { name: 'Stayf', type: 'file', src: '/stayf.svg', alt: 'Stayf' },
  { name: 'Seonity', type: 'file', src: '/seonity.svg', alt: 'Seonity' },
  { name: '4dev.com', type: 'text', content: (
    <span className="font-bold text-sm tracking-wide text-white/70 hover:text-white transition-colors">
      4dev.com
    </span>
  )},
];

export default function GMLogosSection() {
  return (
    <section className="text-center mb-24">
      <div className="container mx-auto max-w-[1200px] px-4">
        {/* G2 Rating */}
        <a
          href="/r/g2"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-block hover:opacity-80 transition-opacity mb-8"
        >
          <img
            src="/static/images/g2-rating.svg"
            alt="G2 5.0 Rating"
            className="h-8 mx-auto"
          />
        </a>

        {/* Subtitle */}
        <p className="text-sm text-[#9ca3af] mb-8 font-medium">
          Trusted by 100+ GTM, Location Intelligence, and AI leaders
        </p>

        {/* Logo Rows */}
        <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
          {/* Row 1 */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-80 hover:opacity-100 transition-opacity">
            {logosRow1.map((logo, idx) => (
              <div key={idx} className="flex items-center justify-center h-8">
                {logo.type === 'file' ? (
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-6 md:h-7 w-auto object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                  />
                ) : (
                  logo.content
                )}
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-80 hover:opacity-100 transition-opacity">
            {logosRow2.map((logo, idx) => (
              <div key={idx} className="flex items-center justify-center h-8">
                {logo.type === 'file' ? (
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-6 md:h-7 w-auto object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                  />
                ) : (
                  logo.content
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
