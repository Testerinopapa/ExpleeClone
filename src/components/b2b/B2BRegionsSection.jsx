import React from 'react';
import { ArrowRight } from 'lucide-react';
import regionsData from '../../data/b2bRegions.json';

export default function B2BRegionsSection() {
  return (
    <section className="mb-48">
      <h2 className="text-2xl md:text-3xl font-normal text-white mb-8 text-center tracking-[-0.02em]">
        Explore 105M+ companies across{' '}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(0.283turn, rgba(5, 172, 130, 1) 0%, rgba(21, 173, 220, 1) 100%)',
          }}
        >
          all geographic regions
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regionsData.map((region) => (
          <a
            key={region.title}
            href={region.href}
            className="group relative overflow-hidden rounded-2xl glass-window glass-window--inset transition-all duration-300 hover:border-brand-500/30"
          >
            <div className="glass-window-inner p-6 relative">
              {region.mapSvg && (
                <div
                  className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none overflow-hidden flex items-center justify-end"
                  dangerouslySetInnerHTML={{ __html: region.mapSvg }}
                />
              )}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-lg md:text-xl font-medium text-white group-hover:text-brand-400 transition-colors">
                    {region.title}
                  </h3>
                  <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-brand-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </div>
                <div className="flex gap-6 text-sm text-[#9ca3af]">
                  <span>{region.countries}</span>
                  <span>{region.companies}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
