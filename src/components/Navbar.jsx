import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ProductsDropdown from './navigation/ProductsDropdown';
import { useNavigation, PRODUCT_ROUTES } from '../context/NavigationContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { navigate } = useNavigation();

  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative max-w-[1200px] mx-auto flex justify-between items-center py-4 px-4 xl:px-0">
        <a
          className="cursor-pointer"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate(PRODUCT_ROUTES.OUTREACH);
          }}
        >
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
          {/* Products Dropdown */}
          <ProductsDropdown theme="light" />

          <a
            className="hover:text-foreground/80 transition-colors duration-300 cursor-pointer text-base px-4 py-3 text-foreground"
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('pricing');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                navigate('/#pricing');
              }
            }}
          >
            Pricing
          </a>

          <a
            className="hover:text-foreground/80 transition-colors duration-300 cursor-pointer text-base px-4 py-3 whitespace-nowrap text-foreground"
            href="/sign-in"
            onClick={(e) => {
              e.preventDefault();
              navigate(PRODUCT_ROUTES.SIGN_IN);
            }}
          >
            Sign in
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 -mr-2 text-foreground cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 py-4 space-y-2 shadow-lg">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-1">
            Products
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              navigate(PRODUCT_ROUTES.OUTREACH);
            }}
            className="block text-sm py-2 text-foreground font-medium hover:text-brand-600"
          >
            Outreach Agent
          </a>
          <a
            href="/public/api/docs"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              navigate(PRODUCT_ROUTES.API);
            }}
            className="block text-sm py-2 text-foreground font-medium hover:text-brand-600"
          >
            API
          </a>
          <a
            href="/b2b-database"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              navigate(PRODUCT_ROUTES.DATABASE);
            }}
            className="block text-sm py-2 text-foreground font-medium hover:text-brand-600"
          >
            Database
          </a>
          <a
            href="/gm-dataset"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              navigate(PRODUCT_ROUTES.GM);
            }}
            className="block text-sm py-2 text-foreground font-medium hover:text-brand-600"
          >
            Google Maps Dataset
          </a>
          <a
            href="/tools/explorer"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              navigate(PRODUCT_ROUTES.EXPLORER);
            }}
            className="block text-sm py-2 text-foreground font-medium hover:text-brand-600"
          >
            Explorer
          </a>

          <div className="border-t border-border my-2 pt-2">
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                const el = document.getElementById('pricing');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigate('/#pricing');
              }}
              className="block text-base py-2 text-foreground"
            >
              Pricing
            </a>
            <a
              href="/sign-in"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                navigate(PRODUCT_ROUTES.SIGN_IN);
              }}
              className="block text-base py-2 text-foreground"
            >
              Sign in
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
