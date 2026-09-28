import React from 'react';

const CASE_STUDIES = [
  {
    name: 'Wole Fagbohun',
    company: 'PlotWeaver',
    companyUrl: 'https://plotweaver.app',
    linkedin: 'https://www.linkedin.com/in/wolehat/',
    avatar: '/assets/wole-fagbohun.jpg',
    quote: '“I don’t even have anyone else in sales. It’s just me doing everything — and it takes away all the pain.”',
    leads: '409',
    cost: '$2.62'
  },
  {
    name: 'Camille Rose',
    company: 'CamTalk Solutions',
    companyUrl: 'https://camtalksolutions.io',
    linkedin: 'https://www.linkedin.com/in/camille-rose-58578232/',
    avatar: '/assets/camille-rose.jpg',
    quote: '“We tried cold outreach with an agency and got zero responses. With Explee people actually reply, and what used to take hours takes me 15 minutes a day.”',
    leads: '39',
    cost: '$6.67'
  },
  {
    name: 'Alex Sunshine',
    company: 'Rising Suns Agency',
    companyUrl: 'https://risingsunsagency.com',
    linkedin: 'https://www.linkedin.com/in/alex-sunshine-731383189/',
    avatar: '/assets/alex-sunshine.jpg',
    quote: '“We work with a lot of lead gen agencies and platforms, and Explee’s infrastructure is the best one we’ve seen. You input the campaign and it just runs.”',
    leads: '254',
    cost: '$6.52'
  },
  {
    name: 'Farhat Asif',
    company: 'The Diplomatic Insight',
    companyUrl: 'https://thediplomaticinsight.com',
    linkedin: 'https://www.linkedin.com/in/farhatasif/',
    avatar: '/assets/farhat-asif.jpg',
    quote: '“Explee has opened doors we would have spent months trying to knock on manually.”',
    leads: '238',
    cost: '$1.71'
  }
];

export default function CaseStudiesSection() {
  return (
    <section className="mb-24 md:mb-32">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-normal text-foreground">
            What our customers got out of it
          </h2>
        </div>

        <div className="case-grid">
          {CASE_STUDIES.map((study) => (
            <article key={study.name} className="case-card">
              <div className="case-identity">
                <span className="case-avatar w-[43px] h-[43px] rounded-full overflow-hidden shrink-0 block">
                  <img
                    alt={study.name}
                    src={study.avatar}
                    width="43"
                    height="43"
                    className="object-cover w-[43px] h-[43px] rounded-full"
                  />
                </span>

                <span className="case-who">
                  <span className="case-name">{study.name}</span>
                  <span className="case-company">
                    <a
                      className="case-company-link"
                      href={study.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {study.company}
                    </a>
                  </span>
                </span>

                <a
                  className="case-linkedin"
                  href={study.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${study.name} on LinkedIn`}
                >
                  <svg
                    aria-hidden="true"
                    fill="currentColor"
                    height="16"
                    viewBox="0 0 800 800"
                    width="16"
                  >
                    <path d="M727.634 0H72.3665C32.4 0 0 32.4 0 72.3665V727.631C0 767.6 32.4 800 72.3665 800H727.631C767.6 800 800 767.6 800 727.631V72.3665C800 32.4 767.6 0 727.634 0ZM247.554 690.773C247.554 702.404 238.126 711.832 226.494 711.832H136.848C125.217 711.832 115.788 702.404 115.788 690.773V314.98C115.788 303.349 125.217 293.92 136.848 293.92H226.494C238.126 293.92 247.554 303.349 247.554 314.98V690.773ZM181.671 258.496C134.637 258.496 96.5068 220.367 96.5068 173.332C96.5068 126.297 134.637 88.1675 181.671 88.1675C228.706 88.1675 266.836 126.297 266.836 173.332C266.836 220.367 228.708 258.496 181.671 258.496ZM716.042 692.469C716.042 703.162 707.372 711.832 696.679 711.832H600.482C589.789 711.832 581.118 703.162 581.118 692.469V516.201C581.118 489.906 588.831 400.974 512.4 400.974C453.114 400.974 441.089 461.845 438.674 489.162V692.469C438.674 703.162 430.006 711.832 419.311 711.832H326.272C315.579 711.832 306.909 703.162 306.909 692.469V313.284C306.909 302.591 315.579 293.92 326.272 293.92H419.311C430.004 293.92 438.674 302.591 438.674 313.284V346.069C460.658 313.079 493.328 287.615 562.888 287.615C716.924 287.615 716.042 431.523 716.042 510.593V692.469Z" />
                  </svg>
                </a>
              </div>

              <p className="case-quote">{study.quote}</p>

              <div className="case-metrics">
                <div className="case-metric">
                  <div className="case-metric-value">{study.leads}</div>
                  <div className="case-metric-label">hot leads</div>
                </div>
                <div className="case-metric">
                  <div className="case-metric-value">{study.cost}</div>
                  <div className="case-metric-label">cost/lead</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
