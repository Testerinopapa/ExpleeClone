import React, { useState } from 'react';
import { Zap, Sparkles, RefreshCw } from 'lucide-react';
import FlowCanvas from '../FlowCanvas';
import B2BLogosCarousel from './B2BLogosCarousel';

export default function B2BHeroSection() {
  const [speed, setSpeed] = useState(0.15);

  const flowConfig = {
    numPaths: 12,
    dotsPerPath: 3,
    primaryDotRatio: 0.3,
    startSpread: 1,
    finishSpread: 0.15,
    curveType: "s-curve",
    curvature: 0.4,
    speed: speed,
    dotPrimaryColor: "#05ac82",
    dotSecondaryColor: "rgba(255, 255, 255, 0.15)",
    pathColor: "rgba(255, 255, 255, 0.08)",
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <section className="text-center pt-28 flex flex-col items-center">
        {/* Fresh as badge */}
        <div className="inline-flex items-center gap-2 glass-edge rounded-full px-4 py-1.5 mb-6 bg-white/5">
          <Zap className="h-4 w-4 text-brand-400" />
          <span className="text-sm font-medium text-white/70">
            Fresh as September 2026
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-[3rem] font-normal mb-4 tracking-[-0.03em] leading-[1.15] text-foreground">
          Largest Global B2B Company Database
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto pb-10">
          Access{' '}
          <span className="font-medium text-white">105M+ company profiles</span>{' '}
          with AI-enriched data from websites, professional networks, maps, and government registries
        </p>

        {/* Hero Cards Container with Flow Canvases */}
        <div
          className="relative w-full"
          onMouseEnter={() => setSpeed(1.5)}
          onMouseLeave={() => setSpeed(0.15)}
        >
          {/* Right flow canvas */}
          <div
            className="absolute right-1/2 top-1/2 -translate-y-1/2 pointer-events-none z-0 hidden md:block"
            style={{ width: 'calc(50vw)', height: 'calc(50vw * 300 / 400)' }}
          >
            <FlowCanvas width={400} height={300} config={flowConfig} preserveAspectRatio="xMaxYMid meet" />
          </div>

          {/* Left flow canvas (rotated 180) */}
          <div
            className="absolute left-1/2 top-1/2 -translate-y-1/2 rotate-180 pointer-events-none z-0 hidden md:block"
            style={{ width: 'calc(50vw)', height: 'calc(50vw * 300 / 400)' }}
          >
            <FlowCanvas width={400} height={300} config={flowConfig} preserveAspectRatio="xMaxYMid meet" />
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Card 1 */}
            <div className="glass-window glass-window--inset">
              <div className="glass-window-inner p-6 md:p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center gap-2 h-10">
                    <div className="p-1.5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                    <span className="text-white/30 text-lg font-semibold">+</span>
                    <div className="h-10 w-[42px] overflow-hidden flex-shrink-0 flex items-center">
                      <img
                        alt="LinkedIn"
                        className="h-10 w-auto min-w-[48px]"
                        src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg"
                      />
                    </div>
                    <span className="text-white/30 text-lg font-semibold">+</span>
                    <img
                      alt="Google Maps"
                      className="h-10 w-10"
                      src="https://www.gstatic.com/images/branding/product/2x/maps_96dp.png"
                    />
                    <span className="text-white/30 text-lg font-semibold">+</span>
                    <div className="p-1.5 bg-gray-500 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v1h20V7L12 2zM4 10v10h3V10H4zm6 0v10h4V10h-4zm7 0v10h3V10h-3zM2 22h20v-2H2v2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-medium text-white mb-1">105M+</div>
                <div className="text-base font-medium text-white/80 mb-1">Company Profiles</div>
                <p className="text-sm text-muted-foreground">
                  Unified from 310M websites, Linkedin Data, Google Maps and Government Registries
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-window glass-window--inset">
              <div className="glass-window-inner p-6 md:p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="glass-icon w-12 h-12 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="text-3xl font-medium text-white mb-1">93 Fields</div>
                <div className="text-base font-medium text-white/80 mb-1">AI-Enriched Data</div>
                <p className="text-sm text-muted-foreground">
                  500+ datapoints per company with deep-research AI analysis
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-window glass-window--inset">
              <div className="glass-window-inner p-6 md:p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="glass-icon w-12 h-12 flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="text-3xl font-medium text-white mb-1">4 Weeks</div>
                <div className="text-base font-medium text-white/80 mb-1">Full Refresh Cycle</div>
                <p className="text-sm text-muted-foreground">
                  Always fresh data with continuous updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Logos */}
      <section className="text-center mt-14 mb-8">
        <a
          className="inline-block hover:opacity-80 transition-opacity mb-8"
          href="https://www.g2.com"
          rel="noopener noreferrer nofollow"
          target="_blank"
        >
          <img
            alt="G2 5.0 Rating"
            className="h-8 brightness-0 invert"
            src="/static/images/g2-rating.svg"
          />
        </a>
        <p className="text-muted-foreground mb-6">
          Trusted by 100+ GTM, Fintech, Procurement and AI leaders
        </p>
        <B2BLogosCarousel />
      </section>
    </div>
  );
}
