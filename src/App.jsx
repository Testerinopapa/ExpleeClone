import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CaseStudiesSection from './components/CaseStudiesSection';
import TestimonialsMarquee from './components/TestimonialsMarquee';
import PipelineSection from './components/PipelineSection';
import ThreeThingsSection from './components/ThreeThingsSection';
import CalculatorSection from './components/CalculatorSection';
import FaqSection from './components/FaqSection';
import BottomCtaSection from './components/BottomCtaSection';
import Footer from './components/Footer';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="autogtm-root landing theme-light landing-light min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
      <div className="landing-scroll-content flex flex-col flex-1">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <HeroSection />

        {/* Section 2: What our customers got out of it */}
        <CaseStudiesSection />

        {/* Section 3: What customers are saying */}
        <TestimonialsMarquee />

        {/* Section 4: We run the entire pipeline */}
        <PipelineSection />

        {/* Section 5: Three things nobody else has */}
        <ThreeThingsSection />

        {/* Section 6: Pay as you go with no subscription */}
        <CalculatorSection />

        {/* Section 7: Common questions */}
        <FaqSection />

        {/* Section 8: Bottom CTA - This one really works */}
        <BottomCtaSection />

        {/* Section 9: Footer */}
        <Footer />
      </div>

      {/* Floating Support Chat Widget (as seen on all screenshots) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setChatOpen(!chatOpen)}
          aria-label="Chat support"
          className="w-14 h-14 rounded-full bg-[#00947c] hover:bg-[#007f6a] text-white flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <MessageSquare className="w-6 h-6 fill-current" />
        </button>

        {chatOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-card rounded-2xl shadow-2xl border border-border p-4 mb-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="font-medium text-foreground text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                Explee Support
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <div className="py-4 text-xs text-muted-foreground leading-relaxed">
              Hi there! 👋 How can we help you today? Leave us a message and we'll reply shortly.
            </div>
            <input
              type="text"
              placeholder="Write a message..."
              className="w-full bg-chip rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none border border-border/40 focus:border-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}
