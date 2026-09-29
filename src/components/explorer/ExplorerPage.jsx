import React, { useState } from 'react';
import ProductsDropdown from '../navigation/ProductsDropdown';
import { Compass, Search, Filter, Layers, Share2, ZoomIn, ZoomOut, Building2, Users, MapPin, Globe } from 'lucide-react';
import { useNavigation, PRODUCT_ROUTES } from '../../context/NavigationContext';

const sampleNodes = [
  { id: 1, name: 'Consolto', type: 'Target Company', sector: 'B2B SaaS', location: 'Tel Aviv', connections: 14, color: 'bg-emerald-500' },
  { id: 2, name: 'Vivid Money', type: 'Fintech', sector: 'Banking & Cards', location: 'Berlin', connections: 28, color: 'bg-blue-500' },
  { id: 3, name: 'Eightify', type: 'AI Tooling', sector: 'Productivity', location: 'San Francisco', connections: 9, color: 'bg-purple-500' },
  { id: 4, name: 'Stayf', type: 'Hospitality Tech', sector: 'Travel & Living', location: 'London', connections: 16, color: 'bg-amber-500' },
  { id: 5, name: 'Seonity', type: 'Cybersecurity', sector: 'Threat Intel', location: 'Paris', connections: 22, color: 'bg-rose-500' },
  { id: 6, name: 'Amplixity', type: 'AdTech', sector: 'Marketing', location: 'New York', connections: 11, color: 'bg-cyan-500' },
];

export default function ExplorerPage() {
  const { navigate } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(sampleNodes[0]);
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredNodes = sampleNodes.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || node.sector.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#090b0b] text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 transition-all duration-300 bg-[#090b0b]/95 backdrop-blur-sm border-b border-white/[0.08]">
        <div className="container mx-auto max-w-[1200px] px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate(PRODUCT_ROUTES.OUTREACH);
              }}
              className="flex items-center"
            >
              <img
                src="/static/logo/explee/logo-dark.svg"
                alt="Explee"
                className="h-7 w-auto"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-4">
              <ProductsDropdown theme="dark" />

              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/#pricing');
                }}
                className="text-white/80 hover:text-white transition-colors text-sm font-medium px-3 py-2"
              >
                Pricing
              </a>

              <a
                href="https://app.explee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium px-3 py-2"
              >
                Sign in
              </a>

              <a
                href="https://explee.link/db-demo?utm_content=explorer"
                target="_blank"
                rel="noopener noreferrer"
                className="gtm-demo-cta px-4 py-2 rounded-lg text-sm font-medium bg-[#10b981] hover:bg-[#0d9467] text-black transition-colors"
              >
                Request a demo
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-[1200px] px-4 py-12">
        {/* Explorer Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full px-4 py-1.5 mb-6 text-xs md:text-sm text-[#10b981]">
            <Compass className="w-4 h-4" />
            <span>Company Graph Explorer</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Explore and filter the{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#05ac82] to-[#15addc]">
              company graph
            </span>
          </h1>

          <p className="text-[#9ca3af] text-base md:text-lg leading-relaxed">
            Navigate multi-dimensional relationships between 105M+ companies, decision-makers, tech stacks, and industries.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-[#111414] rounded-2xl border border-white/[0.08] p-4 mb-8 shadow-xl flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, technologies, or keywords..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[#9ca3af] focus:outline-none focus:border-[#10b981]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['All', 'SaaS', 'Fintech', 'AI', 'Travel', 'Cyber'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  activeFilter === f
                    ? 'bg-[#10b981] text-black font-semibold'
                    : 'bg-white/[0.05] text-[#9ca3af] hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Graph Exploration Canvas & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Graph Nodes Grid */}
          <div className="lg:col-span-2 bg-[#111414] rounded-2xl border border-white/[0.08] p-6 relative overflow-hidden min-h-[440px] flex flex-col justify-between">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Controls overlay */}
            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                <Layers className="w-4 h-4 text-[#10b981]" />
                <span>Showing {filteredNodes.length} company clusters</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.04] rounded-lg p-1 border border-white/[0.06]">
                <button
                  type="button"
                  aria-label="Zoom in"
                  className="p-1 hover:bg-white/[0.08] rounded text-[#9ca3af] hover:text-white"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Zoom out"
                  className="p-1 hover:bg-white/[0.08] rounded text-[#9ca3af] hover:text-white"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Nodes Map */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-white/[0.08] border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                        : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.2] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full ${node.color} shrink-0 animate-pulse`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-white truncate">{node.name}</div>
                      <div className="text-xs text-[#9ca3af]">{node.sector} • {node.location}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/[0.06] text-[#9ca3af] shrink-0 font-mono">
                      {node.connections} links
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Graph Stats */}
            <div className="relative z-10 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#9ca3af]">
              <span>Click a node to inspect company graph metadata</span>
              <span className="text-[#10b981]">Real-time query engine ready</span>
            </div>
          </div>

          {/* Node Inspector Sidebar */}
          <div className="bg-[#111414] rounded-2xl border border-white/[0.08] p-6 flex flex-col justify-between">
            {selectedNode ? (
              <div className="space-y-6">
                <div className="pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${selectedNode.color}`} />
                    <span className="text-xs font-semibold text-[#10b981] uppercase tracking-wider">
                      {selectedNode.type}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{selectedNode.name}</h3>
                  <p className="text-xs text-[#9ca3af] mt-1">{selectedNode.sector}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                    <span className="text-[#9ca3af] flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> Location
                    </span>
                    <span className="font-medium text-white">{selectedNode.location}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                    <span className="text-[#9ca3af] flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" /> Decision Makers
                    </span>
                    <span className="font-medium text-white">48 profiles</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                    <span className="text-[#9ca3af] flex items-center gap-2">
                      <Share2 className="w-3.5 h-3.5" /> Graph Neighbors
                    </span>
                    <span className="font-medium text-white">{selectedNode.connections} companies</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`/b2b-database`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(PRODUCT_ROUTES.DATABASE);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] text-white py-2.5 rounded-xl text-xs font-semibold transition-colors"
                  >
                    View in B2B Database
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center text-[#9ca3af] py-12">
                Select a company node to view relationships
              </div>
            )}

            <div className="pt-6 border-t border-white/[0.06]">
              <a
                href="https://explee.link/db-demo?utm_content=explorer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#0d9467] text-black font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                Access Full Company Graph
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 bg-[#090b0b] mt-16">
        <div className="container mx-auto max-w-[1200px] px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#9ca3af]">
            <p>© 2026 Explee LTD — made with 🦎 in London</p>
            <div className="flex items-center gap-6">
              <a href="/terms" className="hover:text-white transition-colors">Terms of use</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/compliance" className="hover:text-white transition-colors">Compliance FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
