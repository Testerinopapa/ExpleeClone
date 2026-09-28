import React, { useState } from 'react';
import { ArrowRight, HelpCircle, Send, Calendar, UserPlus } from 'lucide-react';

const emailPriceUsd = 0.03;
const meetingsRate = { low: 0.0009, high: 0.0018 };
const leadsRate = { low: 0.002, high: 0.008 };

export default function CalculatorSection() {
  const [budget, setBudget] = useState(30);
  const [showInfo, setShowInfo] = useState(false);

  const emails = Math.round(budget / emailPriceUsd);
  const hasEmails = emails > 0;

  const formatRange = (rate) => {
    if (!hasEmails) return '0';
    const low = Math.max(1, Math.round(emails * rate.low));
    const high = Math.max(low, Math.round(emails * rate.high));
    return low === high ? `~${low}` : `~${low}–${high}`;
  };

  const warmLeads = formatRange(leadsRate);
  const meetings = formatRange(meetingsRate);
  const costPerLead = hasEmails ? `$1–$${Math.round(emailPriceUsd / leadsRate.low)}` : '0';

  const metrics = [
    {
      label: 'Emails',
      value: emails.toLocaleString(),
      icon: Send,
      info: false
    },
    {
      label: 'Warm leads',
      value: warmLeads,
      icon: UserPlus,
      info: false
    },
    {
      label: 'Meetings',
      value: meetings,
      icon: Calendar,
      info: false
    },
    {
      label: 'Cost per lead',
      value: costPerLead,
      icon: HelpCircle,
      info: true
    }
  ];

  const handleCtaClick = () => {
    const input = document.getElementById('hero-website-input');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus();
    }
  };

  return (
    <section id="pricing" className="mb-24 md:mb-32 scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-normal text-foreground">
            Pay as you go with no subscription
          </h2>
        </div>

        {/* Calculator Card */}
        <div className="p-6 md:px-10 md:py-8 max-w-[680px] mx-auto bg-card rounded-2xl shadow-plaque border border-border/40">
          {/* Slider Container */}
          <div className="mb-8">
            <div className="relative pt-10">
              {/* Floating budget label */}
              <span
                className="absolute top-0 -translate-x-1/2 text-2xl font-semibold text-foreground tabular-nums select-none transition-all duration-75"
                style={{
                  left: `clamp(24px, calc((100% - 32px) * ${budget / 100} + 16px), calc(100% - 36px))`
                }}
              >
                ${budget.toLocaleString()}
              </span>

              {/* Slider Input */}
              <div className="relative flex items-center w-full">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-chip rounded-lg appearance-none cursor-pointer accent-foreground focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${budget}%, rgba(0,0,0,0.06) ${budget}%, rgba(0,0,0,0.06) 100%)`
                  }}
                />
              </div>
            </div>
          </div>

          {/* 4 Metric Blocks Grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="relative flex flex-col bg-chip rounded-xl p-4 border border-border/20 min-h-[96px]"
              >
                {m.info ? (
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => setShowInfo(!showInfo)}
                      className="text-muted-foreground hover:text-foreground transition-colors cursor-help"
                      aria-label="Info about cost per lead"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                    {showInfo && (
                      <div className="absolute right-0 bottom-full mb-2 w-72 bg-card p-4 rounded-xl shadow-xl border border-border text-xs text-muted-foreground z-30 leading-relaxed">
                        <div className="font-semibold text-foreground mb-1">
                          What drives your cost per lead
                        </div>
                        Not your budget. It depends on your product, your offer, and how contested your vertical's inboxes are.
                        <div className="mt-2 text-foreground/80">
                          Our best-performing clients get close to $1 per lead. You'll see your actual number after your first sends.
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <m.icon className="absolute top-3 right-3 w-5 h-5 text-muted-foreground/60" />
                )}

                <div className="text-2xl md:text-3xl font-semibold tabular-nums pr-7 text-foreground">
                  {m.value}
                </div>
                <div className="flex items-center gap-1 text-sm md:text-base font-medium text-muted-foreground mt-auto pt-2">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-8 py-3.5 rounded-xl transition-all duration-300 hover:scale-105 shadow-sm cursor-pointer"
            >
              <span>Get $30 to try it</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
