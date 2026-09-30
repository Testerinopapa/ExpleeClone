import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation, PRODUCT_ROUTES } from '../../context/NavigationContext';
import ProductsDropdown from '../navigation/ProductsDropdown';
import {
  Sparkles,
  User,
  X,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Database
} from 'lucide-react';
import landingData from '../../data/explorer/landing_data.json';
import aiMeetingData from '../../data/explorer/ai_meeting_data.json';
import daySpaData from '../../data/explorer/day_spa_data.json';

export default function ExplorerPage() {
  const { navigate } = useNavigation();

  // Read URL query parameter if present
  const getInitialQuery = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('q') || '';
    } catch {
      return '';
    }
  };

  const initialQuery = getInitialQuery();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [viewState, setViewState] = useState(initialQuery ? 'visual' : 'landing'); // 'landing' | 'loading' | 'visual'
  const [progress, setProgress] = useState(14);
  const [hoveredClusterName, setHoveredClusterName] = useState(null);
  const [hoveredDotIdx, setHoveredDotIdx] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Listen to browser navigation popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const q = getInitialQuery();
      if (q) {
        setSearchQuery(q);
        setInputValue(q);
        setViewState('visual');
      } else {
        setSearchQuery('');
        setInputValue('');
        setViewState('landing');
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Determine which dataset to use based on query
  const currentDataset = useMemo(() => {
    const q = (searchQuery || '').toLowerCase();
    if (q.includes('spa') || q.includes('massage') || q.includes('facial') || q.includes('wellness') || q.includes('skin')) {
      return daySpaData;
    }
    // Default to the rich AI meeting note writer dataset
    return aiMeetingData;
  }, [searchQuery]);

  // Find the hovered cluster object to render tooltip
  const activeHoveredCluster = useMemo(() => {
    if (!hoveredClusterName) return null;
    return (
      currentDataset.clusters.find(
        (c) =>
          c.name === hoveredClusterName ||
          c.id === hoveredClusterName ||
          (c.name && hoveredClusterName && c.name.toLowerCase() === hoveredClusterName.toLowerCase())
      ) || null
    );
  }, [hoveredClusterName, currentDataset]);

  // Helper to format exact companies count for tooltip
  const getTooltipData = (cl) => {
    if (!cl) return null;
    let companies = `${cl.count} companies`;
    if (cl.name === 'Cluster 16') {
      companies = '109,283 companies';
    } else if (cl.count && cl.count.endsWith('k')) {
      const num = Math.round(parseFloat(cl.count) * 1000);
      companies = `${num.toLocaleString()} companies`;
    } else if (cl.count && !isNaN(parseInt(cl.count, 10))) {
      companies = `${parseInt(cl.count, 10).toLocaleString()} companies`;
    }
    return {
      title: `Segment: ${cl.name}`,
      count: companies,
      action: 'Click to get all companies',
    };
  };

  // Trigger search with simulated smooth loading transition
  const handlePerformSearch = (queryText) => {
    const trimmed = (queryText || '').trim();
    if (!trimmed) return;

    setSearchQuery(trimmed);
    setInputValue(trimmed);
    setViewState('loading');
    setProgress(12);

    // Update browser URL
    const newUrl = `/tools/explorer?q=${encodeURIComponent(trimmed).replace(/%20/g, '+')}`;
    window.history.pushState({}, '', newUrl);

    // Animate progress bar smoothly
    let currentProgress = 14;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 20 + 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setViewState('visual');
          setHoveredClusterName(null);
          setHoveredDotIdx(null);
        }, 180);
      } else {
        setProgress(Math.round(currentProgress));
      }
    }, 110);
  };

  const handleClearSearch = () => {
    setInputValue('');
    setSearchQuery('');
    setViewState('landing');
    setHoveredClusterName(null);
    setHoveredDotIdx(null);
    window.history.pushState({}, '', '/tools/explorer');
  };

  // ==========================================
  // VIEW 1: LANDING PAGE (from cluster master.json)
  // ==========================================
  if (viewState === 'landing') {
    return (
      <div className="min-h-screen bg-[#090b0b] text-white flex flex-col font-sans selection:bg-[#10b981]/30">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#090b0b]/95 backdrop-blur border-b border-white/[0.06] transition-shadow duration-200">
          <div className="container mx-auto max-w-[1200px] px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(PRODUCT_ROUTES.OUTREACH);
                }}
                className="flex items-center cursor-pointer"
              >
                <img
                  src="/static/logo/explee/logo-dark.svg"
                  alt="Explee"
                  className="h-7 w-auto"
                />
              </a>

              {/* Navigation links */}
              <div className="flex items-center gap-4 md:gap-7 text-sm">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(PRODUCT_ROUTES.OUTREACH);
                  }}
                  className="hidden md:flex items-center gap-1.5 text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#10b981]" />
                  <span>Outreach Agent</span>
                </a>

                {/* GTM Tools Dropdown */}
                <ProductsDropdown theme="dark" />

                <a
                  href="/pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/#pricing');
                  }}
                  className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#10b981]" />
                  <span>Pricing</span>
                </a>

                <button
                  type="button"
                  onClick={() => window.open('https://app.explee.com', '_blank')}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <User className="w-4 h-4 hidden md:block" />
                  <span>Sign in</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 py-10 md:py-14 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Title & Description */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#05ac82] via-[#10b981] to-[#15addc]">
                Segments Explorer
              </h1>
              <p className="text-sm md:text-base text-[#9ca3af] max-w-2xl mx-auto leading-relaxed px-2">
                <span className="font-semibold text-white">Visualize</span> your market by exploring business clusters. See neighboring niches, understand <span className="font-semibold text-white">segment sizes</span>, and discover your exact <span className="font-semibold text-white">TAM</span> with company counts.
              </p>
            </div>

            {/* Preview Image Card */}
            <div className="mb-6 flex justify-center">
              <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-white/[0.1] bg-[#111414] shadow-2xl">
                <img
                  src="/static/images/explorer-preview.jpg"
                  alt="Explorer Preview"
                  className="w-full h-auto object-cover dark:brightness-[0.88] dark:contrast-[1.08] block"
                />
              </div>
            </div>

            {/* Large Search Box */}
            <div className="mb-8 flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="relative w-full rounded-2xl p-4 flex flex-col transition-all duration-200 bg-[#111414] border border-white/[0.12] hover:border-[#10b981]/60 focus-within:border-[#10b981] focus-within:ring-2 focus-within:ring-[#10b981]/20 shadow-xl">
                  <textarea
                    rows={2}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handlePerformSearch(inputValue);
                      }
                    }}
                    placeholder={landingData.placeholder}
                    className="resize-none w-full flex-grow outline-none p-0 m-0 bg-transparent text-base md:text-lg text-white placeholder:text-[#9ca3af]/60"
                  />
                  <div className="flex justify-end mt-2 pt-2 border-t border-white/[0.04]">
                    <button
                      type="button"
                      disabled={!inputValue.trim()}
                      onClick={() => handlePerformSearch(inputValue)}
                      className="bg-gradient-to-r from-[#10b981] to-[#0d9467] hover:from-[#0d9467] hover:to-[#0a7854] disabled:from-white/10 disabled:to-white/10 disabled:text-white/30 disabled:cursor-not-allowed text-black px-5 py-2 rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg cursor-pointer"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 12 Suggestion Cards Grid */}
            <div className="mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-3">
                {landingData.suggestions.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handlePerformSearch(item.query)}
                    className="group flex items-center gap-3 p-3 bg-[#111414] rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border border-white/[0.08] hover:border-[#10b981]/50 cursor-pointer min-w-0 text-left"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-200 shrink-0">
                      {item.icon}
                    </span>
                    <span className="text-white font-medium text-xs md:text-sm break-words flex-1 min-w-0">
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-[#9ca3af] text-sm border-t border-white/[0.06] bg-[#090b0b] mt-auto">
          <div className="container mx-auto max-w-[1200px] px-4 pt-10 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              {/* Col 1 */}
              <div>
                <h4 className="font-semibold text-white/70 mb-4">Products and GTM Tools</h4>
                <ul className="space-y-2.5">
                  {landingData.footer.products.map((item, i) => (
                    <li key={i}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.href);
                        }}
                        className="hover:text-white transition-colors flex items-center gap-2 text-sm"
                      >
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="bg-[#10b981]/20 text-[#10b981] text-[10px] px-1.5 py-0.5 rounded font-mono">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 2 */}
              <div>
                <h4 className="font-semibold text-white/70 mb-4">B2B Databases</h4>
                <ul className="space-y-2.5">
                  {landingData.footer.databases1.map((item, i) => (
                    <li key={i}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.href);
                        }}
                        className="hover:text-white transition-colors text-sm"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3 */}
              <div>
                <h4 className="font-semibold text-white/70 mb-4 invisible hidden lg:block">
                  B2B Databases (Cont)
                </h4>
                <ul className="space-y-2.5">
                  {landingData.footer.databases2.map((item, i) => (
                    <li key={i}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.href);
                        }}
                        className="hover:text-white transition-colors text-sm"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 4 */}
              <div>
                <h4 className="font-semibold text-white/70 mb-4">Resources</h4>
                <ul className="space-y-2.5">
                  {landingData.footer.resources.map((item, i) => (
                    <li key={i}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-white transition-colors text-sm inline-flex items-center gap-1.5"
                        >
                          <span>{item.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-white/40" />
                        </a>
                      ) : (
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(item.href);
                          }}
                          className="hover:text-white transition-colors text-sm"
                        >
                          {item.title}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Copyright & Legal */}
            <div className="pt-6 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-[#9ca3af]">
              <p>{landingData.footer.copyright}</p>
              <div className="flex items-center gap-3">
                <a href="/terms-of-use" className="hover:underline">
                  Terms of use
                </a>
                <span>|</span>
                <a href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </a>
              </div>
            </div>
            <p className="text-[11px] text-[#9ca3af]/60 text-center md:text-left mt-2">
              {landingData.footer.companyInfo}
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LOADING PROGRESS STATE (from Screenshot 4020)
  // ==========================================
  if (viewState === 'loading') {
    return (
      <div className="h-screen w-screen relative bg-[#090b0b] flex flex-col justify-between overflow-hidden select-none font-sans">
        {/* Floating Top Control Bar (Compact, matching Screenshot 4020) */}
        <div className="absolute top-3 left-4 z-20 bg-[#090b0b] border border-white/[0.12] rounded-lg shadow-xl px-3 py-2 flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleClearSearch();
            }}
            className="cursor-pointer shrink-0 flex items-center"
          >
            <img
              src="/static/logo/explee/logo-dark.svg"
              alt="Explee"
              className="h-4 w-auto"
            />
          </a>

          <div className="relative w-64 md:w-72">
            <input
              type="text"
              value={inputValue}
              readOnly
              className="w-full px-2.5 py-1 text-sm border border-white/[0.12] rounded bg-transparent text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            disabled
            className="bg-white/[0.05] text-white/30 text-sm px-4 py-1 rounded cursor-not-allowed font-medium shrink-0"
          >
            Search...
          </button>
        </div>

        {/* Centered Loading Indicator */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-white tracking-wide">
            Searching segments...
          </h2>
          <p className="text-xs md:text-sm text-[#9ca3af] mt-2">
            Analyzing companies and clustering results
          </p>

          {/* Green Progress Bar */}
          <div className="w-72 md:w-96 h-1.5 bg-white/[0.08] rounded-full overflow-hidden mt-6">
            <div
              className="h-full bg-[#10b981] rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-[#9ca3af] mt-2.5 font-mono">{progress}%</span>
        </div>

        {/* Floating Chat Bubble Button */}
        <button
          type="button"
          aria-label="Contact support"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#05ac82] hover:bg-[#049470] shadow-[0_4px_20px_rgba(5,172,130,0.4)] flex items-center justify-center text-white transition-transform hover:scale-105 cursor-pointer"
        >
          <MessageSquare className="w-5.5 h-5.5 fill-white" />
        </button>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: CLUSTER EXPLORATION CANVAS (from Screenshot 4019)
  // ==========================================
  const tooltipData = activeHoveredCluster ? getTooltipData(activeHoveredCluster) : null;

  return (
    <div className="h-screen w-screen relative bg-[#090b0b] overflow-hidden select-none font-sans cursor-default">
      {/* Floating Top Control Bar (Compact, anchored, matching Screenshot 4019) */}
      <div className="absolute top-3 left-4 z-30 bg-[#090b0b] border border-white/[0.12] rounded-lg shadow-xl px-3 py-2 flex items-center gap-3">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleClearSearch();
          }}
          className="cursor-pointer shrink-0 flex items-center"
        >
          <img
            src="/static/logo/explee/logo-dark.svg"
            alt="Explee"
            className="h-4 w-auto"
          />
        </a>

        <div className="relative w-64 md:w-72">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handlePerformSearch(inputValue);
              }
            }}
            placeholder="Search segments..."
            className="w-full px-2.5 py-1 text-sm border border-white/[0.12] rounded bg-transparent text-white placeholder:text-white/30 focus:outline-none focus:border-[#10b981]"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => handlePerformSearch(inputValue)}
          className="bg-[#10b981] hover:bg-[#0d9467] text-[#090b0b] font-medium text-sm px-4 py-1 rounded transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          Search
        </button>
      </div>

      {/* Fixed Fullscreen SVG Canvas (NO click-and-drag pan, anchored to viewport) */}
      <svg
        className="w-full h-full pointer-events-auto"
        viewBox={currentDataset.viewBox || '0 0 1920 950'}
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {/* Layer 1: Cluster Blob Background Paths (Additive highlight, no heavy dimming of rest) */}
          {currentDataset.paths.map((p, idx) => {
            const clusterName = p.name || p.clusterId || p.id;
            const isThisClusterHovered =
              hoveredClusterName &&
              (hoveredClusterName === clusterName ||
                hoveredClusterName.toLowerCase() === (clusterName || '').toLowerCase());

            // Target visual balance: other clusters remain ~85-90% visible (fillOpacity 0.14)
            // Hovered cluster becomes slightly elevated/saturated (fillOpacity 0.22) with a crisp outline
            const fillOpacity = isThisClusterHovered ? 0.22 : 0.15;
            const strokeWidth = isThisClusterHovered ? 1.5 : 0.8;
            const strokeOpacity = isThisClusterHovered ? 0.9 : 0.25;

            return (
              <path
                key={p.id || idx}
                d={p.d}
                fill={p.fill || '#10b981'}
                fillOpacity={fillOpacity}
                stroke={p.stroke || p.fill || '#10b981'}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
                onMouseEnter={() => setHoveredClusterName(clusterName)}
                onMouseLeave={() => setHoveredClusterName(null)}
                className="cursor-pointer transition-all duration-200"
              />
            );
          })}

          {/* Layer 2: Colored Circles / Company Dots (Color inherited strictly per cluster! No heavy dimming) */}
          {currentDataset.circles.map((c, idx) => {
            const isDotHovered = hoveredDotIdx === idx;
            const belongsToHoveredCluster =
              hoveredClusterName &&
              (c.clusterId === hoveredClusterName ||
                (c.clusterId && c.clusterId.toLowerCase() === hoveredClusterName.toLowerCase()));

            // User requirement: non-hovered nodes remain colorful (~85-90% opacity), easy to see!
            // Hovered cluster nodes become elevated (100% opacity, 1.2x scale)
            const opacity = belongsToHoveredCluster || isDotHovered ? 1 : 0.85;
            const radius = isDotHovered
              ? c.r * 1.4
              : belongsToHoveredCluster
              ? c.r * 1.18
              : c.r;

            return (
              <circle
                key={idx}
                cx={c.cx}
                cy={c.cy}
                r={radius}
                fill={c.fill}
                opacity={opacity}
                onMouseEnter={() => {
                  setHoveredDotIdx(idx);
                  if (c.clusterId) setHoveredClusterName(c.clusterId);
                }}
                onMouseLeave={() => {
                  setHoveredDotIdx(null);
                  setHoveredClusterName(null);
                }}
                className="cursor-pointer transition-all duration-150"
              />
            );
          })}

          {/* Layer 3: Subtopic Floating Text Labels (Subdued blue-gray text, selective density) */}
          {currentDataset.labels.map((lbl, idx) => {
            const belongsToHoveredCluster =
              hoveredClusterName &&
              lbl.clusterId &&
              lbl.clusterId.toLowerCase() === hoveredClusterName.toLowerCase();

            // Non-hovered labels stay readable (opacity 0.75), hovered labels get full emphasis (1.0)
            const labelOpacity = belongsToHoveredCluster ? 1 : 0.75;

            return (
              <g
                key={idx}
                opacity={labelOpacity}
                className="pointer-events-none select-none transition-opacity duration-200"
              >
                {/* Small indicator bullet dot */}
                <circle
                  cx={lbl.x - 5}
                  cy={lbl.y - 3}
                  r={1.5}
                  fill="#64748b"
                  opacity={0.8}
                />
                <text
                  x={lbl.x}
                  y={lbl.y}
                  fill="#94a3b8"
                  fontSize={11}
                  fontWeight="400"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                >
                  {lbl.text}
                </text>
              </g>
            );
          })}

          {/* Layer 4: Cluster Names & Count Badges (Cluster-colored label and matching pill badge!) */}
          {currentDataset.clusters.map((cl, idx) => {
            const clusterName = cl.name || cl.id;
            const isThisClusterHovered =
              hoveredClusterName &&
              (hoveredClusterName === clusterName ||
                hoveredClusterName.toLowerCase() === clusterName.toLowerCase());

            // Non-hovered cluster labels remain clearly readable and colorful (opacity 0.88)!
            const groupOpacity = isThisClusterHovered ? 1 : 0.88;
            const textColor = cl.badgeTextColor || '#000000';

            return (
              <g
                key={cl.id || idx}
                opacity={groupOpacity}
                onClick={() => setSelectedCluster(cl)}
                onMouseEnter={() => setHoveredClusterName(clusterName)}
                onMouseLeave={() => setHoveredClusterName(null)}
                className="cursor-pointer transition-all duration-200"
              >
                {/* Cluster Name in its OWN CLUSTER COLOR */}
                <text
                  x={cl.x}
                  y={cl.y}
                  fill={cl.color}
                  fontSize={14}
                  fontWeight="600"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  className="capitalize drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] select-none"
                >
                  {cl.name}
                </text>

                {/* Badge pill matching its cluster color */}
                {cl.count && (
                  <>
                    <rect
                      x={cl.count_x}
                      y={cl.count_y - 11}
                      width={Math.max(cl.count.length * 7.5 + 10, 26)}
                      height={14}
                      rx={7}
                      fill={cl.badgeBg || cl.color}
                      className="transition-transform duration-200"
                    />
                    {/* Badge count text with proper contrast */}
                    <text
                      x={cl.count_x + 5}
                      y={cl.count_y}
                      fill={textColor}
                      fontSize={9.5}
                      fontWeight="700"
                      fontFamily="system-ui, -apple-system, monospace"
                      className="select-none"
                    >
                      {cl.count}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Layer 5: Tooltip beside hovered cluster (Requirement #9) */}
          {activeHoveredCluster && tooltipData && (
            <g
              transform={`translate(${activeHoveredCluster.count_x + 36}, ${activeHoveredCluster.y - 24})`}
              className="pointer-events-none select-none transition-all duration-150 animate-in fade-in"
            >
              {/* Tooltip Card Background: dark charcoal / navy, subtle border, rounded */}
              <rect
                x={0}
                y={0}
                width={160}
                height={58}
                rx={6}
                fill="#0d1217"
                fillOpacity={0.96}
                stroke="rgba(255, 255, 255, 0.14)"
                strokeWidth={1}
                className="drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
              />
              {/* Tooltip Header: Segment: Cluster 16 */}
              <text
                x={12}
                y={18}
                fill="#ffffff"
                fontSize={11.5}
                fontWeight="600"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {tooltipData.title}
              </text>
              {/* Tooltip Companies Count: 109,283 companies */}
              <text
                x={12}
                y={33}
                fill={activeHoveredCluster.color || '#2dd4bf'}
                fontSize={11}
                fontWeight="500"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {tooltipData.count}
              </text>
              {/* Tooltip Action Hint: Click to get all companies */}
              <text
                x={12}
                y={47}
                fill="#94a3b8"
                fontSize={9.5}
                fontWeight="400"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {tooltipData.action}
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* Floating Cluster Details Modal when clicked */}
      {selectedCluster && (
        <div className="absolute bottom-6 left-6 z-40 bg-[#111414]/95 backdrop-blur-md border border-white/[0.12] rounded-2xl p-5 shadow-2xl max-w-sm w-full animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedCluster.color || '#10b981' }}
              />
              <h3 className="font-semibold text-white text-base">
                {selectedCluster.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCluster(null)}
              className="text-white/50 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-2 text-sm text-[#9ca3af]">
            <div className="flex justify-between">
              <span>Estimated TAM:</span>
              <span className="font-semibold text-white">
                {selectedCluster.count} companies
              </span>
            </div>
            <div className="flex justify-between">
              <span>Segment Type:</span>
              <span className="text-white">High density cluster</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                navigate(PRODUCT_ROUTES.DATABASE);
              }}
              className="w-full py-2.5 rounded-xl bg-[#10b981] hover:bg-[#0d9467] text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Explore in Global B2B Database</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Bubble Button (teal circle with speech bubble, matches Screenshot 4019) */}
      <button
        type="button"
        aria-label="Contact support"
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#05ac82] hover:bg-[#049470] shadow-[0_4px_20px_rgba(5,172,130,0.4)] flex items-center justify-center text-white transition-transform hover:scale-105 cursor-pointer"
      >
        <MessageSquare className="w-5.5 h-5.5 fill-white" />
      </button>

      {/* Chat Popover */}
      {isChatOpen && (
        <div className="fixed bottom-22 right-6 z-50 w-80 bg-[#111414] border border-white/[0.12] rounded-2xl shadow-2xl p-4 text-white animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
              <span className="font-semibold text-sm">Explee Assistant</span>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="text-white/50 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#9ca3af] py-3 leading-relaxed">
            Need help filtering specific company clusters or extracting decision-makers? Contact our GTM data specialists.
          </p>
          <a
            href="https://explee.link/db-demo?utm_content=explorer"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block text-center py-2 bg-[#10b981] hover:bg-[#0d9467] text-black font-semibold rounded-xl text-xs transition-colors"
          >
            Request a custom cluster slice
          </a>
        </div>
      )}
    </div>
  );
}
