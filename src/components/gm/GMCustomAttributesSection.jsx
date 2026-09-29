import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const promptList = [
  'Open on Sundays in downtown Manhattan',
  'Auto repair shops with 1000+ reviews',
  'Boutique hotels with rooftop pools',
  'Specialty coffee shops near subway stations'
];

export default function GMCustomAttributesSection() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = promptList[promptIndex];
    let timer;

    if (!isDeleting) {
      if (displayText.length < currentFullText.length) {
        timer = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, 50);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length - 1));
        }, 25);
      } else {
        setIsDeleting(false);
        setPromptIndex((prev) => (prev + 1) % promptList.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, promptIndex]);

  return (
    <section className="relative overflow-hidden py-16 md:py-24 my-12 border-y border-white/[0.04]">
      {/* Decorative Geometric Floating Squares */}
      {/* Left side squares */}
      <div className="absolute left-6 md:left-24 top-1/4 w-24 h-24 md:w-32 md:h-32 bg-[#05ac82] rounded-none opacity-85 pointer-events-none" />
      <div className="absolute left-2 md:left-12 top-1/2 w-20 h-20 md:w-28 md:h-28 bg-white/[0.85] rounded-none pointer-events-none" />
      <div className="absolute left-10 md:left-32 bottom-12 w-16 h-16 md:w-24 md:h-24 bg-white/[0.85] rounded-none pointer-events-none" />

      {/* Right side squares */}
      <div className="absolute right-2 md:right-16 top-1/4 w-20 h-20 md:w-28 md:h-28 bg-white/[0.85] rounded-none pointer-events-none" />
      <div className="absolute right-6 md:right-28 top-1/2 w-20 h-20 md:w-28 md:h-28 bg-white/[0.85] rounded-none pointer-events-none" />
      <div className="absolute right-2 md:right-16 bottom-12 w-20 h-20 md:w-28 md:h-28 bg-white/[0.85] rounded-none pointer-events-none" />

      {/* Center Content */}
      <div className="relative z-10 px-8 max-w-3xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-xl md:text-2xl font-bold text-white mb-8">
          Need custom place attributes?
        </h2>

        {/* Sparkle Icon */}
        <div className="flex justify-center mb-6">
          <Sparkles className="w-10 h-10 text-[#05ac82]" />
        </div>

        {/* Animated Typewriter Prompt Field */}
        <div className="bg-[#111414] rounded-xl shadow-[0_8px_30px_rgba(34,197,94,0.15)] px-6 py-4 mb-8 max-w-xl mx-auto flex items-center border border-[#10b981]/30 hover:shadow-[0_10px_40px_rgba(34,197,94,0.25)] transition-shadow">
          <span className="text-[#9ca3af] text-base font-normal">
            {displayText}
          </span>
          <span className="inline-block w-0.5 h-5 bg-[#10b981] ml-0.5 animate-pulse align-middle" />
        </div>

        {/* Subtitle with gradient */}
        <p className="text-2xl md:text-3xl font-medium mb-8 leading-tight gm-text-gradient">
          Let's talk — we can build custom enrichment for you
        </p>

        {/* Request Demo Button */}
        <div>
          <a
            href="https://explee.link/db-demo?utm_content=gm-gm-dataset"
            target="_blank"
            rel="noopener noreferrer"
            className="gtm-demo-cta inline-flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#0d9467] text-black font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer"
          >
            Request a demo
          </a>
        </div>
      </div>
    </section>
  );
}
