import React from 'react';

export default function PeopleSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl border border-black/[0.08] shadow-xs overflow-hidden animate-card-enter">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-black/[0.08] bg-[#fafafa] text-gray-500 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 w-[280px]">Name</th>
              <th className="py-3 px-4 w-[240px]">Job Title</th>
              <th className="py-3 px-4 min-w-[200px]">Company</th>
              <th className="py-3 px-4 w-[180px]">Geo</th>
              <th className="py-3 px-3 w-[40px] text-center text-gray-400 font-normal">+</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04]">
            {[...Array(8)].map((_, idx) => (
              <tr key={idx} className="h-14">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-full bg-gray-200/70 shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="h-3 bg-gray-200/80 rounded w-28" />
                      <div className="h-2 bg-gray-200/50 rounded w-16" />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-2.5 bg-gray-200/70 rounded w-36" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-2.5 bg-gray-200/70 rounded w-32" />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <div className="size-3.5 rounded bg-gray-200/60" />
                    <div className="h-2.5 bg-gray-200/70 rounded w-24" />
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <div className="size-4 bg-gray-200/50 rounded mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
