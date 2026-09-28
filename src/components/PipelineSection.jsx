import React, { useState, useEffect } from 'react';
import { LoaderCircle, Check } from 'lucide-react';

const COMPETITORS = [
  { domain: 'afloral.com', favicon: '/assets/favicon_afloral.com.png' },
  { domain: 'nearlynatural.com', favicon: '/assets/favicon_nearlynatural.com.png' },
  { domain: 'silksareforever.com', favicon: '/assets/favicon_silksareforever.com.png' },
  { domain: 'floralsupply.com', favicon: '/assets/favicon_floralsupply.com.png' },
  { domain: 'hobbylobby.com', favicon: '/assets/favicon_hobbylobby.com.png' }
];

export default function PipelineSection() {
  const [activeCompetitorIndex, setActiveCompetitorIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCompetitorIndex((prev) => (prev + 1) % COMPETITORS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="pipeline" className="mb-24 md:mb-32">
      <div>
        <div aria-hidden="true" style={{ height: 0 }} />
        <div className="use-case-stack max-w-[1200px] mx-auto px-4">
          {/* Header sticky wrapper */}
          <div className="text-center max-w-2xl mx-auto mb-10 sticky top-[72px] z-20 py-4 bg-background/90 backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-normal text-foreground">
              We run the entire pipeline
            </h2>
          </div>

          <div aria-hidden="true" className="mb-6 md:mb-12" />

          {/* Card 1: Learns what you sell */}
          <div
            className="use-case-sticky-wrap sticky"
            style={{ top: '140px', zIndex: 1 }}
          >
            <div className="use-case-card use-case-card--bleed border border-border/40">
              <div className="use-case-card-inner">
                <div className="use-case-text">
                  <h2 className="text-foreground">Learns what you sell</h2>
                </div>
                <div className="use-case-illustration" data-nosnippet="">
                  <div className="use-case-bleed-preview">
                    <div className="w-full glass-edge rounded-xl bg-chip px-4 divide-y divide-border border border-border/40">
                      <div className="py-4">
                        <div className="text-base font-medium text-foreground mb-1">
                          larksilk.com
                        </div>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed !mb-0">
                          Wholesale silk flowers and greenery for hotels, restaurants &amp; florists, in business for 45+ years
                        </p>
                      </div>

                      <div className="py-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-4 h-4 flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                              <div className="w-[5px] h-[5px] bg-brand-500 rounded-[1px]" />
                              <div className="w-[5px] h-[5px] bg-muted-foreground/20 rounded-[1px]" />
                              <div className="w-[5px] h-[5px] bg-muted-foreground/20 rounded-[1px]" />
                              <div className="w-[5px] h-[5px] bg-muted-foreground/20 rounded-[1px]" />
                            </div>
                          </div>
                          <span className="text-sm md:text-base font-medium text-muted-foreground">
                            Explee agent is studying competitors…
                          </span>
                        </div>

                        <div className="flex flex-col gap-2">
                          {COMPETITORS.slice(0, 3).map((comp, idx) => (
                            <div
                              key={comp.domain}
                              className={`flex items-center gap-2.5 transition-all duration-300 ${
                                idx === activeCompetitorIndex % 3
                                  ? 'opacity-100 translate-x-0'
                                  : 'opacity-40 -translate-x-1'
                              }`}
                            >
                              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                                {idx === activeCompetitorIndex % 3 ? (
                                  <LoaderCircle className="w-3.5 h-3.5 animate-spin text-brand-600" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-muted-foreground/60" />
                                )}
                              </div>
                              <img
                                alt=""
                                className="rounded-full w-5 h-5 object-cover"
                                width="20"
                                height="20"
                                src={comp.favicon}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                              <span className="text-sm md:text-base text-foreground font-normal">
                                {comp.domain}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Figures out who buys it */}
          <div
            className="use-case-sticky-wrap sticky"
            style={{ top: '155px', zIndex: 2 }}
          >
            <div className="use-case-card use-case-card--bleed border border-border/40">
              <div className="use-case-card-inner">
                <div className="use-case-text">
                  <h2 className="text-foreground">Figures out who buys it</h2>
                </div>
                <div className="use-case-illustration" data-nosnippet="">
                  <div className="use-case-bleed-preview">
                    <div className="glass-window-inner w-full border border-border/40 rounded-xl overflow-hidden bg-card">
                      <div className="company-data-table-wrap !pt-0">
                        <table className="company-data-table company-data-table--lg">
                          <thead>
                            <tr>
                              <th>Clients</th>
                              <th>Fit score</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Event designers</td>
                              <td><span className="tabular-nums font-medium text-foreground">92%</span></td>
                            </tr>
                            <tr>
                              <td>Wedding floral studios</td>
                              <td><span className="tabular-nums font-medium text-foreground">88%</span></td>
                            </tr>
                            <tr>
                              <td>Wedding planners</td>
                              <td><span className="tabular-nums font-medium text-foreground">85%</span></td>
                            </tr>
                            <tr>
                              <td>Country clubs</td>
                              <td><span className="tabular-nums font-medium text-foreground">79%</span></td>
                            </tr>
                            <tr>
                              <td>Boutique hotels</td>
                              <td><span className="tabular-nums font-medium text-foreground">74%</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Finds those exact people */}
          <div
            className="use-case-sticky-wrap sticky"
            style={{ top: '170px', zIndex: 3 }}
          >
            <div className="use-case-card use-case-card--bleed border border-border/40">
              <div className="use-case-card-inner">
                <div className="use-case-text">
                  <h2 className="text-foreground">Finds those exact people</h2>
                </div>
                <div className="use-case-illustration" data-nosnippet="">
                  <div className="use-case-bleed-preview">
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { name: 'Rachel Whitfield', role: 'Owner · Sweet Pea Events', initials: 'RW' },
                        { name: 'Dana Okafor', role: 'Lead Designer · Tupelo Honey', initials: 'DO' },
                        { name: 'Mia Castellanos', role: 'Founder · The Bloom Lab', initials: 'MC' },
                        { name: 'Michelle Leo', role: 'Owner · Michelle Leo Events', initials: 'ML' },
                        { name: 'Priya Raman', role: 'Event Producer · Verde & Vine', initials: 'PR' },
                        { name: 'Jack Delaney', role: 'Owner · Delaney Floral Co.', initials: 'JD' }
                      ].map((contact) => (
                        <div key={contact.name} className="bg-chip rounded-xl p-3 min-w-0 border border-border/30">
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="w-7 h-7 rounded-full items-center justify-center text-xs font-semibold text-foreground bg-card shadow-sm flex-shrink-0 flex border border-border/30">
                              {contact.initials}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-foreground truncate">
                                {contact.name}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {contact.role}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground/70 truncate pl-9">
                            {contact.name.toLowerCase().replace(' ', '.')}@business.com
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Writes each a personal email */}
          <div
            className="use-case-sticky-wrap sticky"
            style={{ top: '185px', zIndex: 4 }}
          >
            <div className="use-case-card use-case-card--bleed border border-border/40">
              <div className="use-case-card-inner">
                <div className="use-case-text">
                  <h2 className="text-foreground">Writes each a personal email</h2>
                </div>
                <div className="use-case-illustration" data-nosnippet="">
                  <div className="use-case-bleed-preview">
                    <div className="glass-window-inner w-full border border-border/40 rounded-xl overflow-hidden bg-card shadow-sm">
                      <div className="grid grid-cols-[auto_1fr] gap-x-3 px-4 py-2.5 border-b border-border bg-chip/40 text-sm">
                        <span className="text-muted-foreground font-medium">Subject</span>
                        <span className="font-medium text-foreground">
                          Larksilk x Tupelo Honey Flower
                        </span>
                      </div>
                      <div className="px-5 pt-4 pb-5 text-sm md:text-base text-muted-foreground leading-relaxed">
                        Hi there,<br /><br />
                        Saw{' '}
                        <span className="text-foreground bg-chip px-1 py-0.5 rounded border-b border-border font-medium">
                          Tupelo Honey Flower designs full-scale event installs
                        </span>
                        . At that pace, fresh florals get expensive fast and wilt under venue lights. Larksilk ships premium silk by the box from NJ, so one buy carries across events.<br /><br />
                        Want a sample box to compare against your last fresh order?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Handles replies and books meetings */}
          <div
            className="use-case-sticky-wrap sticky"
            style={{ top: '200px', zIndex: 5 }}
          >
            <div className="use-case-card border border-border/40">
              <div className="use-case-card-inner">
                <div className="use-case-text">
                  <h2 className="text-foreground">Handles replies and books meetings</h2>
                </div>
                <div className="use-case-illustration" data-nosnippet="">
                  <div className="w-full">
                    <div className="w-full flex flex-col gap-2.5 max-w-[420px] mx-auto">
                      <div className="self-start max-w-[85%] bg-chip rounded-2xl rounded-bl-[4px] py-2 px-3.5 border border-border/30">
                        <span className="text-sm md:text-base text-foreground">
                          How do these hold up under venue lighting?
                        </span>
                      </div>
                      <div className="self-start max-w-[85%] bg-chip rounded-2xl rounded-bl-[4px] py-2 px-3.5 border border-border/30">
                        <span className="text-sm md:text-base text-foreground">
                          Interesting, can you do Tuesday 2pm?
                        </span>
                      </div>
                      <div className="self-end max-w-full md:max-w-[90%] flex flex-col gap-2 bg-chip rounded-2xl rounded-br-[4px] pt-2.5 pb-3 px-3.5 border border-border/30">
                        <span className="text-sm md:text-base text-foreground">
                          Tuesday 2pm works, sending the invite now.
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs md:text-sm font-medium whitespace-nowrap text-foreground bg-card shadow-xs self-start border border-border/40">
                          <Check className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                          Demo booked · Tue 14:00
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: Learns what works and doubles down */}
          <div
            className="use-case-sticky-wrap sticky"
            style={{ top: '215px', zIndex: 6 }}
          >
            <div className="use-case-card use-case-card--bleed border border-border/40">
              <div className="use-case-card-inner">
                <div className="use-case-text">
                  <h2 className="text-foreground">Learns what works and doubles down</h2>
                </div>
                <div className="use-case-illustration" data-nosnippet="">
                  <div className="use-case-bleed-preview">
                    <div className="glass-window-inner w-full border border-border/40 rounded-xl overflow-hidden bg-card">
                      <div className="company-data-table-wrap !pt-0">
                        <table className="company-data-table company-data-table--lg company-data-table--status-left">
                          <thead>
                            <tr>
                              <th>Campaign</th>
                              <th>Status</th>
                              <th>Cost/lead</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Event designers</td>
                              <td>
                                <span className="inline-flex items-center gap-2 text-foreground font-medium">
                                  Scaling
                                  <span className="status-pulse inline-block w-[6px] h-[6px] rounded-full bg-brand-500" />
                                </span>
                              </td>
                              <td className="font-medium text-foreground">$1.69</td>
                            </tr>
                            <tr>
                              <td>Wedding floral studios</td>
                              <td>
                                <span className="inline-flex items-center gap-2 text-foreground font-medium">
                                  Scaling
                                  <span className="status-pulse inline-block w-[6px] h-[6px] rounded-full bg-brand-500" />
                                </span>
                              </td>
                              <td className="font-medium text-foreground">$1.87</td>
                            </tr>
                            <tr>
                              <td>Wedding planners</td>
                              <td>
                                <span className="inline-flex items-center gap-2 text-foreground font-medium">
                                  Working
                                  <span className="status-pulse inline-block w-[6px] h-[6px] rounded-full bg-brand-500" />
                                </span>
                              </td>
                              <td className="font-medium text-foreground">$2.02</td>
                            </tr>
                            <tr className="row-dim">
                              <td>Houses of worship</td>
                              <td>
                                <span className="inline-flex items-center gap-2 text-muted-foreground">
                                  Paused
                                </span>
                              </td>
                              <td>$6.33</td>
                            </tr>
                            <tr className="row-dim">
                              <td>Property management</td>
                              <td>
                                <span className="inline-flex items-center gap-2 text-muted-foreground">
                                  Paused
                                </span>
                              </td>
                              <td>$5.80</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
