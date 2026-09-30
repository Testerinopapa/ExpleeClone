import React, { useState } from 'react';
import peopleData from '../../data/autogtm_people.json';

export default function Step5PeopleTable({ onNext = null }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const rows = peopleData || [];
  const totalPages = Math.ceil(rows.length / pageSize);
  const currentRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getCountryName = (code) => {
    const map = {
      US: 'United States',
      GB: 'United Kingdom',
      HR: 'Croatia',
      IT: 'Italy',
      ES: 'Spain',
      RO: 'Romania',
      FR: 'France',
      PT: 'Portugal',
      CZ: 'Czech Republic',
      DE: 'Germany',
      MT: 'Malta',
      IE: 'Ireland',
    };
    return map[code?.toUpperCase()] || code || '—';
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl border border-black/[0.08] shadow-xs overflow-hidden animate-card-enter">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-black/[0.08] bg-[#fafafa] text-gray-500 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 w-[280px]">Name</th>
              <th className="py-3 px-4 w-[240px]">
                <div className="flex items-center gap-1.5">
                  <span>Job Title</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </div>
              </th>
              <th className="py-3 px-4 min-w-[200px]">Company</th>
              <th className="py-3 px-4 w-[180px]">
                <div className="flex items-center gap-1.5">
                  <span>Geo</span>
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
            {currentRows.map((person, idx) => {
              const fullName = `${person.first_name || ''} ${person.last_name || ''}`.trim();
              const initials = `${person.first_name ? person.first_name.charAt(0) : ''}${
                person.last_name ? person.last_name.charAt(0) : ''
              }`.toUpperCase() || 'P';

              return (
                <tr key={idx} className="hover:bg-[#fbfbfb] transition-colors">
                  {/* Name with initials and LinkedIn icon */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="size-6 rounded-full bg-gray-100 border border-black/[0.06] text-gray-700 flex items-center justify-center font-semibold text-[10px] shrink-0">
                        {initials}
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold text-gray-900 truncate text-[13px]">
                          {fullName}
                        </span>
                        {/* LinkedIn icon */}
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-[#0a66c2] shrink-0"
                        >
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                      </div>
                    </div>
                  </td>

                  {/* Job Title */}
                  <td className="py-3 px-4">
                    <span className="text-gray-700 truncate block text-xs">
                      {person.title || person.headline || '—'}
                    </span>
                  </td>

                  {/* Company */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="size-4 rounded-xs bg-gray-200 shrink-0" />
                      <span className="font-mono text-gray-600 text-xs truncate">
                        {person.company_domain || '—'}
                      </span>
                    </div>
                  </td>

                  {/* Geo */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <span className="font-mono text-[10px] text-gray-400 uppercase font-semibold">
                        {person.country || ''}
                      </span>
                      <span className="truncate">
                        {getCountryName(person.country)}
                      </span>
                    </div>
                  </td>

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
          Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, rows.length)} of {rows.length} people
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
              <span>Continue to write emails</span>
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
