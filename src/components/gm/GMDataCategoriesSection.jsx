import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Plus, Calendar } from 'lucide-react';
import categoriesData from '../../data/gm/gmCategories.json';
import structuredCode from '../../data/gm/gm_code_preview_structured.json';

export default function GMDataCategoriesSection() {
  const [activeCategory, setActiveCategory] = useState('general');
  const sectionRefs = useRef({});
  const isClickingRef = useRef(false);
  const OFFSET = 96;

  // Scroll to selected category
  const scrollToCategory = (e, id) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveCategory(id);
    isClickingRef.current = true;

    const el = sectionRefs.current[id];
    if (el) {
      const rect = el.getBoundingClientRect();
      const targetY = rect.top + window.scrollY - OFFSET;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      setTimeout(() => {
        isClickingRef.current = false;
      }, 700);
    }
  };

  // Scrollspy to track which category section is currently in view
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking || isClickingRef.current) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const ids = categoriesData.map((c) => c.id);
        const threshold = 180;

        let current = ids[0];
        for (let i = 0; i < ids.length; i++) {
          const el = sectionRefs.current[ids[i]];
          if (el && el.getBoundingClientRect().top <= threshold) {
            current = ids[i];
          } else {
            break;
          }
        }
        setActiveCategory(current);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="mb-24">
      <div className="container mx-auto max-w-[1200px] px-4">
        {/* Section Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
          What's Inside Our Database
        </h2>

        {/* Showcase Container: Flex row without items-start so sidebar stays sticky */}
        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Left Sticky Sidebar */}
          <nav className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24 bg-[#111414] rounded-2xl border border-white/[0.08] overflow-hidden">
              <div className="p-4 border-b border-white/[0.08] bg-white/[0.04]">
                <h3 className="font-semibold text-white text-sm">Data Categories</h3>
              </div>

              <ul className="divide-y divide-white/[0.06] max-h-[60vh] overflow-y-auto lg:max-h-none lg:overflow-visible">
                {categoriesData.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={(e) => scrollToCategory(e, cat.id)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors duration-150 border-l-2 ${
                          isActive
                            ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]'
                            : 'hover:bg-white/[0.04] text-[#9ca3af] hover:text-white border-transparent'
                        }`}
                      >
                        <ChevronRight
                          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                            isActive ? 'rotate-90 text-[#10b981]' : 'text-[#9ca3af]'
                          }`}
                        />
                        <span className="flex-1 text-sm font-medium truncate">{cat.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-[#10b981]/20 text-[#10b981]'
                              : 'bg-white/[0.06] text-[#9ca3af]'
                          }`}
                        >
                          {cat.fields.length}
                        </span>
                      </button>
                    </li>
                  );
                })}

                {/* Additional Sidebar Actions */}
                <li>
                  <a
                    href="https://explee.link/db-demo?utm_content=gm-gm-dataset"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-4 py-3 flex items-center gap-3 text-[#9ca3af] hover:text-white hover:bg-white/[0.04] transition-colors border-l-2 border-transparent"
                  >
                    <Plus className="h-4 w-4 shrink-0 text-[#10b981]" />
                    <span className="flex-1 text-sm font-medium">Add custom field</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://explee.link/db-demo?utm_content=gm-gm-dataset"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-4 py-3 flex items-center gap-3 text-[#9ca3af] hover:text-white hover:bg-white/[0.04] transition-colors border-l-2 border-transparent"
                  >
                    <Calendar className="h-4 w-4 shrink-0 text-[#10b981]" />
                    <span className="flex-1 text-sm font-medium">Request a demo</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          {/* Right Scrolling Content Showcase */}
          <div className="flex-1 min-w-0 space-y-8">
            {categoriesData.map((cat) => {
              const codeLines = structuredCode[cat.id] || [];

              return (
                <section
                  key={cat.id}
                  id={cat.id}
                  ref={(el) => (sectionRefs.current[cat.id] = el)}
                  className="scroll-mt-24"
                >
                  {/* Category Header */}
                  <div className="bg-white/[0.04] rounded-t-2xl p-4 border border-b-0 border-white/[0.08] flex items-center justify-between">
                    <h2 className="font-semibold text-white text-sm">{cat.name}</h2>
                    <span className="text-xs text-[#9ca3af]">{cat.count}</span>
                  </div>

                  {/* Category Content: Two Columns */}
                  <div className="bg-[#111414] rounded-b-2xl border border-t-0 border-white/[0.08]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                      {/* Left: Fields List */}
                      <div className="space-y-1 divide-y divide-white/[0.06]">
                        {cat.fields.map((f, idx) => (
                          <div key={idx} className="flex items-start gap-3 py-3">
                            {/* Fill Rate Badge with Tooltip */}
                            <span className="relative group shrink-0">
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-semibold bg-[#10b981]/15 text-[#10b981] min-w-[50px] text-center font-mono">
                                {f.pct}
                              </span>
                              <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-[#090b0b] border border-white/10 text-white text-xs px-2.5 py-1 rounded shadow-lg whitespace-nowrap z-30">
                                Fill rate — percentage of records in the dataset with this field filled
                              </span>
                            </span>

                            {/* Field Name & Description */}
                            <div className="flex-1 min-w-0 text-sm leading-relaxed">
                              <span className="font-semibold text-white">{f.name}</span>
                              <span className="text-[#9ca3af] ml-1.5">— {f.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right: Syntax-Highlighted Code Preview Box */}
                      <div className="h-fit">
                        <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs md:text-sm overflow-x-auto border border-white/[0.08] shadow-inner">
                          {codeLines.map((line, lIdx) => {
                            if (line.type === 'comment') {
                              return (
                                <div key={lIdx} className="text-slate-500 mb-1 select-none">
                                  {line.text}
                                </div>
                              );
                            }

                            return (
                              <div
                                key={lIdx}
                                className={`flex items-baseline py-0.5 ${
                                  line.highlight
                                    ? 'bg-blue-500/20 -mx-2 px-2 rounded border border-blue-500/30'
                                    : ''
                                }`}
                              >
                                <span className="text-slate-500 select-none w-6 text-right mr-3 shrink-0">
                                  {line.lineNum}
                                </span>
                                <span className="text-emerald-400">"{line.key}"</span>
                                <span className="text-slate-400 mr-1.5">:</span>
                                <span className="text-amber-300 break-all">{line.val}</span>
                                <span className="text-slate-400">,</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
