import React, { useRef } from 'react';

const ROW_1 = [
  {
    quote: "I tried Instantly, I tried Apollo — you have to register a domain, set up DNS, warm it up. With yours you type your web address and it does all the domain warming for you… and every lead is the business owner, so the pilots convert extremely well.",
    name: "Joe Purcell",
    company: "LogSure",
    avatar: "/assets/joe-purcell.jpg",
    linkedin: "https://www.linkedin.com/in/joe-purcell-17540988"
  },
  {
    quote: "Multi-academy trusts have been the hardest to get a foot in the door with. With Explee they're the ones I hear back from most, and a few trusts are now coming on board.",
    name: "Stuart Armley-Jones",
    company: "Student Radar",
    avatar: "/assets/stuart-armley-jones.png",
    linkedin: "https://www.linkedin.com/in/stuart-armley-jones-805709285/"
  },
  {
    quote: "We've closed 6 leads who are at advanced stages of conversion.",
    name: "Adejuwon Oyebanjo",
    company: "Passpoint",
    avatar: "/assets/adejuwon-oyebanjo.png",
    linkedin: "https://uk.linkedin.com/in/adejuw0n"
  },
  {
    quote: "I've run business development teams for five or six years, and I'm very impressed. It's like having a team, by yourself.",
    name: "Jack Deakin",
    company: "Revest",
    avatar: "/assets/jack-deakin.jpg",
    linkedin: "https://www.linkedin.com/in/jackdeakin95/"
  }
];

const ROW_2 = [
  {
    quote: "I'm literally obsessed with this platform. It's the best, simplest, clearest platform I've seen. A dream come true for me.",
    name: "Wole Fagbohun",
    company: "PlotWeaver",
    avatar: "/assets/wole-fagbohun.jpg",
    linkedin: "https://www.linkedin.com/in/wolehat/"
  },
  {
    quote: "It's capable of booking five to ten demos a week on its own — I'd put more than $500 in if that keeps up… and with barely any instructions the leads are accurate. Other platforms scrape the worst fits ever.",
    name: "Wil Geller",
    company: "Foodfluence",
    avatar: "/assets/wil-geller.jpg",
    linkedin: "https://www.linkedin.com/in/wilgeller"
  },
  {
    quote: "I got replies from just the $30 plan, which felt crazy. Two of them already turned into booked meetings.",
    name: "Yassine Rajallah",
    company: "BlazeHive",
    avatar: "/assets/yassine-rajallah.png",
    linkedin: "https://www.linkedin.com/in/yassine-rajallah/"
  },
  {
    quote: "Explee has opened doors we would have spent months trying to knock on manually.",
    name: "Farhat Asif",
    company: "The Diplomatic Insight",
    avatar: "/assets/farhat-a.png",
    linkedin: "https://www.linkedin.com/in/farhatasif"
  }
];

const ROW_3 = [
  {
    quote: "We tried cold outreach with an agency and got zero responses. With Explee people actually reply, and what used to take hours takes me 15 minutes a day.",
    name: "Camille Rose",
    company: "CamTalk Solutions",
    avatar: "/assets/camille-rose.jpg",
    linkedin: "https://www.linkedin.com/in/camille-rose-58578232/"
  },
  {
    quote: "A CEO told me: I'm glad you researched my company. The first paragraph Explee wrote was a hit.",
    name: "Raju Bhupatiraju",
    company: "PODS Asia",
    avatar: "/assets/raju-bhupatiraju.jpg",
    linkedin: "https://www.linkedin.com/in/bhupatiraju"
  },
  {
    quote: "The product is on fire. Congrats!",
    name: "Bolek Jewellery",
    company: "",
    initials: "BJ",
    bgColor: "#d97706",
    linkedin: null
  },
  {
    quote: "It's been fully automated so far: we sent the emails out, they said yes please, the bot replied with the booking link and they booked it in.",
    name: "Gary Le Sueur",
    company: "CalmCompliance",
    avatar: "/assets/gary-le-sueur.png",
    linkedin: "https://www.linkedin.com/in/garylesueur1/"
  }
];

const ALL_MOBILE = [...ROW_1, ...ROW_2, ...ROW_3];

function TestimonialCardItem({ item }) {
  return (
    <div className="testimonial-card">
      <p className="testimonial-quote">
        <span>“{item.quote}”</span>
      </p>
      {item.linkedin ? (
        <a
          className="testimonial-identity"
          href={item.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.avatar ? (
            <img
              alt={item.name}
              src={item.avatar}
              width="43"
              height="43"
              className="testimonial-avatar w-[43px] h-[43px] rounded-full object-cover shrink-0"
            />
          ) : (
            <div
              className="testimonial-avatar w-[43px] h-[43px] rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
              style={{ backgroundColor: item.bgColor || '#10b981' }}
            >
              {item.initials}
            </div>
          )}
          <div>
            <div className="testimonial-name">{item.name}</div>
            {item.company && (
              <div className="testimonial-company">{item.company}</div>
            )}
          </div>
        </a>
      ) : (
        <div className="testimonial-identity">
          <div
            className="testimonial-avatar w-[43px] h-[43px] rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
            style={{ backgroundColor: item.bgColor || '#d97706' }}
          >
            {item.initials}
          </div>
          <div>
            <div className="testimonial-name">{item.name}</div>
            {item.company && (
              <div className="testimonial-company">{item.company}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MarqueeRow({ items, reverse = false }) {
  // We duplicate items so the row loops smoothly
  const duplicated = [...items, ...items, ...items];
  return (
    <div className="testimonial-row overflow-hidden flex select-none">
      <div
        className={`flex gap-4 shrink-0 animate-marquee ${
          reverse ? 'animate-marquee-reverse' : ''
        }`}
        style={{
          animationDuration: '60s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite'
        }}
      >
        {duplicated.map((item, idx) => (
          <TestimonialCardItem key={`${item.name}-${idx}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsMarquee() {
  return (
    <section className="overflow-hidden mb-24 md:mb-32">
      <div className="text-center max-w-2xl mx-auto px-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-normal text-foreground">
          What customers are saying
        </h2>
      </div>

      <div className="testimonials-rows flex flex-col gap-4 mt-12 md:mt-16">
        {/* Mobile View: Single swipeable snap row */}
        <div className="md:hidden">
          <div className="testimonial-row testimonial-row--snap flex overflow-x-auto gap-4 px-6 pb-4">
            {ALL_MOBILE.map((item, idx) => (
              <TestimonialCardItem key={`mobile-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Desktop View: 3 marquee rows */}
        <div className="hidden md:flex flex-col gap-4">
          <MarqueeRow items={ROW_1} />
          <MarqueeRow items={ROW_2} reverse={true} />
          <MarqueeRow items={ROW_3} />
        </div>
      </div>
    </section>
  );
}
