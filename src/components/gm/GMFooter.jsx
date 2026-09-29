import React from 'react';

export default function GMFooter() {
  return (
    <>
      <footer className="border-t border-white/[0.08] py-8 bg-[#090b0b]">
        <div className="container mx-auto max-w-[1200px] px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#9ca3af]">
              © 2026 Explee LTD — made with 🦎 in London
            </p>
            <div className="flex items-center gap-6 text-sm text-[#9ca3af]">
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of use
              </a>
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/compliance" className="hover:text-white transition-colors">
                Compliance FAQ
              </a>
            </div>
          </div>
          <p className="text-xs text-[#9ca3af]/70 mt-4 text-center md:text-left">
            Company No. 15759064 | VAT GB478208465 | International House, 50 Essex Street, London, WC2R 3JF
          </p>
        </div>
      </footer>

      {/* Floating Chat Widget (Crisp badge visible on all screenshots) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          aria-label="Open chat"
          className="w-12 h-12 bg-[#05ac82] rounded-full shadow-[0_4px_20px_rgba(5,172,130,0.4)] flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer"
        >
          <svg
            className="w-6 h-6 fill-white"
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </button>
      </div>
    </>
  );
}
