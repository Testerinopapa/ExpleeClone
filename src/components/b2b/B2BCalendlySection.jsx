import React, { useEffect, useState } from 'react';

export default function B2BCalendlySection() {
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setCalendlyLoaded(true);
    document.body.appendChild(script);

    return () => {
      const existing = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existing) existing.remove();
    };
  }, []);

  return (
    <section className="pt-16 md:pt-20 pb-16 md:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* Left Column: Heading and description */}
        <div className="lg:col-span-2 lg:pt-8">
          <h2 className="text-4xl md:text-5xl font-normal text-foreground leading-tight mb-6 tracking-[-0.03em]">
            <span className="whitespace-nowrap">Explore the largest</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(0.283turn, rgba(5, 172, 130, 1) 0%, rgba(21, 173, 220, 1) 100%)',
              }}
            >
              company database
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Book a free demo and see how to reach
            <br />
            your entire addressable market.
          </p>
          <p className="text-lg text-muted-foreground">
            Access 105M+ global companies and
            <br />
            500M+ decision-maker profiles.
          </p>
        </div>

        {/* Right Column: Calendly inline widget */}
        <div className="lg:col-span-3 flex justify-end">
          <div className="glass-window glass-window--inset overflow-hidden w-full max-w-[480px]">
            <div className="glass-window-inner">
              <div
                className="calendly-inline-widget"
                data-url="https://calendly.com/d/cxfg-8zc-2vz/explee-b2b-database?hide_event_type_details=1&hide_gdpr_banner=1&utm_content=global&background_color=0a0c0c&text_color=ffffff&primary_color=05AC82"
                style={{
                  minWidth: '320px',
                  height: '580px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
