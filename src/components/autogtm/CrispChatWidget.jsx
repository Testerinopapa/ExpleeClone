import React, { useState } from 'react';

export default function CrispChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl border border-black/10 shadow-2xl p-4 animate-card-enter space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#10b981]" />
              <span className="font-semibold text-xs text-gray-900">Explee Support</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-gray-600">
            Have questions about setting up your GTM campaign or researching your company? We're here to help!
          </p>
          <div className="pt-2">
            <input
              type="text"
              placeholder="Ask a question..."
              className="w-full text-xs rounded-lg border border-black/15 p-2 focus:outline-none focus:border-[#00947c]"
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
        className="size-13 rounded-full bg-[#00947c] hover:bg-[#00816c] active:scale-95 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      </button>
    </div>
  );
}
