import React from 'react';

const insights = [
  {
    title: 'Lead Generation',
    description:
      'Find local businesses by category, location, ratings, and more. Build targeted prospect lists for any industry or geography.',
    icon: (
      <svg
        className="w-6 h-6 text-[#10b981]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
        <path d="M11 8v6"></path>
        <path d="M8 11h6"></path>
      </svg>
    ),
  },
  {
    title: 'Market Research',
    description:
      'Analyze competitive landscapes, identify market gaps, and understand local business ecosystems with comprehensive place data.',
    icon: (
      <svg
        className="w-6 h-6 text-[#10b981]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"></path>
        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
        <circle cx="12" cy="10" r="2"></circle>
        <line x1="8" x2="8" y1="2" y2="4"></line>
        <line x1="16" x2="16" y1="2" y2="4"></line>
      </svg>
    ),
  },
  {
    title: 'Location Intelligence',
    description:
      'Power your analytics with rich POI data including ratings, reviews, operating hours, and customer sentiment.',
    icon: (
      <svg
        className="w-6 h-6 text-[#10b981]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18"></path>
        <path d="m19 9-5 5-4-4-3 3"></path>
      </svg>
    ),
  },
];

export default function GMBusinessInsightsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-[1200px] px-4">
        {/* Section Heading */}
        <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-12">
          From locations database to{' '}
          <span className="gm-text-gradient">business insights</span>
        </h2>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#111414] rounded-2xl p-6 border border-white/[0.08] hover:border-[#7cd9ba]/50 transition-colors"
            >
              <div className="w-10 h-10 mb-4 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-[#9ca3af] text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
