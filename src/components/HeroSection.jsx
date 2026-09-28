import React, { useState } from 'react';
import { ArrowRight, Gift } from 'lucide-react';
import FlowCanvas from './FlowCanvas';
import LogosCarousel from './LogosCarousel';

export default function HeroSection() {
  const [inputValue, setInputValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <section className="hero relative overflow-hidden">
      <div className="text-center flex flex-col items-center justify-center relative z-10 w-full pt-10 md:self-stretch md:pt-20 md:pb-12 px-4">
        <div className="w-full flex flex-col items-center justify-center">
          {/* Top badge */}
          <div className="stat-badge-slot !mb-6">
            <span className="stat-badge">
              <div className="inline-flex items-center whitespace-nowrap rounded-full bg-card px-4 py-2 text-xs shadow-plaque md:text-sm gap-1.5 md:gap-2 border border-border/40">
                <span className="tabular-nums font-semibold text-foreground">
                  122,044
                </span>
                <span className="font-normal text-muted-foreground">
                  hot leads for 10,982 companies
                </span>
              </div>
            </span>
          </div>

          {/* Hero headline */}
          <h1 className="hero-headline mb-3 max-w-[760px] mx-auto text-center text-4xl sm:text-5xl md:text-[62px] font-normal tracking-tight text-foreground leading-[1.08]">
            Get{' '}
            <span className="headline-accent text-brand-600 font-medium">
              1 to 3 hot leads
            </span>
            <br />
            in 24 hours free
          </h1>

          {/* Sub-badges */}
          <div className="!mb-10 flex flex-wrap items-center justify-center gap-2 mt-4">
            <div className="inline-flex items-center rounded-full bg-chip px-4 py-1.5 text-sm text-foreground font-normal">
              No SDRs or email infra needed
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-chip px-4 py-1.5 text-sm text-foreground font-normal">
              <Gift className="w-4 h-4 text-foreground/80" />
              <span>$30 in free credits</span>
            </div>
          </div>

          {/* Input field with Flow streams on left and right */}
          <div className="flex flex-col items-center w-full">
            <div className="relative flex flex-col md:flex-row md:items-center w-full gap-2 max-w-[480px]">
              {/* Left animated stream canvas */}
              <div
                className="absolute right-full top-1/2 -translate-y-1/2 pointer-events-none hidden md:block"
                style={{
                  width: 'calc(50vw - 240px)',
                  height: 'calc((50vw - 240px) * 500 / 400)'
                }}
              >
                <FlowCanvas
                  width={400}
                  height={500}
                  preserveAspectRatio="xMaxYMid meet"
                  className="w-full h-full block"
                />
              </div>

              {/* Center Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inputValue.trim()) {
                    window.location.href = `https://app.explee.com/signup?website=${encodeURIComponent(inputValue.trim())}`;
                  }
                }}
                className="glass-edge hero-launch-field relative rounded-2xl flex items-center bg-card pl-5 pr-1.5 py-1.5 gap-2 w-full border border-border shadow-plaque"
              >
                <input
                  id="hero-website-input"
                  data-test="hero-website-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Paste your website, e.g., consolto.com"
                  autoComplete="off"
                  className="flex-1 min-w-0 bg-transparent outline-none text-foreground placeholder:text-muted-foreground py-2 text-base md:text-[15px]"
                />
                <button
                  type="submit"
                  aria-label="Launch"
                  className={`inline-flex items-center justify-center bg-primary text-primary-foreground font-medium p-2.5 rounded-xl transition-all duration-300 hover:scale-105 flex-shrink-0 cursor-pointer ${
                    inputValue.trim().length > 0
                      ? 'opacity-100 pointer-events-auto shadow-sm'
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Right animated stream canvas (rotated 180 degrees) */}
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 rotate-180 pointer-events-none hidden md:block"
                style={{
                  width: 'calc(50vw - 240px)',
                  height: 'calc((50vw - 240px) * 500 / 400)'
                }}
              >
                <FlowCanvas
                  width={400}
                  height={500}
                  preserveAspectRatio="xMaxYMid meet"
                  className="w-full h-full block"
                />
              </div>
            </div>

            {/* "I don't have a website" dialog link */}
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="mt-4 text-sm font-normal text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-pointer"
            >
              I don't have a website
            </button>

            {/* Description text */}
            <p className="!mt-8 md:!mt-10 max-w-[560px] mx-auto text-center text-base md:text-lg text-muted-foreground leading-relaxed">
              Our AI agents research the market, sharpen your ICP, find high-intent prospects, write personalized emails, and book demos
            </p>
          </div>
        </div>

        {/* Logos Carousel & Trust Ratings */}
        <LogosCarousel />
      </div>

      {/* Dialog for "I don't have a website" */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border relative">
            <h3 className="text-xl font-semibold text-foreground mb-2">No website yet?</h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              No problem! You can describe your product, your target ICP, or upload your pitch deck inside the dashboard to get started immediately.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="px-4 py-2 rounded-lg bg-chip text-foreground text-sm font-medium hover:bg-muted"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
              >
                Continue to sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
