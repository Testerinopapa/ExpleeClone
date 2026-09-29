import React from 'react';
import { ChevronDown } from 'lucide-react';
import EndpointContent from './EndpointContent';
import endpointsData from '../../data/endpointsData.json';

const tagDescriptions = {
  autogtm: '',
  search: '',
  contact: '',
  agents: '',
  tasks: '',
  billing: 'Check how many credits your organization has left, so your agent can see when it is running low. Credits are priced at 1 credit = $0.01; add more on your billing page at https://explee.com/app-auto-gtm/billing.',
  feedback: 'Send us freeform feedback — feature requests, problem reports, missing data, anything. It goes straight to the team; we read everything. Free of charge.',
  deduplication: '',
};

const tagLabels = {
  autogtm: 'AutoGTM',
  search: 'Search',
  contact: 'Contact',
  agents: 'Agents',
  tasks: 'Tasks',
  billing: 'Billing',
  feedback: 'Feedback',
  deduplication: 'Deduplication',
};

const methodBadgeColors = {
  GET: 'text-[#009485] bg-[#ecf8f6]',
  POST: 'text-[#0a52af] bg-[#eef4fc]',
  PATCH: 'text-[#ffaa01] bg-[#fef8eb]',
  DEL: 'text-[#d52b2a] bg-[#faecec]',
  DELETE: 'text-[#d52b2a] bg-[#faecec]',
};

