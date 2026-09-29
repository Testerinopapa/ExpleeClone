import React from 'react';
import GMHeader from './GMHeader';
import GMHeroSection from './GMHeroSection';
import GMLogosSection from './GMLogosSection';
import GMRegionsSection from './GMRegionsSection';
import GMCountriesSection from './GMCountriesSection';
import GMDataCategoriesSection from './GMDataCategoriesSection';
import GMCustomAttributesSection from './GMCustomAttributesSection';
import GMBusinessInsightsSection from './GMBusinessInsightsSection';
import GMCalendlySection from './GMCalendlySection';
import GMFooter from './GMFooter';
import '../../gm.css';

export default function GMPage() {
  return (
    <div className="gm-dark min-h-screen flex flex-col bg-[#090b0b] text-white">
      {/* 1. Header / Navbar */}
      <GMHeader />

      {/* Main Content */}
      <main className="flex-1">
        {/* 2. Hero Section (Title, Subtitle, 3 Metrics) */}
        <GMHeroSection />

        {/* 3. Logos & Trust Section (G2 Badge + 11 Partner Logos) */}
        <GMLogosSection />

        {/* 4. Geographic Regions (9 cards with exact map silhouette SVGs) */}
        <GMRegionsSection />

        {/* 5. Countries Grid (Top 21 countries + expandable view for 244 countries) */}
        <GMCountriesSection />

        {/* 6. What's Inside Our Database (Sticky category sidebar, 54 fields, code preview) */}
        <GMDataCategoriesSection />

        {/* 7. Custom Place Attributes (Typewriter prompt, floating squares) */}
        <GMCustomAttributesSection />

        {/* 8. Business Insights (Lead Gen, Market Research, Location Intelligence) */}
        <GMBusinessInsightsSection />

        {/* 9. Calendly Demo Booking */}
        <GMCalendlySection />
      </main>

      {/* 10. Footer */}
      <GMFooter />
    </div>
  );
}
