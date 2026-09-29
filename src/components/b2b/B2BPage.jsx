import React, { useState } from 'react';
import B2BHeader from './B2BHeader';
import B2BHeroSection from './B2BHeroSection';
import B2BDataSourcesSection from './B2BDataSourcesSection';
import B2BRegionsSection from './B2BRegionsSection';
import B2BIndustriesSection from './B2BIndustriesSection';
import B2BCountriesSection from './B2BCountriesSection';
import B2BDataCategoriesSection from './B2BDataCategoriesSection';
import B2BRevenueDriverSection from './B2BRevenueDriverSection';
import B2BCalendlySection from './B2BCalendlySection';
import B2BFooter from './B2BFooter';
import B2BWordmarkAnimation from './B2BWordmarkAnimation';
import { MessageSquare } from 'lucide-react';

export default function B2BPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="b2b-dark min-h-screen flex flex-col bg-[#090B0B] text-foreground relative z-50">
      <div className="landing-scroll-content flex flex-col flex-1">
        {/* Sticky Header */}
        <B2BHeader />

        {/* Hero Section */}
        <B2BHeroSection />

        {/* All-in-one & Ultimate Business Profile (sticky scroll) */}
        <B2BDataSourcesSection />

        {/* Main Sections Container */}
        <div className="max-w-[1200px] mx-auto px-4 w-full">
          {/* 1. Geographic Regions */}
          <B2BRegionsSection />

          {/* 2. NACE Industry Sectors */}
          <B2BIndustriesSection />

          {/* 3. 238 Countries */}
          <B2BCountriesSection />

          {/* 4. What's Inside Our Database / Data Categories Explorer */}
          <B2BDataCategoriesSection />

          {/* 5. Revenue Driver */}
          <B2BRevenueDriverSection />

          {/* 6. Demo Booking with Calendly */}
          <B2BCalendlySection />
        </div>

        {/* Footer */}
        <B2BFooter />
      </div>

      {/* Wordmark Footer Reveal Animation */}
      <B2BWordmarkAnimation />

      {/* Floating Chat Support Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setChatOpen(!chatOpen)}
          aria-label="Chat support"
          className="w-14 h-14 rounded-full bg-[#00947c] hover:bg-[#007f6a] text-white flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <MessageSquare className="w-6 h-6 fill-current" />
        </button>

        {chatOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-[#121616] rounded-2xl shadow-2xl border border-white/10 p-4 mb-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="font-medium text-white text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                Explee Support
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="text-xs text-white/50 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="py-4 text-xs text-white/70 leading-relaxed">
              Hi there! 👋 How can we help you today? Leave us a message and we'll reply shortly.
            </div>
            <input
              type="text"
              placeholder="Write a message..."
              className="w-full bg-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none border border-white/10 focus:border-brand-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
