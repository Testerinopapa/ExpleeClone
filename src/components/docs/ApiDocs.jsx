import React, { useState, useEffect } from 'react';
import DocsSidebar from './DocsSidebar';
import IntroductionContent from './IntroductionContent';
import TagOverviewContent from './TagOverviewContent';
import EndpointContent from './EndpointContent';
import endpointsData from '../../data/endpointsData.json';

export default function ApiDocs({ onBackToLanding }) {
  const [activeRoute, setActiveRoute] = useState('introduction');

  // Handle URL hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash || hash.includes('introduction')) {
        setActiveRoute('introduction');
        return;
      }

      // 1. Check if hash is a tag overview (e.g. #tag/billing, #tag/tasks)
      const tagOnlyMatch = hash.match(/^#tag\/([^/]+)$/);
      if (tagOnlyMatch) {
        setActiveRoute('tag-' + tagOnlyMatch[1]);
        return;
      }

      // 2. Check if hash matches an endpoint directly with exact method & path match
      const matched = endpointsData.find(ep => 
        ep.hash === hash || 
        (hash.includes(`/${ep.method}/`) && hash.endsWith(ep.path))
      ) || endpointsData.find(ep => hash.endsWith(ep.path));

      if (matched) {
        setActiveRoute(matched.id);
        return;
      }

      // 3. Fallback: tag prefix
      const tagMatch = hash.match(/#tag\/([^/]+)/);
      if (tagMatch) {
        setActiveRoute('tag-' + tagMatch[1]);
        return;
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectRoute = (route) => {
    setActiveRoute(route);
    if (route === 'introduction') {
      window.location.hash = '#description/introduction';
    } else if (route.startsWith('tag-')) {
      window.location.hash = '#tag/' + route.replace('tag-', '');
    } else {
      const matched = endpointsData.find(ep => ep.id === route);
      if (matched && matched.hash) {
        window.location.hash = matched.hash;
      }
    }
  };

  // Find currently active endpoint if not introduction
  const currentIndex = endpointsData.findIndex(ep => ep.id === activeRoute);
  const currentEndpoint = currentIndex >= 0 ? endpointsData[currentIndex] : null;
  const nextEndpoint = currentIndex >= 0 && currentIndex < endpointsData.length - 1 ? endpointsData[currentIndex + 1] : null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-[#1b1b1b] font-['Inter',sans-serif] antialiased">
      {/* Sidebar: exactly 288px */}
      <DocsSidebar
        activeRoute={activeRoute}
        onSelectRoute={handleSelectRoute}
        onBackToLanding={onBackToLanding}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-white custom-scrollbar">
        {activeRoute === 'introduction' ? (
          <IntroductionContent />
        ) : activeRoute.startsWith('tag-') ? (
          <TagOverviewContent tagKey={activeRoute.replace('tag-', '')} />
        ) : currentEndpoint ? (
          <EndpointContent endpoint={currentEndpoint} nextEndpoint={nextEndpoint} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-[#757575]">
            <h2 className="text-xl font-semibold text-[#1b1b1b] mb-2 capitalize">
              {activeRoute.replace(/-/g, ' ')}
            </h2>
            <p className="text-sm max-w-md">
              Endpoint documentation view. Select "Introduction" from the sidebar to view the cloned Introduction page.
            </p>
            <button
              onClick={() => handleSelectRoute('introduction')}
              className="mt-4 px-4 py-2 bg-[#009485] text-white text-xs font-semibold rounded-lg hover:bg-[#007f72] transition-colors cursor-pointer"
            >
              Return to Introduction
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
