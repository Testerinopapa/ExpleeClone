import React, { useState } from 'react';
import companiesData from '../../data/autogtm_companies.json';

export default function Step4CompaniesTable({ onNext = null }) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const rows = companiesData || [];

  const filtered = rows.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.domain && c.domain.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.geo_hq_city && c.geo_hq_city.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatTraffic = (val) => {
    if (!val) return '—';
    const num = parseInt(val, 10);
    if (isNaN(num)) return val;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return Math.round(num / 1000) + 'K';
    return num.toString();
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl border border-black/[0.08] shadow-xs overflow-hidden animate-card-enter">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-black/[0.08] bg-[#fafafa] text-gray-500 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 w-[280px]">Company</th>
              <th className="py-3 px-4 min-w-[280px]">Description</th>
              <th className="py-3 px-4 w-[180px]">
                <div className="flex items-center gap-1.5">
                  <span>Location</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </div>
              </th>
              <th className="py-3 px-4 w-[110px]">
                <div className="flex items-center gap-1.5">
                  <span>Size</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </div>
              </th>
              <th className="py-3 px-4 w-[160px]">
                <div className="flex items-center gap-1.5">
                  <span>Monthly Traffic</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </div>
              </th>
              <th className="py-3 px-3 w-[40px] text-center text-gray-400 font-normal">+</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04]">
            {currentRows.map((row, idx) => {
              const growth = row.traffic_growth ? parseFloat(row.traffic_growth) : null;
              const isPositive = growth !== null && growth >= 0;

              return (
                <tr key={idx} className="hover:bg-[#fbfbfb] transition-colors">
                  {/* Company */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="size-6 rounded bg-gray-100 flex items-center justify-center shrink-0">
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${row.domain}&sz=32`}
                          alt=""
                          className="size-3.5 rounded-xs"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate text-[13px]">{row.name}</div>
                        <div className="text-[11px] font-mono text-gray-400 truncate">{row.domain}</div>
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-3 px-4">
                    <p className="text-gray-600 line-clamp-2 text-xs leading-relaxed">
                      {row.description || '—'}
                    </p>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <span className="font-mono text-[10px] text-gray-400 uppercase font-semibold">
                        {row.geo_country || ''}
                      </span>
                      <span className="truncate capitalize">
                        {row.geo_hq_city ? `${row.geo_hq_city}, ` : ''}{row.geo_country === 'GB' ? 'United Kingdom' : row.geo_country === 'MT' ? 'Malta' : row.geo_country === 'IE' ? 'Ireland' : row.geo_country || '—'}
                      </span>
                    </div>
                  </td>

                  {/* Size */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <span className="text-gray-400 tracking-tighter">••</span>
                      <span className="font-mono">{row.size_range || '—'}</span>
                    </div>
                  </td>

                  {/* Monthly Traffic & Growth */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-gray-800">
                        {formatTraffic(row.traffic)}
                      </span>
                      {growth !== null && !isNaN(growth) && (
                        <span
                          className={`inline-flex items-center text-[10px] font-mono font-bold ${
                            isPositive ? 'text-[#10b981]' : 'text-red-500'
                          }`}
                        >
                          {isPositive ? `▲${Math.round(growth)}%` : `▼${Math.abs(Math.round(growth))}%`}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-center text-gray-300"></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination & Next Button */}
      <div className="px-4 py-3 border-t border-black/[0.06] bg-[#fafafa] flex items-center justify-between">
        <div className="text-xs text-gray-500 font-mono">
          Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} companies
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-2.5 py-1 rounded border border-black/10 bg-white text-xs disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-xs text-gray-600 px-1 font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-2.5 py-1 rounded border border-black/10 bg-white text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0d9467] hover:text-[#096647] transition-colors ml-2"
            >
              <span>Continue to find people</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
