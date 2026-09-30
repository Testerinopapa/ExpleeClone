import React, { useState } from 'react';

export default function FinalTrialModal({
  isOpen = true,
  onClose,
  companyDomain = 'keethub.lovable.app',
  userEmail = 'gmalavaes@gmail.com',
}) {
  const [agree, setAgree] = useState(true);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [country, setCountry] = useState('Brazil');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-black/[0.08] shadow-2xl p-6 sm:p-8 animate-card-enter my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 size-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer z-10"
          title="Close dialog"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {isSuccess ? (
          <div className="text-center py-12 space-y-4">
            <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Your $30 trial is active!</h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm">
              We've activated your free outbound credits. Your outreach sequence is scheduled to begin running.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#0d9467] text-white font-semibold text-sm hover:bg-[#0a7854] transition shadow-xs"
            >
              Go to project dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Offer, ROI, Testimonial */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
                  $30 FREE CREDITS
                </h2>
                <ul className="mt-3 space-y-2 text-xs text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-xs bg-[#10b981]" />
                    <span>AI agent finds high-intent leads 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-xs bg-[#10b981]" />
                    <span>Runs outreach from day one on pre-warmed domains</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-xs bg-[#10b981]" />
                    <span>Writes personalised emails and books demos</span>
                  </li>
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-900 mb-2">
                  Here's what your $30 gets you
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#f8fafc] border border-black/[0.06] rounded-xl p-3">
                    <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
                      <span>Replies</span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 17 4 12 9 7" />
                        <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                      </svg>
                    </div>
                    <div className="text-xl font-bold text-gray-900 font-mono">~2–3</div>
                  </div>

                  <div className="bg-[#f8fafc] border border-black/[0.06] rounded-xl p-3">
                    <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
                      <span>Meetings</span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                    </div>
                    <div className="text-xl font-bold text-gray-900 font-mono">~1–2</div>
                  </div>
                </div>
              </div>

              {/* Testimonial card */}
              <div className="bg-[#fafafa] border border-black/[0.06] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="/wole-fagbohun.jpg"
                    alt="Wole Fagbohun"
                    className="size-9 rounded-full object-cover shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-xs">Wole Fagbohun</div>
                    <div className="text-[11px] text-gray-400">PlotWeaver, Voice AI</div>
                  </div>
                </div>
                <p className="text-xs text-gray-700 italic leading-relaxed">
                  "I'm literally obsessed with this platform. It's the best, simplest, clearest platform I've seen. A dream come true for me."
                </p>
              </div>

              {/* Results stats */}
              <div>
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Results
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-[#f8fafc] border border-black/[0.04]">
                    <div className="text-[10px] text-gray-500 flex items-center justify-between">
                      <span>Hot replies</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">406</div>
                  </div>

                  <div className="p-2 rounded-lg bg-[#f8fafc] border border-black/[0.04]">
                    <div className="text-[10px] text-gray-500 flex items-center justify-between">
                      <span>Reply rate</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 17 4 12 9 7" />
                        <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                      </svg>
                    </div>
                    <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">1.7%</div>
                  </div>

                  <div className="p-2 rounded-lg bg-[#f8fafc] border border-black/[0.04]">
                    <div className="text-[10px] text-gray-500 flex items-center justify-between">
                      <span>Cost/lead</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" x2="12" y1="2" y2="22" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">$2.64</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout form & Urgency banner */}
            <div className="space-y-4">
              {/* Header Box */}
              <div className="p-3 bg-[#f8fafc] border border-black/[0.06] rounded-xl text-xs font-semibold text-gray-800">
                Alright, no more countdowns. Your $30 is going nowhere
              </div>

              {/* Urgency Progress Bar */}
              <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                  <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Only 7 trial spots left this hour</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i < 7 ? 'bg-amber-500' : 'bg-amber-200/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">Email</label>
                <div className="flex items-center justify-between rounded-lg border border-black/[0.08] bg-[#f8fafc] px-3 py-2 text-xs text-gray-700">
                  <span className="font-mono truncate">{userEmail}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  Not you? <span className="underline cursor-pointer hover:text-gray-600">Logout</span>
                </div>
              </div>

              {/* Notice */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                  <span className="text-teal-600">✦</span>
                  <span>You won't be charged yet</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Your payment method just confirms you're real. Once your $30 runs out, we'll charge $0.04 per email. Cancel anytime.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-gray-600">Card number</label>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <span className="text-[9px] font-bold tracking-tighter px-1 py-0.2 bg-blue-900 text-white rounded-xs">VISA</span>
                      <span className="size-3 rounded-full bg-red-500 inline-block -mr-1" />
                      <span className="size-3 rounded-full bg-amber-400 inline-block" />
                    </div>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="1234 1234 1234 1234"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full rounded-lg border border-black/[0.12] px-3 py-2 text-xs font-mono placeholder:text-gray-400 focus:outline-none focus:border-[#0d9467]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Expiration date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full rounded-lg border border-black/[0.12] px-3 py-2 text-xs font-mono placeholder:text-gray-400 focus:outline-none focus:border-[#0d9467]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Security code</label>
                    <input
                      type="text"
                      required
                      placeholder="CVC"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full rounded-lg border border-black/[0.12] px-3 py-2 text-xs font-mono placeholder:text-gray-400 focus:outline-none focus:border-[#0d9467]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-600 block mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-lg border border-black/[0.12] px-3 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:border-[#0d9467]"
                  >
                    <option value="Brazil">Brazil</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Spain">Spain</option>
                    <option value="France">France</option>
                  </select>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms-check"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 rounded border-black/20 text-[#0d9467] focus:ring-0"
                  />
                  <label htmlFor="terms-check" className="text-[11px] text-gray-600 leading-snug">
                    I allow Explee to email on behalf of <span className="font-mono text-gray-900">{companyDomain}</span> and accept the{' '}
                    <span className="underline cursor-pointer hover:text-gray-900">Terms of use</span>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!agree || isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#0d9467] hover:bg-[#0a7854] active:scale-[0.99] text-white font-semibold text-xs transition shadow-sm disabled:opacity-50 cursor-pointer mt-2"
                >
                  {isSubmitting ? 'Starting trial...' : 'Start free trial'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
