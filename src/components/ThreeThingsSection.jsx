import React, { useRef, useState } from 'react';

const FEATURES = [
  {
    prefix: '',
    num: '105',
    unit: 'M',
    title: 'CEO-level contacts',
    desc: 'Built on our own GPU cluster covering 536M people'
  },
  {
    prefix: '',
    num: '97',
    unit: '%',
    title: 'inbox rate',
    desc: 'Pre-warmed domains from day one'
  },
  {
    prefix: 'From $',
    num: '1',
    unit: '',
    title: 'per warm lead',
    desc: 'Pay as you go at $0.03 per email'
  }
];

function TiltCard({ feature }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-full transition-transform duration-300 ease-out"
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style
      }}
    >
      <div className="glass-window-inner h-full min-h-[160px] flex flex-col p-6 md:p-8 bg-card rounded-2xl shadow-plaque border border-border/40">
        <div className="text-[clamp(24px,4vw,36px)] font-medium text-foreground leading-tight">
          <span className="tabular-nums font-semibold">
            {feature.prefix}
            {feature.num}
            {feature.unit}
          </span>{' '}
          {feature.title}
        </div>
        <p className="!mt-auto pt-6 !mb-0 text-sm md:text-base text-muted-foreground leading-relaxed">
          {feature.desc}
        </p>
      </div>
    </div>
  );
}

export default function ThreeThingsSection() {
  return (
    <section className="mb-24 md:mb-32">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-normal text-foreground">
            Three things nobody else has
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => (
            <TiltCard key={idx} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
