import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: "What do I need to get started?",
    a: "Just your website. Drop in the URL and the agent works out what you sell, who buys it, and finds the exact people to contact. Building the lead list is free, and adding a card grants you $30 in starter credits without charging anything, so your first sends cost you nothing."
  },
  {
    q: "How much does it cost?",
    a: "About $0.03 per email actually sent, and that is the entire model: no subscription, no per-seat fee, no charge for finding leads. You start with $30 in free credits, which covers your first 1,000 emails. After that you set a daily budget that caps spend, and spending stops the moment you pause your campaigns."
  },
  {
    q: "Whose mailboxes send the emails? Is my domain at risk?",
    a: "Outreach goes out from our pool of pre-warmed inboxes, never from your own mailbox or domain, so your reputation is never on the line. Each prospect is paired with one inbox that carries the whole conversation, and replies land back inside Explee."
  },
  {
    q: "How do you keep emails out of spam?",
    a: "Every mailbox in the pool is warmed up and authenticated with SPF, DKIM and DMARC, with daily sending caps and gradual volume ramps. Bounce and complaint rates are watched across the whole pool, and any inbox that starts to degrade is pulled out automatically, so one campaign can never drag down the rest."
  },
  {
    q: "How much control do I have over what goes out?",
    a: "Every new campaign shows you its lead list before outreach starts, and you can preview the email template against real leads before launch. You steer targeting and tone by chatting with the agent in plain language, and one click pauses everything at any time."
  },
  {
    q: "What happens when a prospect replies?",
    a: "Replies land in your Explee inbox, where the agent answers questions and moves interested prospects toward a call. Add your booking link and it routes meetings straight to your calendar. Calendly, Cal.com, HubSpot Meetings and most major schedulers are supported."
  },
  {
    q: "Can I bring my own leads?",
    a: "Yes. Upload a CSV of up to 30,000 contacts and Explee validates every address with the same engine it uses for the leads it finds itself, then writes and sends to them on the normal schedule. Or let the agent build the list for you across 105M+ companies."
  },
  {
    q: "Is Explee the same as AutoGTM?",
    a: "Yes. AutoGTM was the name of our outreach product, and it is now simply Explee. Same agent, same pricing, same login. If you signed up when it was called AutoGTM, nothing changes for you: your campaigns, your credits and your account all carry over."
  },
  {
    q: "Is cold email even allowed?",
    a: "Explee sends B2B outreach to business addresses with an honest sender identity, and opt-outs are honored immediately. You control the geography of every campaign, so markets with stricter rules can be excluded entirely."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="mb-24 md:mb-32">
      <div className="max-w-[720px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-normal text-foreground">
            Common questions
          </h2>
        </div>

        <div className="w-full divide-y divide-border">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.q} className="py-2">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left font-medium text-base text-foreground transition-colors hover:text-muted-foreground cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0 invisible'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
