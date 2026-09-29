import React from 'react';
import { Zap, Sparkles, RefreshCw } from 'lucide-react';

export default function GMHeroSection() {
  return (
    <div className="relative -mt-16 pt-28 pb-4">
      {/* Background glow / radial effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 relative z-10">
        {/* Hero title & badge */}
        <section className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full px-4 py-2 mb-8">
            <Zap className="h-4 w-4 text-[#10b981]" />
            <span className="text-sm font-medium text-[#10b981]">Fresh as September 2026</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight gm-gradient-heading max-w-4xl mx-auto leading-tight">
            The Most Comprehensive Google Maps Dataset
          </h1>

          <p className="text-lg md:text-xl text-[#9ca3af] max-w-2xl mx-auto leading-relaxed">
            Access <span className="font-semibold text-white">218M+ local business profiles</span> with contact info, ratings, reviews, and photos across <span className="font-semibold text-white">244+ countries</span>
          </p>
        </section>

        {/* 3 Metric Cards */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: 218M+ */}
            <div className="group bg-[#111414] rounded-2xl p-6 border border-white/[0.08] hover:shadow-[0_10px_40px_rgba(34,197,94,0.15)] hover:border-[#7cd9ba] transition-all duration-300 text-center flex flex-col items-center">
              <div className="flex justify-center mb-5">
                <img
                  src="https://www.gstatic.com/images/branding/product/2x/maps_96dp.png"
                  alt="Google Maps"
                  className="h-11 w-11 group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="text-3xl font-bold text-white mb-1">218M+</div>
              <div className="text-lg font-semibold text-[#9ca3af] mb-2">Local Business Locations</div>
              <p className="text-sm text-[#9ca3af] leading-relaxed">Verified locations from Google Maps with enriched business data</p>
            </div>

            {/* Card 2: 55 Fields */}
            <div className="group bg-[#111414] rounded-2xl p-6 border border-white/[0.08] hover:shadow-[0_10px_40px_rgba(34,197,94,0.15)] hover:border-[#7cd9ba] transition-all duration-300 text-center flex flex-col items-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/[0.04] rounded-full">
                  <Sparkles className="h-6 w-6 text-[#9ca3af] group-hover:text-yellow-500 transition-colors" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">55 Fields</div>
              <div className="text-lg font-semibold text-[#9ca3af] mb-2">Most on the Market</div>
              <p className="text-sm text-[#9ca3af] leading-relaxed">Ratings, reviews, hours, photos, amenities, and contact info</p>
            </div>

            {/* Card 3: 4 Weeks */}
            <div className="group bg-[#111414] rounded-2xl p-6 border border-white/[0.08] hover:shadow-[0_10px_40px_rgba(34,197,94,0.15)] hover:border-[#7cd9ba] transition-all duration-300 text-center flex flex-col items-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/[0.04] rounded-full">
                  <RefreshCw className="h-6 w-6 text-[#9ca3af] group-hover:text-[#10b981] transition-colors group-hover:animate-spin" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">4 Weeks</div>
              <div className="text-lg font-semibold text-[#9ca3af] mb-2">Full Refresh Cycle</div>
              <p className="text-sm text-[#9ca3af] leading-relaxed">Always fresh data with continuous updates</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
