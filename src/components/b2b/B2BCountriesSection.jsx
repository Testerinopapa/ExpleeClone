import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import countriesData from '../../data/b2bCountries.json';

export default function B2BCountriesSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleCountries = isExpanded ? countriesData : countriesData.slice(0, 21);

  return (
    <section className="mb-48">
      <h2 className="text-2xl md:text-3xl font-normal text-foreground mb-8 text-center tracking-[-0.02em]">
        Browse the largest B2B company database across{' '}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(0.283turn, rgba(5, 172, 130, 1) 0%, rgba(21, 173, 220, 1) 100%)',
          }}
        >
          {countriesData.length} countries
        </span>
      </h2>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCountries.map((country) => (
            <a
              key={country.code + '-' + country.name}
              href={country.href}
              className="group glass-window glass-window--inset hover:border-white/[0.12] transition-all duration-300"
            >
              <div className="glass-window-inner flex items-center gap-4 p-5 md:py-6 md:px-6 min-h-[96px] md:min-h-[105px]">
                <span className="font-bold text-xl md:text-2xl text-[#f3f4f6] w-10 shrink-0 font-sans tracking-wide text-left">
                  {country.code}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[15px] md:text-base text-[#f3f4f6] group-hover:text-brand-400 transition-colors truncate">
                    {country.name}
                  </h3>
                  <p className="text-sm text-[#9ca3af] mt-0.5">
                    {country.count}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
              </div>
            </a>
          ))}
        </div>

        {!isExpanded && (
          <>
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#090B0B] via-[#090B0B]/80 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="inline-flex items-center gap-2 glass-edge bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200 pointer-events-auto cursor-pointer"
              >
                <span>View all {countriesData.length} countries</span>
                <ChevronDown className="h-4 w-4 text-white/60" />
              </button>
            </div>
          </>
        )}

        {isExpanded && (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="inline-flex items-center gap-2 glass-edge bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer"
            >
              <span>Show less</span>
              <ChevronUp className="h-4 w-4 text-white/60" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