function TagBlock({ tagKey, showShowMore = false }) {
  const label = tagLabels[tagKey] || tagKey;
  const description = tagDescriptions[tagKey] || '';
  const endpoints = endpointsData.filter(ep => ep.tag === tagKey);

  const getMethodColor = (m) => {
    if (m === 'DELETE' || m === 'DEL') return 'text-[#d52b2a]';
    if (m === 'PATCH') return 'text-[#ffaa01]';
    return 'text-[#009485]';
  };

  const hasShowMore = showShowMore || endpoints.length > 4 || tagKey === 'search' || tagKey === 'contact' || tagKey === 'agents' || tagKey === 'tasks' || tagKey === 'billing' || tagKey === 'deduplication';

  return (
    <div className="section-container w-full max-w-[1152px] mx-auto px-[60px] font-['Inter',sans-serif] text-[#1b1b1b] pt-[90px] pb-[80px]">
      <div className="grid grid-cols-[492px_492px] gap-[48px] items-start">
        {/* Left: Tag Title & Description */}
        <div>
          <h2 className="text-[24px] font-semibold text-[#1b1b1b] leading-[34.8px] tracking-tight mb-3">
            {label}
          </h2>
          {description && (
            <p className="text-[14px] leading-[22px] text-[#404040]">
              {description.includes('https://') ? (
                <>
                  {description.split('https://')[0]}
                  <a
                    href={'https://' + description.split('https://')[1].replace(/\.$/, '')}
                    className="underline text-[#1b1b1b] hover:text-[#009485] transition-colors"
                  >
                    https://{description.split('https://')[1]}
                  </a>
                </>
              ) : (
                description
              )}
            </p>
          )}
        </div>

        {/* Right: Operations Card */}
        <div>
          <div className="rounded-lg border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-2xs">
            <div className="text-[12px] font-medium text-[#757575] mb-2.5">
              Operations
            </div>
            <div className="space-y-1.5 font-['JetBrains_Mono',monospace]">
              {endpoints.slice(0, 8).map(ep => (
                <div key={ep.id} className="flex items-center gap-3 py-0.5 text-[12px]">
                  <span className={`w-12 text-right text-[11px] font-mono font-medium uppercase shrink-0 ${getMethodColor(ep.method)}`}>
                    {ep.method}
                  </span>
                  <span className="text-[#1b1b1b] truncate font-mono text-[12px]">
                    {ep.path}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {hasShowMore && (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="px-4 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] bg-white hover:bg-[#fafafa] text-[12px] font-medium text-[#606060] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <span>Show More</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8e8e8e]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TagOverviewContent({ tagKey }) {
  if (tagKey === 'search') {
    const contactFirstEp = endpointsData.find(ep => ep.tag === 'contact');
    return (
      <div className="w-full">
        <TagBlock tagKey="search" />
        <div className="w-full border-b border-[rgba(0,0,0,0.08)]" />
        <TagBlock tagKey="contact" />
        <div className="w-full border-b border-[rgba(0,0,0,0.08)]" />
        {contactFirstEp && <EndpointContent endpoint={contactFirstEp} isChild={true} />}
      </div>
    );
  }

  if (tagKey === 'contact') {
    const agentsFirstEp = endpointsData.find(ep => ep.tag === 'agents');
    return (
      <div className="w-full">
        <TagBlock tagKey="contact" />
        <div className="w-full border-b border-[rgba(0,0,0,0.08)]" />
        <TagBlock tagKey="agents" />
        <div className="w-full border-b border-[rgba(0,0,0,0.08)]" />
        {agentsFirstEp && <EndpointContent endpoint={agentsFirstEp} isChild={true} />}
      </div>
    );
  }

  if (tagKey === 'agents') {
    const tasksFirstEp = endpointsData.find(ep => ep.tag === 'tasks');
    return (
      <div className="w-full">
        <TagBlock tagKey="agents" />
        <div className="w-full border-b border-[rgba(0,0,0,0.08)]" />
        <TagBlock tagKey="tasks" />
        <div className="w-full border-b border-[rgba(0,0,0,0.08)]" />
        {tasksFirstEp && <EndpointContent endpoint={tasksFirstEp} isChild={true} />}
      </div>
    );
  }

  if (tagKey === 'tasks') {
    const billingFirstEp = endpointsData.find(ep => ep.tag === 'billing');
    return (
      <div className="w-full">
        <TagBlock tagKey="tasks" />
        <div className="w-full border-b border-[rgba(0,0,0,0.08)]" />
        <TagBlock tagKey="billing" />
        <div className="w-full border-b border-[rgba(0,0,0,0.08)]" />
        {billingFirstEp && <EndpointContent endpoint={billingFirstEp} isChild={true} />}
      </div>
    );
  }

  if (tagKey === 'billing') {
    const feedbackFirstEp = endpointsData.find(ep => ep.tag === 'feedback');
    return (
      <div className="w-full">
        <TagBlock tagKey="billing" />
        <div className="w-full border-b border-[rgba(0,0,0,0.08)]" />
        <TagBlock tagKey="feedback" />
        <div className="w-full border-b border-[rgba(0,0,0,0.08)]" />
        {feedbackFirstEp && <EndpointContent endpoint={feedbackFirstEp} isChild={true} />}
      </div>
    );
  }

  if (tagKey === 'feedback') {
    const feedbackFirstEp = endpointsData.find(ep => ep.tag === 'feedback');
    return (
      <div className="w-full">
        <TagBlock tagKey="feedback" />
        <div className="w-full border-b border-[rgba(0,0,0,0.08)]" />
        {feedbackFirstEp && <EndpointContent endpoint={feedbackFirstEp} isChild={true} />}
      </div>
    );
  }

  if (tagKey === 'deduplication') {
    const feedbackFirstEp = endpointsData.find(ep => ep.tag === 'feedback');
    return (
      <div className="w-full">
        {feedbackFirstEp && <EndpointContent endpoint={feedbackFirstEp} />}
        <div className="w-full border-b border-[rgba(0,0,0,0.08)]" />
        <TagBlock tagKey="deduplication" />
      </div>
    );
  }

  // Default: show the tag block followed by the first endpoint in that tag
  const firstEp = endpointsData.find(ep => ep.tag === tagKey);
  return (
    <div className="w-full">
      <TagBlock tagKey={tagKey} />
      {firstEp && <EndpointContent endpoint={firstEp} isChild={true} />}
    </div>
  );
}
