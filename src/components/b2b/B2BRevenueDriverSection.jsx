import React from 'react';
import { Search, Users, BarChart3 } from 'lucide-react';

export default function B2BRevenueDriverSection() {
  return (
    <section className="py-16 md:py-24">
      <h2 className="text-2xl md:text-3xl font-normal text-white text-center mb-12 tracking-[-0.02em]">
        From company database to{' '}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(0.283turn, rgba(5, 172, 130, 1) 0%, rgba(21, 173, 220, 1) 100%)',
          }}
        >
          revenue driver
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Targeted Prospecting */}
        <div className="glass-window glass-window--inset">
          <div className="glass-window-inner p-6">
            <div className="glass-icon w-10 h-10 mb-5 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
              <Search className="w-5 h-5 text-white/80" />
            </div>
            <h3 className="text-lg font-medium text-white mb-3">
              Targeted Prospecting
            </h3>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              Find the right companies in any state, industry, or revenue range. Save hours of
              research and fill your sales pipeline with highly qualified leads.
            </p>
          </div>
        </div>

        {/* Card 2: Personalized Outreach */}
        <div className="glass-window glass-window--inset">
          <div className="glass-window-inner p-6">
            <div className="glass-icon w-10 h-10 mb-5 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
              <Users className="w-5 h-5 text-white/80" />
            </div>
            <h3 className="text-lg font-medium text-white mb-3">
              Personalized Outreach
            </h3>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              Enrich your CRM with detailed company data to craft personalized emails, LinkedIn
              campaigns, and outreach sequences that actually convert.
            </p>
          </div>
        </div>

        {/* Card 3: Market Segmentation & Insights */}
        <div className="glass-window glass-window--inset">
          <div className="glass-window-inner p-6">
            <div className="glass-icon w-10 h-10 mb-5 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white/80" />
            </div>
            <h3 className="text-lg font-medium text-white mb-3">
              Market Segmentation &amp; Insights
            </h3>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              Analyze industries, company sizes to identify new market opportunities and refine
              your marketing campaigns for maximum impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
