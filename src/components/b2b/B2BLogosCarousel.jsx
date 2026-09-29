import React, { useState, useEffect } from 'react';

const logos = [
  { alt: 'Vivid', src: '/static/images/landing/clients/dark/vivid.svg' },
  { alt: 'HotHawk', src: '/static/images/landing/clients/dark/hot-hawk.svg' },
  { alt: 'Zinit', src: '/static/images/landing/clients/dark/zinit.svg' },
  { alt: 'Eightify', src: '/static/images/landing/clients/dark/eightify.svg' },
];

export default function B2BLogosCarousel() {
  return (
    <div className="logos-carousel-module__Psif5a__root">
      <div className="logos-carousel-module__Psif5a__logoRow">
        {logos.map((logo, index) => (
          <div
            key={logo.alt}
            className="logos-carousel-module__Psif5a__logo"
            data-animate="false"
            data-state="exit"
            style={{ '--delay': `${index * 0.1}s` }}
          >
            <img
              alt={logo.alt}
              className="max-h-16 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
              height="64"
              width="224"
              src={logo.src}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
