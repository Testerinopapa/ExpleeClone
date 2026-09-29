import React from 'react';

export default function B2BFooter() {
  return (
    <footer className="text-white/40 text-sm border-t border-white/[0.06]">
      <div className="container mx-auto max-w-[1200px] px-4 pt-6 pb-4 md:pt-12 md:pb-6 lg:pt-20 lg:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Products */}
          <div>
            <h4 className="font-semibold text-white/60 mb-4">Products and GTM Tools</h4>
            <ul className="space-y-2">
              <li>
                <a className="hover:text-white/60 transition-colors" href="/">
                  Outreach Agent
                </a>
              </li>
              <li>
                <a className="hover:text-white/60 transition-colors" href="/b2b-database">
                  Global B2B Company Database{' '}
                  <span className="inline-block bg-brand-500/15 text-brand-400 text-[10px] px-1.5 py-0 rounded-md font-medium align-middle">
                    105M+
                  </span>
                </a>
              </li>
              <li>
                <a className="hover:text-white/60 transition-colors" href="/gm-dataset">
                  Google Maps Dataset{' '}
                  <span className="inline-block bg-brand-500/15 text-brand-400 text-[10px] px-1.5 py-0 rounded-md font-medium align-middle">
                    218M+
                  </span>
                </a>
              </li>
              <li>
                <a className="hover:text-white/60 transition-colors" href="/tools/explorer">
                  Segments Explorer
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: B2B Databases (1) */}
          <div>
            <h4 className="font-semibold text-white/60 mb-4">B2B Databases</h4>
            <ul className="space-y-2">
              <li>
                <a className="hover:text-white/60 transition-colors" href="/b2b-database/locations/north-america">
                  Companies in North America
                </a>
              </li>
              <li>
                <a className="hover:text-white/60 transition-colors" href="/b2b-database/locations/europe">
                  Companies in Europe
                </a>
              </li>
              <li>
                <a className="hover:text-white/60 transition-colors" href="/b2b-database/locations/asia-pacific">
                  Companies in Asia Pacific
                </a>
              </li>
              <li>
                <a className="hover:text-white/60 transition-colors" href="/b2b-database/locations/southeast-asia">
                  Companies in Southeast Asia
                </a>
              </li>
              <li>
                <a className="hover:text-white/60 transition-colors" href="/b2b-database/locations/latin-america">
                  Companies in Latin America
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: B2B Databases (2) */}
          <div>
            <h4 className="font-semibold text-white/60 mb-4 invisible">B2B Databases</h4>
            <ul className="space-y-2">
              <li>
                <a className="hover:text-white/60 transition-colors" href="/b2b-database/locations/middle-east">
                  Companies in Middle East
                </a>
              </li>
              <li>
                <a className="hover:text-white/60 transition-colors" href="/b2b-database/locations/cis">
                  Companies in CIS Countries
                </a>
              </li>
              <li>
                <a className="hover:text-white/60 transition-colors" href="/b2b-database/locations/oceania">
                  Companies in Oceania
                </a>
              </li>
              <li>
                <a className="hover:text-white/60 transition-colors" href="/b2b-database/locations/africa">
                  Companies in Africa
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 className="font-semibold text-white/60 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a className="hover:text-white/60 transition-colors" href="/pricing">
                  Pricing
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white/60 transition-colors"
                  href="https://api.explee.com/public/api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API documentation
                </a>
              </li>
              <li>
                <a className="hover:text-white/60 transition-colors" href="/compliance-faq">
                  Compliance FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal and Copyright */}
        <div className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs">
            <p className="mb-2 md:mb-0">
              © 2026 Explee LTD — made with 🦎 in London
            </p>
            <div className="flex items-center flex-wrap justify-center">
              <a className="hover:underline" href="/terms-of-use">
                Terms of use
              </a>
              <span className="mx-2">|</span>
              <a className="hover:underline" href="/privacy-policy">
                Privacy Policy
              </a>
            </div>
          </div>
          <p className="text-xs text-center md:text-left mt-2">
            Company No. 15759064 | VAT GB478208465 | International House, 50 Essex Street, London, WC2R 3JF
          </p>
        </div>
      </div>
    </footer>
  );
}
