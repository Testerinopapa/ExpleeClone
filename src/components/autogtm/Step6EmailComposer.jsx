import React, { useState, useEffect } from 'react';

export default function Step6EmailComposer({ onClaimCredits, onComplete }) {
  const fullBody = `Dobrý den Adélo,\n\nkoukám, že v House of English učíte smíšené skupiny a vedle výuky máte i online kurzy a tábory. To je pořádný zápřah.\n\nJsem zakladatel PrimKeet. Děláme hry na angličtinu pro výuku slovíček, mluvení, čtení a gramatiky.\n\nNapadlo mě, jestli žákům nedáváte něco na procvičení mezi lekcemi. Naše hry jdou zadat na doma a vidíte, jak si vedou — body, odznaky, žebříčky.\n\nStálo by za to zkusit pár her ve vaší třídě?\n\nMějte se pěkně`;

  const [typedChars, setTypedChars] = useState(60);
  const [isTypingDone, setIsTypingDone] = useState(false);

  // Typewriter streaming effect
  useEffect(() => {
    if (typedChars >= fullBody.length) {
      setIsTypingDone(true);
      return;
    }

    const timer = setTimeout(() => {
      setTypedChars(prev => Math.min(prev + 4, fullBody.length));
    }, 45);

    return () => clearTimeout(timer);
  }, [typedChars, fullBody.length]);

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-5 animate-card-enter">
      {/* Left Column: Provider Enrichment Stream */}
      <div className="md:col-span-5 space-y-3">
        {/* Lead 1: Agnes Tworz */}
        <div className="bg-white rounded-xl border border-black/[0.08] p-3.5 shadow-2xs space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold flex items-center justify-center">
                AT
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-xs">Agnes Tworz</div>
                <div className="text-[10px] text-gray-400 font-mono">teacher of English · lalschools.com</div>
              </div>
            </div>
            <span className="text-gray-400 text-xs">✓</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="rounded bg-[#f8fafc] border border-black/[0.06] px-2 py-0.5 text-[10px] font-mono text-gray-600 flex items-center gap-1">
              <span className="text-red-500 font-bold">⊕</span> hunter
            </span>
            <span className="rounded bg-[#f8fafc] border border-black/[0.06] px-2 py-0.5 text-[10px] font-mono text-gray-600 flex items-center gap-1">
              <span className="text-gray-400">⊗</span> exreacher
            </span>
            <span className="rounded bg-[#f8fafc] border border-black/[0.06] px-2 py-0.5 text-[10px] font-mono text-gray-600 flex items-center gap-1">
              <span className="text-gray-400">✉ ⊗</span> findymail
            </span>
            <span className="rounded bg-[#f8fafc] border border-black/[0.06] px-2 py-0.5 text-[10px] font-mono text-gray-600 flex items-center gap-1">
              <span className="text-indigo-500 font-bold">✝ ⊗</span> leadmagic
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-black/[0.04] text-[10px] font-mono">
            <span className="text-gray-600 truncate">agnes@lalschools.com via hunter</span>
            <span className="rounded bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 shrink-0">
              catch_all
            </span>
          </div>
        </div>

        {/* Lead 2: Aicha Chafik */}
        <div className="bg-white rounded-xl border border-black/[0.08] p-3.5 shadow-2xs space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-[#008a70] text-white text-[10px] font-bold flex items-center justify-center">
                A
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-xs">Aicha Chafik</div>
                <div className="text-[10px] text-gray-400 font-mono">Insegnante di inglese · scuola-ing...</div>
              </div>
            </div>
            <span className="text-gray-400 text-xs">⊗</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="rounded bg-[#f8fafc] border border-black/[0.06] px-2 py-0.5 text-[10px] font-mono text-gray-600 flex items-center gap-1">
              <span className="text-red-500">⊕ ⊗</span> hunter
            </span>
            <span className="rounded bg-[#f8fafc] border border-black/[0.06] px-2 py-0.5 text-[10px] font-mono text-gray-600 flex items-center gap-1">
              <span className="text-gray-400">⊗</span> exreacher
            </span>
            <span className="rounded bg-[#f8fafc] border border-black/[0.06] px-2 py-0.5 text-[10px] font-mono text-gray-600 flex items-center gap-1">
              <span className="text-gray-400">✉ ⊗</span> findymail
            </span>
            <span className="rounded bg-[#f8fafc] border border-black/[0.06] px-2 py-0.5 text-[10px] font-mono text-gray-600 flex items-center gap-1">
              <span className="text-indigo-500">✝ ⊗</span> leadmagic
            </span>
          </div>

          <div className="text-[10px] font-mono text-gray-400 pt-1 border-t border-black/[0.04]">
            no email found
          </div>
        </div>

        {/* Lead 3: Maja Skraljsky */}
        <div className="bg-white rounded-xl border border-black/[0.08] p-3.5 shadow-2xs space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold flex items-center justify-center">
                MS
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-xs">Maja Skraljsky</div>
                <div className="text-[10px] text-gray-400 font-mono">English Teacher · foreignlanguage...</div>
              </div>
            </div>
            <span className="text-gray-400 text-xs">⊗</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="rounded bg-[#f8fafc] border border-black/[0.06] px-2 py-0.5 text-[10px] font-mono text-gray-600 flex items-center gap-1">
              <span className="text-red-500">⊕ ⊗</span> hunter
            </span>
            <span className="rounded bg-[#f8fafc] border border-black/[0.06] px-2 py-0.5 text-[10px] font-mono text-gray-600 flex items-center gap-1">
              <span className="text-gray-400">⊗</span> exreacher
            </span>
            <span className="rounded bg-[#f8fafc] border border-black/[0.06] px-2 py-0.5 text-[10px] font-mono text-gray-600 flex items-center gap-1">
              <span className="text-gray-400">✉ ⊗</span> findymail
            </span>
            <span className="rounded bg-[#f8fafc] border border-black/[0.06] px-2 py-0.5 text-[10px] font-mono text-gray-600 flex items-center gap-1">
              <span className="text-indigo-500">✝ ⊗</span> leadmagic
            </span>
          </div>

          <div className="text-[10px] font-mono text-gray-400 pt-1 border-t border-black/[0.04]">
            no email found
          </div>
        </div>
      </div>

      {/* Right Column: Live Email Preview */}
      <div className="md:col-span-7 bg-white rounded-2xl border border-black/[0.08] p-6 shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          {/* Recipient Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-black/[0.06]">
            <div className="size-8 rounded-full bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center shrink-0">
              AK
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-semibold text-gray-900 text-sm">
                <span>Adéla Kholová</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#0a66c2]">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </div>
              <div className="text-xs text-gray-400 font-mono">
                English Teacher · house-of-english.cz
              </div>
            </div>
          </div>

          {/* Email meta */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-10">To</span>
              <span className="text-gray-800 font-mono">adela@house-of-english.cz</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-10">Subj</span>
              <span className="text-gray-900 font-bold">Procvičování mezi lekcemi</span>
            </div>
          </div>

          {/* Typewriter Body */}
          <div className="pt-2 text-xs text-gray-800 font-sans leading-relaxed whitespace-pre-line min-h-[170px]">
            {fullBody.slice(0, typedChars)}
            {!isTypingDone && (
              <span className="inline-block w-1.5 h-3 bg-gray-500 animate-caret-blink -mb-0.5 ml-0.5" />
            )}
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="pt-4 mt-6 border-t border-black/[0.06] flex items-center justify-between">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            title="Email settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>

          <button
            type="button"
            onClick={onClaimCredits}
            className="inline-flex items-center gap-2 bg-[#0d9467] hover:bg-[#0a7854] active:scale-[0.98] text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
              <path d="m21.854 2.147-10.94 10.939"></path>
            </svg>
            <span>Claim $30 credits & send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
