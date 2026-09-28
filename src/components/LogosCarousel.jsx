import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const LOGO_SETS = [
  {
    type: 'clients',
    label: 'Trusted by innovators',
    logos: [
      { name: 'Seonity', src: '/assets/seonity.svg', url: 'https://seonity.com/' },
      { name: 'Stayf', src: '/assets/stayf.svg', url: 'https://stayf.space/' },
      { name: '4dev.com', src: '/assets/4dev.svg', url: 'https://4dev.com/' },
      { name: 'apifdf', src: '/assets/apifdf.svg', url: 'https://apifdf.com/' }
    ]
  },
  {
    type: 'clients',
    label: 'Trusted by innovators',
    logos: [
      { name: 'Vivid', src: '/assets/vivid.svg', url: '#' },
      { name: 'HotHawk', src: '/assets/hot-hawk.svg', url: '#' },
      { name: 'Zinit', src: '/assets/zinit.svg', url: '#' },
      { name: 'Eightify', src: '/assets/eightify.svg', url: '#' }
    ]
  },
  {
    type: 'vcs',
    label: 'Backed by leading VCs',
    logos: [
      { name: 's16vc', src: '/assets/s16vc.svg', url: 'https://www.s16vc.com/' },
      { name: 'altair.vc', src: '/assets/altair.svg', url: 'https://altair.vc/' },
      { name: 'somersault vc', src: '/assets/somersault.svg', url: 'https://somersault.vc/' },
      { name: 'm2vc', src: '/assets/m2vc.svg', url: 'https://m2vc.co/' },
      { name: 'DVC.ai', src: '/assets/dvc.svg', url: 'https://dvc.ai/' }
    ]
  }
];

export default function LogosCarousel() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSetIndex((prev) => (prev + 1) % LOGO_SETS.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentSet = LOGO_SETS[currentSetIndex];

  return (
    <div className="w-full mt-12">
      <div className="logos-carousel-module__A345zq__trustRoot">
        {/* Label and G2 badge */}
        <div className="logos-carousel-module__A345zq__trustLabel text-sm md:text-base">
          <div className="logos-carousel-module__A345zq__wordSwap">
            <span
              className={`transition-all duration-500 font-medium ${
                isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              {currentSet.label}
            </span>
          </div>

          <span className="text-[28px] md:text-[32px] leading-none text-muted-foreground select-none">
            ·
          </span>

          <a
            className="flex items-center gap-2 text-muted-foreground hover:opacity-80 transition-opacity"
            href="https://www.g2.com/products/explee/reviews?source=search"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="G2"
              className="opacity-50 h-5 w-auto"
              height="20"
              width="20"
              src="/assets/g2-logo-light.svg"
            />
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-muted-foreground text-muted-foreground"
                />
              ))}
            </div>
            <span className="text-xs md:text-sm font-medium">5.0</span>
          </a>
        </div>

        {/* Logos Row */}
        <div className="logos-carousel-module__A345zq__logoArea">
          <div
            className={`logos-carousel-module__A345zq__logoRow transition-all duration-500 ${
              isTransitioning
                ? 'opacity-0 translate-y-3'
                : 'opacity-100 translate-y-0'
            }`}
          >
            {currentSet.logos.map((logo, idx) => (
              <div
                key={logo.name}
                className="logos-carousel-module__A345zq__cell logos-carousel-module__A345zq__logoBox"
                style={{ '--delay': `${idx * 0.08}s` }}
              >
                <a
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center hover:opacity-75 transition-opacity"
                  aria-label={logo.name}
                >
                  <img
                    alt={logo.name}
                    src={logo.src}
                    className="max-h-9 md:max-h-12 w-auto object-contain transition-transform duration-200 hover:scale-105"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
