import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import countriesData from '../../data/gm/gmCountries.json';

export default function GMCountriesSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Initial visible countries: 21 items
  const visibleCountries = isExpanded ? countriesData : countriesData.slice(0, 21);

  return (
    <section className="mb-24">
      <div className="container mx-auto max-w-[1200px] px-4">
        {/* Section Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
          Browse the Most Comprehensive Google Maps dataset across{' '}
          <span className="gm-text-gradient">244 countries</span>
        </h2>

        {/* Countries Grid Container */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCountries.map((c) => (
              <a
                key={c.slug}
                href={c.href}
                className="group flex items-center gap-4 bg-[#111414] rounded-2xl p-5 border border-white/[0.08] hover:shadow-[0_10px_40px_rgba(34,197,94,0.15)] hover:border-[#7cd9ba] transition-all duration-300 min-h-[90px]"
              >
                {/* 2-letter Country Code */}
                <span className="font-bold text-xl md:text-2xl text-white w-10 shrink-0 font-sans tracking-wide">
                  {c.code}
                </span>

                {/* Country Name & Location Count */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-[#10b981] transition-colors truncate">
                    {c.name}
                  </h3>
                  <p className="text-sm text-[#9ca3af]">{c.count}</p>
                </div>

                {/* Arrow */}
                <ArrowRight className="h-4 w-4 text-[#9ca3af] group-hover:text-[#10b981] group-hover:translate-x-1 transition-all flex-shrink-0" />
              </a>
            ))}
          </div>

          {/* Collapsed State: Dark Fade & View All Button */}
          {!isExpanded && (
            <>
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#090b0b] via-[#090b0b]/80 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="inline-flex items-center gap-2 bg-[#111414] border border-white/[0.08] hover:border-[#7cd9ba] hover:shadow-[0_10px_40px_rgba(34,197,94,0.15)] text-[#9ca3af] hover:text-[#10b981] text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200 pointer-events-auto"
                >
                  <span>View all 244 countries</span>
                  <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
                </button>
              </div>
            </>
          )}

          {/* Expanded State: Show Less Button */}
          {isExpanded && (
            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="inline-flex items-center gap-2 bg-[#111414] border border-white/[0.08] hover:border-[#7cd9ba] text-[#9ca3af] hover:text-[#10b981] text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200"
              >
                <span>Show less</span>
                <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
