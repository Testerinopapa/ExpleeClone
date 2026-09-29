import React from 'react';
import { Calendar } from 'lucide-react';
import ProductsDropdown from '../navigation/ProductsDropdown';
import { useNavigation, PRODUCT_ROUTES } from '../../context/NavigationContext';

export default function GMHeader() {
  const { navigate } = useNavigation();

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 bg-[#090b0b]/95 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="container mx-auto max-w-[1200px] px-4">
        <div className="flex h-16 items-center justify-between">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate(PRODUCT_ROUTES.OUTREACH);
            }}
            className="flex items-center"
          >
            <img
              src="/static/logo/explee/logo-dark.svg"
              alt="Explee"
              className="h-7 w-auto"
            />
          </a>

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
              href="https://explee.link/db-demo?utm_content=gm-gm-dataset"
              target="_blank"
              rel="noopener noreferrer"
              className="gtm-demo-cta px-5 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer flex items-center gap-2 text-sm font-medium bg-[#10b981] hover:bg-[#0d9467] text-black"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Request a demo</span>
              <span className="md:hidden">Demo</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
