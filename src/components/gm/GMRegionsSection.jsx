import React from 'react';
import { ArrowRight } from 'lucide-react';
import regionsData from '../../data/gm/gmRegions.json';
import { useNavigation } from '../../context/NavigationContext';

export default function GMRegionsSection() {
  const { navigate } = useNavigation();

  return (
    <section className="mb-24">
      <div className="container mx-auto max-w-[1200px] px-4">
        {/* Section Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
          Explore 218M+ locations across{' '}
          <span className="gm-text-gradient">all geographic regions</span>
        </h2>

        {/* 9 Region Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionsData.map((region) => (
            <a
              key={region.id}
              href={region.href}
              onClick={(e) => {
                e.preventDefault();
                navigate(region.href);
              }}
              className="group relative bg-[#111414] rounded-2xl p-6 border border-white/[0.08] hover:shadow-[0_10px_40px_rgba(34,197,94,0.15)] hover:border-[#7cd9ba] transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Silhouette SVG map in background */}
              {region.svgHtml && (
                <div
                  className="absolute -right-6 top-1/2 -translate-y-1/2 w-56 h-56 text-[#9ca3af]/20 group-hover:text-[#abe7d3] transition-colors opacity-70 pointer-events-none"
                  dangerouslySetInnerHTML={{ __html: region.svgHtml }}
                />
              )}

              {/* Card Foreground Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#10b981] transition-colors">
                    {region.name}
                  </h3>
                  <ArrowRight className="h-5 w-5 text-[#9ca3af] group-hover:text-[#10b981] group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex gap-6 text-sm text-[#9ca3af]">
                  <span>{region.countries}</span>
                  <span>{region.locations}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
