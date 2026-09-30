import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import GMHeader from './GMHeader';
import GMCalendlySection from './GMCalendlySection';
import GMFooter from './GMFooter';
import CountryTreemap from './CountryTreemap';
import { getCountryBySlug } from '../../data/gm/countryData';
import { useNavigation, PRODUCT_ROUTES } from '../../context/NavigationContext';

export default function CountryLocationPage({ countrySlug }) {
  const { navigate } = useNavigation();
  const country = getCountryBySlug(countrySlug);

  // If unknown country slug, provide helpful not found card with return link
  if (!country) {
    return (
      <div className="gm-dark min-h-screen flex flex-col bg-[#090b0b] text-white">
        <GMHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#111414] border border-white/[0.08] shadow-2xl">
            <h1 className="text-3xl font-bold mb-3 text-white">Country Not Found</h1>
            <p className="text-sm text-[#9ca3af] mb-6">
              The country location "<span className="text-white font-mono">{countrySlug}</span>" does not exist in the Google Maps dataset.
            </p>
            <button
              type="button"
              onClick={() => navigate(PRODUCT_ROUTES.GM)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#0d9467] text-black font-semibold text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all countries</span>
            </button>
          </div>
        </main>
        <GMFooter />
      </div>
    );
  }

  return (
    <div className="gm-dark min-h-screen flex flex-col bg-[#090b0b] text-white">
      {/* Header */}
      <GMHeader />

      <main className="flex-1 container mx-auto max-w-[1200px] px-4 py-8 md:py-12">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-6">
          <a
            href="/gm-dataset"
            onClick={(e) => {
              e.preventDefault();
              navigate(PRODUCT_ROUTES.GM);
            }}
            className="inline-flex items-center gap-2 text-sm text-[#9ca3af] hover:text-[#10b981] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Google Maps Dataset</span>
          </a>
        </div>

        {/* Section Heading matching ORIGINAL */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-[#9ca3af] mb-4">
            <MapPin className="w-3.5 h-3.5 text-[#10b981]" />
            <span>{country.name} ({country.code}) &bull; {country.locationCount}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            <span className="text-white">Complete coverage across </span>
            <span className="gm-text-gradient">
              all cities & categories in {country.name}
            </span>
          </h1>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-20">
          {/* Left Panel: Top 10 Cities by place Count */}
          <div className="bg-[#111414] border border-white/[0.08] rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Background Country Silhouette Map */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-[85%] h-[85%] pointer-events-none opacity-20 z-0 flex items-center justify-center overflow-hidden">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full fill-current text-[#10b981]"
                preserveAspectRatio="xMidYMid meet"
                dangerouslySetInnerHTML={{ __html: country.mapAsset }}
              />
            </div>

            {/* City Table Content (Z-10 relative) */}
            <div className="relative z-10">
              <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center justify-between">
                <span>Top 10 Cities by place Count</span>
                <span className="text-xs font-normal text-[#9ca3af]">Places</span>
              </h2>

              <div className="divide-y divide-white/[0.04]">
                {country.cities.map((city, idx) => (
                  <div
                    key={city.name || idx}
                    className="flex items-center justify-between py-3 hover:bg-white/[0.02] px-2 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-xs font-mono text-[#9ca3af] w-5 text-right font-medium">
                        {city.rank || idx + 1}
                      </span>
                      <span className="text-sm md:text-base font-medium text-white group-hover:text-[#10b981] transition-colors truncate">
                        {city.name}
                      </span>
                    </div>
                    <span className="text-sm md:text-base font-semibold text-[#10b981] font-mono ml-4 shrink-0">
                      {city.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Top 15 Categories by place Count */}
          <div className="bg-[#111414] border border-white/[0.08] rounded-2xl p-6 md:p-8 flex flex-col shadow-2xl">
            <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center justify-between">
              <span>Top 15 Categories by place Count</span>
              <span className="text-xs font-normal text-[#9ca3af]">Relative distribution</span>
            </h2>

            <div className="flex-1 w-full">
              <CountryTreemap categories={country.categories} />
            </div>
          </div>
        </div>

        {/* Demo / Booking Section */}
        <GMCalendlySection />
      </main>

      {/* Footer */}
      <GMFooter />
    </div>
  );
}
