import React, { useEffect, useState } from 'react';

export default function GMCalendlySection() {
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setCalendlyLoaded(true);
    document.body.appendChild(script);

    return () => {
      const existing = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      );
      if (existing) existing.remove();
    };
  }, []);

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 border-t border-white/[0.04]">
      <div className="container mx-auto max-w-[1200px] px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Left Column: Heading and description */}
          <div className="lg:col-span-2 lg:pt-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              <span className="whitespace-nowrap">Explore the largest</span>
              <br />
              <span className="gm-text-gradient">locations dataset</span>
            </h2>
            <p className="text-lg text-[#9ca3af] mb-4">
              Book a free demo and see how to reach your entire addressable market.
            </p>
            <p className="text-lg text-[#9ca3af]">
              Access 218M+ local businesses and detailed location profiles.
            </p>
          </div>

          {/* Right Column: Calendly inline widget */}
          <div className="lg:col-span-3 flex justify-end">
            <div className="bg-[#111414] rounded-2xl border border-white/[0.08] overflow-hidden w-full max-w-[480px] shadow-2xl">
              <div
                className="calendly-inline-widget w-full"
                data-url="https://calendly.com/d/cxfg-8zc-2vz/explee-b2b-database?hide_event_type_details=1&hide_gdpr_banner=1&utm_content=gm-dataset&background_color=0a0c0c&text_color=ffffff&primary_color=05AC82"
                style={{
                  minWidth: '320px',
                  height: '620px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                {/* Fallback iframe if script doesn't initialize immediately */}
                <iframe
                  src="https://calendly.com/d/cxfg-8zc-2vz/explee-b2b-database?embed_domain=explee.com&embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1&utm_content=gm-dataset&background_color=0a0c0c&text_color=ffffff&primary_color=05AC82"
                  title="Select a Date & Time - Calendly"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
