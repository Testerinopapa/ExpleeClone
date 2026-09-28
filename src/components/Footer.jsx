import React from 'react';

export default function Footer() {
  return (
    <footer className="text-muted-foreground text-base border-t border-border mt-16 bg-background">
      <div className="container mx-auto max-w-[1200px] px-4 pt-8 pb-6 md:pt-14 md:pb-8 lg:pt-20 lg:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 */}
          <div>
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-4">
              Products and GTM Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a className="hover:text-foreground transition-colors" href="/">
                  Outreach Agent
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors inline-flex items-center gap-1.5" href="#">
                  <span>Global B2B Company Database</span>
                  <span className="inline-block bg-chip text-foreground text-[10px] px-1.5 py-0.5 rounded-md font-medium align-middle border border-border/40">
                    105M+
                  </span>
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors inline-flex items-center gap-1.5" href="#">
                  <span>Google Maps Dataset</span>
                  <span className="inline-block bg-chip text-foreground text-[10px] px-1.5 py-0.5 rounded-md font-medium align-middle border border-border/40">
                    218M+
                  </span>
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="#">
                  Segments Explorer
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-4">
              B2B Databases
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a className="hover:text-foreground transition-colors" href="#">
                  Companies in North America
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="#">
                  Companies in Europe
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="#">
                  Companies in Asia Pacific
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="#">
                  Companies in Southeast Asia
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="#">
                  Companies in Latin America
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-4 hidden lg:block lg:invisible">
              B2B Databases
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a className="hover:text-foreground transition-colors" href="#">
                  Companies in Middle East
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="#">
                  Companies in CIS Countries
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="#">
                  Companies in Oceania
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="#">
                  Companies in Africa
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a className="hover:text-foreground transition-colors" href="#pricing">
                  Pricing
                </a>
              </li>
              <li>
                <a
                  className="hover:text-foreground transition-colors"
                  href="https://api.explee.com/public/api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API documentation
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="#">
                  AutoGTM is now Explee
                </a>
              </li>
              <li>
                <a className="hover:text-foreground transition-colors" href="#">
                  Compliance FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-6 border-t border-border/40 text-xs md:text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="mb-2 md:mb-0">
              © 2026 Explee LTD, made with 🦎 in London
            </p>
            <div className="flex items-center flex-wrap justify-center">
              <a className="hover:underline hover:text-foreground" href="#">
                Terms of use
              </a>
              <span className="mx-2">|</span>
              <a className="hover:underline hover:text-foreground" href="#">
                Privacy Policy
              </a>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/80 text-center md:text-left mt-3">
            Company No. 15759064 | VAT GB478208465 | International House, 50 Essex Street, London, WC2R 3JF
          </p>
        </div>
      </div>
    </footer>
  );
}
