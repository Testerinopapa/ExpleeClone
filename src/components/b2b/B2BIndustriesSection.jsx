import React from 'react';
import { ArrowRight } from 'lucide-react';
import industriesData from '../../data/b2bIndustries.json';

export default function B2BIndustriesSection() {
  return (
    <section className="mb-32 md:mb-48 pt-6">
      {/* Centered Heading with exact original text and gradient */}
      <h2 className="text-2xl md:text-3xl font-normal text-white mb-10 md:mb-12 text-center tracking-[-0.02em]">
        Explore companies across{' '}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(0.283turn, rgba(5, 172, 130, 1) 0%, rgba(21, 173, 220, 1) 100%)',
          }}
        >
          21 NACE industry sectors
        </span>
      </h2>

      {/* 3-column Grid matching exact original width and gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {industriesData.map((ind) => (
          <a
            key={ind.code}
            href={ind.href}
            className="group glass-window glass-window--inset hover:border-white/[0.12] transition-all duration-300 block"
          >
            <div className="glass-window-inner flex items-center gap-4 py-5 px-6 min-h-[96px] md:min-h-[102px]">
              {/* Left Monochrome Industry Icon */}
              <span
                className="text-3xl shrink-0 grayscale contrast-[300%] brightness-90 opacity-65 w-10 flex items-center justify-center select-none"
                style={{
                  fontFamily:
                    '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
                }}
                aria-hidden="true"
              >
                {ind.icon}
              </span>

              {/* Center Industry Title & Secondary NACE / company count */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[15px] md:text-base text-[#f3f4f6] group-hover:text-brand-400 transition-colors leading-snug truncate">
                  {ind.title}
                </h3>
                <p className="text-xs md:text-sm text-[#9ca3af] mt-1 flex items-center gap-1.5 font-normal">
                  <span className="text-white/40 font-medium">{ind.code}</span>
                  <span className="text-white/30">·</span>
                  <span>{ind.count}</span>
                </p>
              </div>

              {/* Right Arrow */}
              <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-brand-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
