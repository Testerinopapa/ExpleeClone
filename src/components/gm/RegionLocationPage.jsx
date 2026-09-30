import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import GMHeader from './GMHeader';
import GMCalendlySection from './GMCalendlySection';
import GMFooter from './GMFooter';
import { getRegionBySlug, getCountriesForRegion } from '../../data/gm/regionData';
import { useNavigation, PRODUCT_ROUTES } from '../../context/NavigationContext';

export default function RegionLocationPage({ regionSlug }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { navigate } = useNavigation();

  const region = getRegionBySlug(regionSlug);
  const countries = region ? getCountriesForRegion(regionSlug) : [];

  // Update browser tab title to match original: "Largest {demonym} Google Maps Locations"
  useEffect(() => {
    if (region) {
      document.title = `Largest ${region.demonym} Google Maps Locations`;
    } else {
      document.title = 'Region Not Found - Google Maps Dataset';
    }
  }, [region]);

  // If unknown region slug, render helpful Not Found screen
  if (!region) {
    return (
      <div className="gm-dark min-h-screen flex flex-col bg-[#090b0b] text-white">
        <GMHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#111414] border border-white/[0.08] shadow-2xl">
            <h1 className="text-3xl font-bold mb-3 text-white">Region Not Found</h1>
            <p className="text-sm text-[#9ca3af] mb-6">
              The geographic region "<span className="text-white font-mono">{regionSlug}</span>" does not exist in the Google Maps dataset.
            </p>
            <button
              type="button"
              onClick={() => navigate(PRODUCT_ROUTES.GM)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#0d9467] text-black font-semibold text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Google Maps Dataset</span>
            </button>
          </div>
        </main>
        <GMFooter />
      </div>
    );
  }

  const hasExpandableCountries = countries.length > 21;
  const visibleCountries = (!hasExpandableCountries || isExpanded)
    ? countries
    : countries.slice(0, 21);

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

        {/* Region Section Heading */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-[#9ca3af] mb-4">
            <MapPin className="w-3.5 h-3.5 text-[#10b981]" />
            <span>{region.name} &bull; {region.locations} &bull; {region.countries}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            <span className="text-white">Browse the Most Comprehensive Google Maps dataset across </span>
            <span className="gm-text-gradient">{region.name}</span>
          </h1>

          <p className="text-[#9ca3af] mt-4 text-base md:text-lg">
            Explore {region.locations} across {region.countries} in {region.name}
          </p>
        </div>

        {/* 3-Column Country Cards Grid for this Region */}
        <div className="relative mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCountries.map((c) => (
              <a
                key={c.slug}
                href={`/gm-dataset/locations/${c.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/gm-dataset/locations/${c.slug}`);
                }}
                className="group flex items-center gap-4 bg-[#111414] rounded-2xl p-5 border border-white/[0.08] hover:shadow-[0_10px_40px_rgba(16,185,129,0.18)] hover:border-[#10b981] transition-all duration-300 min-h-[90px] cursor-pointer"
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
                  <p className="text-sm text-[#9ca3af]">{c.locationCount || c.count}</p>
                </div>

                {/* Arrow */}
                <ArrowRight className="h-4 w-4 text-[#9ca3af] group-hover:text-[#10b981] group-hover:translate-x-1 transition-all flex-shrink-0" />
              </a>
            ))}
          </div>

          {/* Collapsed State: Dark Fade & View All Button */}
          {hasExpandableCountries && !isExpanded && (
            <>
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#090b0b] via-[#090b0b]/80 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="inline-flex items-center gap-2 bg-[#111414] border border-white/[0.08] hover:border-[#7cd9ba] hover:shadow-[0_10px_40px_rgba(34,197,94,0.15)] text-[#9ca3af] hover:text-[#10b981] text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200 pointer-events-auto"
                >
                  <span>View all {countries.length} countries</span>
                  <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
                </button>
              </div>
            </>
          )}

          {/* Expanded State: Show Less Button */}
          {hasExpandableCountries && isExpanded && (
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

        {/* Demo / Calendly Booking */}
        <GMCalendlySection />
      </main>

      {/* Footer */}
      <GMFooter />
    </div>
  );
}
