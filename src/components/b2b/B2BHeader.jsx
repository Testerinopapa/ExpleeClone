import React from 'react';
import { Calendar } from 'lucide-react';
import ProductsDropdown from '../navigation/ProductsDropdown';
import { useNavigation, PRODUCT_ROUTES } from '../../context/NavigationContext';

export default function B2BHeader() {
  const { navigate } = useNavigation();

  return (
    <header className="sticky top-0 z-50 bg-[#090B0B]/80 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center py-3 px-4">
        {/* Logo */}
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
            className="h-7 w-auto"
            height="28"
            width="100"
            src="/static/logo/explee/logo-dark.svg"
          />
        </a>

        {/* Right side nav items */}
        <div className="flex items-center gap-3 md:gap-4">
          <ProductsDropdown theme="dark" />

          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              navigate('/#pricing');
            }}
            className="hidden sm:inline-block text-white/80 hover:text-white transition-colors text-sm font-medium px-3 py-2 cursor-pointer"
          >
            Pricing
          </a>

          <a
            href="https://app.explee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block text-white/80 hover:text-white transition-colors text-sm font-medium px-3 py-2"
          >
            Sign in
          </a>

          <a
            className="gtm-demo-cta font-medium px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm bg-brand-500 hover:bg-brand-600 hover:shadow-[0_6px_16px_-6px_rgba(0,255,194,0.4)] text-black cursor-pointer"
            href="https://explee.link/db-demo?utm_content=global"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden md:inline">Request a demo</span>
            <span className="md:hidden">Demo</span>
          </a>
        </div>
      </div>
    </header>
  );
}
