import React, { useState } from 'react';
import { LayoutGrid, ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative max-w-[1200px] mx-auto flex justify-between items-center py-4 px-4 xl:px-0">
        <a className="cursor-pointer" href="/">
          <img
            alt="Explee"
            className="h-7 w-auto block"
            height="28"
            width="100"
            src="/assets/logo-light.svg"
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setProductsOpen(!productsOpen)}
              className="inline-flex items-center gap-1 hover:text-foreground/80 transition-colors duration-300 cursor-pointer text-base px-4 py-3 font-normal text-foreground"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Products</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {productsOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-card rounded-xl shadow-plaque border border-border p-2 z-50">
                <a
                  href="#pipeline"
                  onClick={() => setProductsOpen(false)}
                  className="block px-3 py-2 text-sm text-foreground hover:bg-chip rounded-lg transition-colors"
                >
                  Outreach Agent
                </a>
                <a
                  href="#pricing"
                  onClick={() => setProductsOpen(false)}
                  className="block px-3 py-2 text-sm text-foreground hover:bg-chip rounded-lg transition-colors"
                >
                  B2B Company Database
                </a>
              </div>
            )}
          </div>

          <a
            className="hover:text-foreground/80 transition-colors duration-300 cursor-pointer text-base px-4 py-3 text-foreground"
            href="#pricing"
          >
            Pricing
          </a>
          <a
            className="hover:text-foreground/80 transition-colors duration-300 cursor-pointer text-base px-4 py-3 whitespace-nowrap text-foreground"
            href="#"
          >
            Sign in
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 -mr-2 text-foreground"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 py-4 space-y-3 shadow-lg">
          <a
            href="#pipeline"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base py-2 text-foreground"
          >
            Products
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base py-2 text-foreground"
          >
            Pricing
          </a>
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base py-2 text-foreground"
          >
            Sign in
          </a>
        </div>
      )}
    </header>
  );
}
