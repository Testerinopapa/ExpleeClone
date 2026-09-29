import React, { useState } from 'react';
import {
  MailIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  ClearIcon,
  EyeIcon,
  RubyIcon,
  NodeIcon,
  PhpIcon,
  PythonIcon,
  MoreDotsIcon
} from './DocsIcons';

export default function IntroductionContent() {
  const [selectedSdk, setSelectedSdk] = useState('Shell');
  const [showPassword, setShowPassword] = useState(true);
  const [apiKey, setApiKey] = useState('QUxMIFlPVVIgQkFTRSBBUkUgQkVMT05HIFRPIFVT');
  const [downloadHover, setDownloadHover] = useState(false);

  const autogtmOperations = [
    { method: 'GET', path: '/public/api/v1/autogtm/projects', label: 'List AutoGTM projects' },
    { method: 'GET', path: '/public/api/v1/autogtm/campaigns', label: 'List AutoGTM campaigns' },
    { method: 'GET', path: '/public/api/v1/autogtm/campaigns/{campaign_id}', label: 'Get campaign definition' },
    { method: 'PATCH', path: '/public/api/v1/autogtm/campaigns/{campaign_id}', label: 'Update campaign definition' },
    { method: 'POST', path: '/public/api/v1/autogtm/campaigns/import', label: 'Create a campaign from your own leads (import)' },
    { method: 'GET', path: '/public/api/v1/autogtm/campaigns/import/{task_id}', label: 'Campaign import status/result' },
    { method: 'GET', path: '/public/api/v1/autogtm/hot-leads', label: 'List hot leads' },
    { method: 'GET', path: '/public/api/v1/autogtm/campaigns/{campaign_id}/inbox', label: 'List inbox conversations' },
    { method: 'GET', path: '/public/api/v1/autogtm/campaigns/{campaign_id}/inbox/{person_id}', label: 'Read a conversation thread' },
    { method: 'POST', path: '/public/api/v1/autogtm/campaigns/{campaign_id}/inbox/{person_id}/reply', label: 'Reply in a thread' },
    { method: 'GET', path: '/public/api/v1/autogtm/campaigns/{campaign_id}/inbox/{person_id}/note', label: 'Read the lead note' },
    { method: 'POST', path: '/public/api/v1/autogtm/campaigns/{campaign_id}/inbox/{person_id}/note', label: 'Set the lead note' },
    { method: 'GET', path: '/public/api/v1/autogtm/projects/{project_id}/budget', label: 'Get project daily budget' },
    { method: 'PATCH', path: '/public/api/v1/autogtm/projects/{project_id}/budget', label: 'Set project daily budget' },
    { method: 'PATCH', path: '/public/api/v1/autogtm/campaigns/{campaign_id}/budget', label: 'Set campaign daily budget' },
    { method: 'POST', path: '/public/api/v1/autogtm/campaigns/{campaign_id}/stop', label: 'Stop campaign' },
    { method: 'POST', path: '/public/api/v1/autogtm/campaigns/{campaign_id}/start', label: 'Start campaign' },
    { method: 'GET', path: '/public/api/v1/autogtm/campaigns/{campaign_id}/analytics', label: 'Campaign analytics' },
    { method: 'GET', path: '/public/api/v1/autogtm/projects/{project_id}/analytics', label: 'Project analytics' },
    { method: 'GET', path: '/public/api/v1/autogtm/suppress-list/people', label: 'People suppress lists' },
    { method: 'POST', path: '/public/api/v1/autogtm/suppress-list/people', label: 'Suppress people' },
    { method: 'GET', path: '/public/api/v1/autogtm/suppress-list/people/{list_name}', label: 'Read a people list' },
    { method: 'DEL', path: '/public/api/v1/autogtm/suppress-list/people/{list_name}', label: 'Delete a people list' },
    { method: 'GET', path: '/public/api/v1/autogtm/suppress-list/companies', label: 'Company suppress lists' },
    { method: 'POST', path: '/public/api/v1/autogtm/suppress-list/companies', label: 'Suppress companies' },
    { method: 'GET', path: '/public/api/v1/autogtm/suppress-list/companies/{list_name}', label: 'Read a company list' },
    { method: 'DEL', path: '/public/api/v1/autogtm/suppress-list/companies/{list_name}', label: 'Delete a company list' },
    { method: 'GET', path: '/public/api/v1/autogtm/projects/{project_id}/autopilot', label: 'Get autopilot settings' },
    { method: 'PATCH', path: '/public/api/v1/autogtm/projects/{project_id}/autopilot', label: 'Set autopilot settings' },
  ];

  const methodColors = {
    GET: 'text-[#009485]',
    POST: 'text-[#0a52af]',
    PATCH: 'text-[#ffaa01]',
    DEL: 'text-[#d52b2a]',
    DELETE: 'text-[#d52b2a]',
  };

  return (
    <div className="w-full font-['Inter',sans-serif] text-[#1b1b1b]">
      {/* ================= SECTION 1: INTRODUCTION ================= */}
      <div className="section-container w-full max-w-[1152px] mx-auto px-[60px]">
        <section className="section introduction-section w-[1032px] pt-[90px] pb-[90px] flex flex-col gap-12">
          {/* Top Content (Badges + Header + Columns) */}
          <div className="section-content flex flex-col">
            {/* Top Badges (y: 90) */}
            <div className="flex items-center gap-1.5 mb-[6px]">
              <div className="badge inline-block rounded-2xl border border-[rgba(0,0,0,0.1)] bg-[#fcfcfc] px-2 py-0.5 text-[#757575] text-[12px] font-normal leading-normal">
                v1.0.0
              </div>
              <div className="badge inline-block rounded-2xl border border-[rgba(0,0,0,0.1)] bg-[#fcfcfc] px-2 py-0.5 text-[#757575] text-[12px] font-normal leading-normal">
                OpenAPI 3.1.0
              </div>
            </div>

            {/* Section Header Wrapper: 1032px grid (492px + 48px gap + 492px) (y: 111) */}
            <div className="grid grid-cols-[492px_492px] gap-[48px] items-center mb-[14px]">
              <div>
                <h1 className="text-[24px] font-semibold text-[#1b1b1b] leading-[34.8px] tracking-tight m-0">
                  Explee Public API
                </h1>
              </div>

              <div className="flex items-center justify-end gap-1.5">
                <a
                  href="mailto:support@explee.com"
                  className="text-[#1b1b1b] flex items-center rounded-lg px-2 py-1 text-[13px] hover:bg-[#f8f8f8] no-underline transition-colors"
                >
                  <MailIcon className="size-3 text-current mr-1.5" />
                  <span>Explee Support</span>
                </a>
                <a
                  href="https://explee.com"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-[#1b1b1b] flex items-center justify-center rounded-lg p-1.5 hover:bg-[#f8f8f8] no-underline transition-colors"
                  title="explee.com"
                >
                  <ExternalLinkIcon className="size-3 text-current" />
                </a>
              </div>
            </div>

            {/* 2 Columns: exactly 492px each with 48px gap (y: 152) */}
            <div className="grid grid-cols-[492px_492px] gap-[48px] items-start">
              {/* Left Column (492px) */}
              <div className="w-[492px]">
                {/* Download Button matching exact Scalar DOM */}
                <div
                  className="download-container group mb-4 relative inline-block"
                  onMouseEnter={() => setDownloadHover(true)}
                  onMouseLeave={() => setDownloadHover(false)}
                >
                  <button
                    type="button"
                    className="download-button flex items-center gap-1.5 text-[16px] text-[#1b1b1b] font-normal hover:text-[#009485] cursor-pointer bg-transparent border-0 p-0"
                  >
                    <span>Download OpenAPI Document</span>
                    {downloadHover && (
                      <div className="flex items-center gap-1 ml-1 animate-in fade-in duration-100">
                        <a
                          href="https://api.explee.com/public/api/openapi.json"
                          target="_blank"
                          rel="noreferrer"
                          className="badge rounded-2xl border border-[rgba(0,0,0,0.1)] bg-[#fcfcfc] px-1.5 py-0.5 text-[#757575] text-[11px] font-mono hover:bg-white hover:text-[#009485]"
                        >
                          json
                        </a>
                        <a
                          href="https://api.explee.com/public/api/openapi.json"
                          download="openapi.yaml"
                          className="badge rounded-2xl border border-[rgba(0,0,0,0.1)] bg-[#fcfcfc] px-1.5 py-0.5 text-[#757575] text-[11px] font-mono hover:bg-white hover:text-[#009485]"
                        >
                          yaml
                        </a>
                      </div>
                    )}
                  </button>
                </div>

                {/* Markdown description section */}
                <div className="introduction-description space-y-4 text-[16px] leading-[26px] text-[#1b1b1b]">
                  {/* Blockquote Tip matching exact Scalar DOM */}
                  <blockquote className="border-l-2 border-[rgba(0,0,0,0.1)] pl-3 my-4 text-[#1b1b1b] text-[16px] leading-[26px]">
                    <p>
                      <strong>Tip</strong>: This documentation is designed for humans. To integrate with AI agents, provide them with the OpenAPI schema at{' '}
                      <a
                        href="https://api.explee.com/public/api/openapi.json"
                        rel="nofollow"
                        target="_blank"
                        className="text-[#1b1b1b] underline hover:text-[#009485]"
                      >
                        https://api.explee.com/public/api/openapi.json
                      </a>{' '}
                      instead.
                    </p>
                  </blockquote>

                  <p className="mt-4">
                    Search millions of companies worldwide using natural language queries and structured filters!
                  </p>

                  <p>
                    <strong>Rate limit</strong>: 10000 requests per hour, 150 concurrent requests per organization. Timeout: 90s.
                  </p>
                </div>
              </div>

              {/* Right Column: Sticky Cards (492px) */}
              <div className="w-[492px] sticky-cards space-y-3">
                {/* Card 1: Authentication Card */}
                <div className="introduction-card-item rounded-xl border border-[rgba(0,0,0,0.1)] bg-white overflow-hidden">
                  <div className="bg-[#fcfcfc] border-b border-[rgba(0,0,0,0.1)] px-3 py-2 flex items-center justify-between h-[33px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13.5px] font-medium text-[#1b1b1b]">Authentication</span>
                      <span className="text-[11px] text-[#757575] bg-[#f0f0f0] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)]">
                        Required
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[12px] text-[#757575] hover:text-[#1b1b1b] cursor-pointer">
                      <span>Selected Auth Type: ApiKeyAuth</span>
                      <ChevronDownIcon className="size-3 shrink-0" />
                    </div>
                  </div>

                  <div className="p-0 text-[13px] bg-white">
                    {/* Row 0: Get your API key at API Keys */}
                    <div className="px-3 py-2 border-b border-[rgba(0,0,0,0.1)] bg-white text-[12.5px] text-[#757575]">
                      Get your API key at{' '}
                      <a
                        href="https://app.explee.com/settings/api-keys"
                        rel="nofollow"
                        target="_blank"
                        className="text-[#009485] hover:underline font-medium"
                      >
                        API Keys
                      </a>
                    </div>

                    {/* Row 1: Name: X-API-Key */}
                    <div className="flex items-center px-3 py-1.5 border-b border-[rgba(0,0,0,0.1)] bg-white">
                      <div className="text-[#1b1b1b] text-[12.5px] w-14 shrink-0">Name:</div>
                      <div className="flex-1 font-mono text-[12.5px] text-[#1b1b1b] flex items-center justify-between">
                        <span>X-API-Key</span>
                        <button
                          type="button"
                          onClick={() => setApiKey('')}
                          className="text-[#8e8e8e] hover:text-[#1b1b1b] p-0.5 rounded cursor-pointer"
                          title="Clear Value"
                        >
                          <ClearIcon className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Row 2: Value: password */}
                    <div className="flex items-center px-3 py-1.5 bg-white">
                      <div className="text-[#1b1b1b] text-[12.5px] w-14 shrink-0">Value:</div>
                      <div className="relative flex-1 flex items-center">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="QUxMIFlPVVIgQkFTRSBBUkUgQkVMT05HIFRPIFVT"
                          className="w-full font-mono text-[12.5px] text-[#1b1b1b] placeholder-[#a0a0a0] bg-transparent outline-none pr-8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 text-[#8e8e8e] hover:text-[#1b1b1b] p-1 rounded cursor-pointer"
                          title={showPassword ? 'Hide Password' : 'Show Password'}
                        >
                          <EyeIcon className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Client Libraries Card */}
                <div className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white overflow-hidden">
                  <div className="client-libraries-heading bg-[#fcfcfc] border-b border-[rgba(0,0,0,0.1)] px-3 py-2 text-[14px] font-medium text-[#1b1b1b] flex items-center h-8">
                    Client Libraries
                  </div>

                  {/* Tabs List matching Scalar */}
                  <div className="flex items-center border-b border-[rgba(0,0,0,0.1)] bg-[#fcfcfc] px-2 py-1 gap-1 overflow-x-auto h-[33px]">
                    {[
                      { name: 'Shell', label: '>_ Shell', icon: null },
                      { name: 'Ruby', label: 'Ruby', icon: RubyIcon },
                      { name: 'Node.js', label: 'Node.js', icon: NodeIcon },
                      { name: 'PHP', label: 'PHP', icon: PhpIcon },
                      { name: 'Python', label: 'Python', icon: PythonIcon },
                    ].map(({ name, label, icon: IconComponent }) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedSdk(name)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded text-[12px] font-medium transition-all cursor-pointer ${
                          selectedSdk === name
                            ? 'bg-white text-[#1b1b1b] shadow-2xs border border-[rgba(0,0,0,0.08)] font-semibold'
                            : 'text-[#757575] hover:text-[#1b1b1b] hover:bg-black/4 border border-transparent'
                        }`}
                      >
                        {IconComponent && <IconComponent className="size-3.5 shrink-0" />}
                        <span>{label}</span>
                      </button>
                    ))}

                    <button
                      type="button"
                      className="flex items-center gap-1 px-2 py-1 text-[11px] text-[#8e8e8e] hover:text-[#1b1b1b] rounded transition-colors ml-auto cursor-pointer"
                    >
                      <MoreDotsIcon className="w-3 h-3" />
                      <span>More</span>
                    </button>
                  </div>

                  {/* Footer matching reference */}
                  <div className="px-3.5 py-2 bg-white text-[14px] font-['JetBrains_Mono',monospace] text-[#1b1b1b] h-[36px] flex items-center">
                    {selectedSdk} Curl
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ================= SECTION 2: AUTOGTM OVERVIEW ================= */}
      <div className="section-container tag-section-container w-full max-w-[1152px] mx-auto px-[60px] border-t border-[rgba(0,0,0,0.1)]">
        <section className="section w-[1032px] pt-[90px] pb-[90px]">
          {/* Header */}
          <div className="grid grid-cols-[492px_492px] gap-[48px] items-center mb-3">
            <div>
              <h2 className="text-[24px] font-semibold text-[#1b1b1b] leading-[34.8px] tracking-tight m-0">
                AutoGTM
              </h2>
            </div>
          </div>

          {/* Section Columns */}
          <div className="grid grid-cols-[492px_492px] gap-[48px] items-start">
            {/* Left: AutoGTM Description */}
            <div className="w-[492px]">
              <p className="text-[14px] leading-[22px] text-[#404040]">
                Manage your AutoGTM outreach campaigns programmatically with the same{' '}
                <code className="text-[12px] font-mono text-[#1b1b1b] bg-[#f0f0f0] px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.06)]">
                  X-API-Key
                </code>
                : list campaigns, read and answer the inbox, set the project budget, start/stop campaigns, and pull per-campaign analytics — everything you need to build your own autopilot on top.
              </p>
            </div>

            {/* Right: Operations Table matching reference */}
            <div className="w-[492px] h-[639px] rounded-lg border border-[rgba(0,0,0,0.1)] bg-[#fcfcfc] overflow-hidden flex flex-col">
              <div className="bg-[#fcfcfc] border-b border-[rgba(0,0,0,0.08)] px-3.5 py-2.5 h-[37px] flex items-center">
                <span className="text-[14px] font-medium text-[#1b1b1b]">Operations</span>
              </div>
              <ul className="endpoints flex-1 overflow-y-auto px-3 py-2 space-y-0.5 custom-scrollbar m-0 list-none">
                {autogtmOperations.map((op, i) => (
                  <li key={i} className="contents">
                    <a
                      href={`#tag/autogtm/${op.method}${op.path}`}
                      className="endpoint flex items-center h-[22px] hover:bg-black/[0.03] px-1 rounded transition-colors no-underline group"
                    >
                      <span className={`w-[62px] min-w-[62px] shrink-0 text-right font-['JetBrains_Mono',monospace] text-[14px] font-normal leading-[21.7px] uppercase ${methodColors[op.method]}`}>
                        {op.method}
                      </span>
                      <span className="ml-3 font-['JetBrains_Mono',monospace] text-[14px] font-normal leading-[21.7px] text-[#1b1b1b] group-hover:text-[#009485] truncate">
                        {op.path}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
