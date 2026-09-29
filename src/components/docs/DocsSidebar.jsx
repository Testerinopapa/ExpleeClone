import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronRight, Sun, Moon } from 'lucide-react';
import endpointsData from '../../data/endpointsData.json';

const sectionDefinitions = [
  { key: 'autogtm', label: 'AutoGTM' },
  { key: 'search', label: 'Search' },
  { key: 'contact', label: 'Contact' },
  { key: 'agents', label: 'Agents' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'billing', label: 'Billing' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'deduplication', label: 'Deduplication' },
];

const methodColors = {
  GET: 'text-[#009485]',
  POST: 'text-[#0a52af]',
  PATCH: 'text-[#ffaa01]',
  DEL: 'text-[#d52b2a]',
  DELETE: 'text-[#d52b2a]',
};

export default function DocsSidebar({ activeRoute = 'introduction', onSelectRoute, onBackToLanding }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const activeItemRef = useRef(null);
  const [openSections, setOpenSections] = useState({
    autogtm: true,
    search: true,
    contact: true,
    agents: true,
    tasks: true,
    billing: true,
    feedback: true,
    deduplication: true,
  });

  // Ensure active endpoint's section is opened
  useEffect(() => {
    const currentTag = activeRoute?.startsWith('tag-')
      ? activeRoute.replace('tag-', '')
      : endpointsData.find(ep => ep.id === activeRoute)?.tag;

    if (currentTag) {
      setOpenSections(prev => ({
        ...prev,
        [currentTag]: true
      }));
    }
  }, [activeRoute]);

  // Auto-scroll active item into view
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeItemRef.current) {
        activeItemRef.current.scrollIntoView({
          behavior: 'instant',
          block: 'center',
        });
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [activeRoute, openSections]);

  const toggleSection = (key) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <aside className="w-[288px] shrink-0 border-r border-[rgba(0,0,0,0.1)] bg-white flex flex-col h-screen sticky top-0 font-['Inter',sans-serif] text-[13px] select-none z-20">
      {/* Explee Logo / Back to Products */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-[rgba(0,0,0,0.06)]">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (onBackToLanding) {
              onBackToLanding();
            } else {
              window.location.href = '/';
            }
          }}
          className="flex items-center gap-2 text-[#1b1b1b] hover:opacity-80 transition-opacity cursor-pointer"
          title="Back to Explee Home"
        >
          <img
            src="/assets/logo-light.svg"
            alt="Explee"
            className="h-5 w-auto"
          />
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-100 px-1.5 py-0.5 rounded">API Docs</span>
        </a>
      </div>

      {/* Search Bar matching Scalar */}
      <div className="flex gap-1.5 px-3 pt-3">
        <div className="flex items-center rounded-[3px] border border-[rgba(0,0,0,0.1)] text-base h-8 gap-1.5 pl-2 pr-1.5 w-full bg-white focus-within:border-[#009485] transition-colors">
          <Search className="w-3.5 h-3.5 text-[#8e8e8e] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="text-[13px] text-[#1b1b1b] placeholder-[#8e8e8e] flex-1 bg-transparent border-none outline-none min-w-0"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] text-[#8e8e8e] hover:text-[#1b1b1b] cursor-pointer"
            >
              ✕
            </button>
          ) : (
            <span className="text-[11px] text-[#8e8e8e] font-mono px-1 py-0.5 bg-[#f3f3f3] rounded border border-[rgba(0,0,0,0.06)]">
              ^K
            </span>
          )}
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-2 space-y-0.5 custom-scrollbar">
        {/* Introduction Item */}
        {(!searchQuery || 'introduction'.includes(searchQuery.toLowerCase())) && (
          <button
            ref={activeRoute === 'introduction' ? activeItemRef : null}
            onClick={() => onSelectRoute && onSelectRoute('introduction')}
            className={`w-full flex items-center h-8 px-2 rounded-[3px] text-left text-[14px] font-medium transition-colors cursor-pointer ${
              activeRoute === 'introduction'
                ? 'bg-[#ecf8f6] text-[#009485]'
                : 'text-[#1b1b1b] hover:bg-black/[0.04]'
            }`}
          >
            <span>Introduction</span>
          </button>
        )}

        {/* Dynamic Section Accordions for all Tags */}
        {sectionDefinitions.map(sec => {
          const endpoints = endpointsData.filter(ep => ep.tag === sec.key);
          const filteredEndpoints = endpoints.filter(ep =>
            !searchQuery ||
            ep.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ep.method.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (searchQuery && filteredEndpoints.length === 0) return null;

          const isOpen = searchQuery ? true : !!openSections[sec.key];
          const isTagActive = activeRoute === 'tag-' + sec.key;

          return (
            <div key={sec.key} className="pt-0.5">
              <div
                ref={isTagActive ? activeItemRef : null}
                onClick={() => {
                  toggleSection(sec.key);
                  if (onSelectRoute) onSelectRoute('tag-' + sec.key);
                }}
                className={`flex items-center justify-between h-8 px-2 rounded-[3px] text-[14px] cursor-pointer group font-medium transition-colors ${
                  isTagActive
                    ? 'bg-[#ecf8f6] text-[#009485]'
                    : 'text-[#1b1b1b] hover:bg-black/[0.04]'
                }`}
              >
                <span>{sec.label}</span>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[#8e8e8e] group-hover:text-[#1b1b1b]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[#8e8e8e] group-hover:text-[#1b1b1b]" />
                )}
              </div>

              {isOpen && (
                <div className="space-y-0.5 pt-0.5">
                  {filteredEndpoints.map(ep => {
                    const isItemActive = activeRoute === ep.id;
                    return (
                      <button
                        key={ep.id}
                        ref={isItemActive ? activeItemRef : null}
                        onClick={() => onSelectRoute && onSelectRoute(ep.id)}
                        className={`w-full flex items-center justify-between min-h-8 pl-5 pr-2 py-1 rounded-[3px] text-left text-[13px] group transition-colors cursor-pointer ${
                          isItemActive
                            ? 'bg-[#ecf8f6] text-[#009485] font-medium'
                            : 'text-[#606060] hover:bg-black/[0.04] hover:text-[#1b1b1b]'
                        }`}
                      >
                        <span className="truncate pr-2 leading-tight">{ep.label}</span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-tight shrink-0 font-mono ${
                            methodColors[ep.method] || 'text-[#757575]'
                          }`}
                        >
                          {ep.method}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer / Powered by Scalar matching reference */}
      <div className="px-3 py-2.5 border-t border-[rgba(0,0,0,0.1)] bg-white flex items-center justify-between text-xs text-[#8e8e8e]">
        <a
          href="https://scalar.com"
          target="_blank"
          rel="noreferrer"
          className="text-[12px] text-[#757575] hover:text-[#1b1b1b] transition-colors"
        >
          Powered by Scalar
        </a>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="relative flex items-center w-11 h-6 rounded-full p-0.5 bg-[#f3f3f3] border border-[rgba(0,0,0,0.1)] cursor-pointer transition-colors"
          title="Toggle color theme"
        >
          <div
            className={`size-[18px] rounded-full flex items-center justify-center bg-white border border-[rgba(0,0,0,0.1)] shadow-2xs transition-transform duration-200 ${
              darkMode ? 'translate-x-5' : 'translate-x-0'
            }`}
          >
            {darkMode ? (
              <Moon className="w-2.5 h-2.5 text-[#1b1b1b]" />
            ) : (
              <Sun className="w-2.5 h-2.5 text-[#1b1b1b]" />
            )}
          </div>
        </button>
      </div>
    </aside>
  );
}
