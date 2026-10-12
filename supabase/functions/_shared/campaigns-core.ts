import type { CompanyProfile } from './competitor-core.ts';
import { businessDomain } from './competitor-core.ts';
import { ResearchError } from './research-core.ts';

export type Campaign = {
  id: string; name: string; target_audience: string; target_industry: string; ideal_customer: string;
  keywords: string[]; target_locations: string[]; reasoning: string; source_urls: string[];
  origin: 'suggested' | 'custom' | 'customized';
};
export type CampaignPlan = { status: 'completed'; version: number; campaigns: Campaign[]; selected_ids: string[];
  warnings: string[]; created_at?: string; updated_at?: string };
export type CampaignProfile = CompanyProfile & { campaign_plan: CampaignPlan | null };
const text = (value: unknown, max = 600) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const unique = (values: string[]) => [...new Map(values.filter(Boolean).map(v => [v.toLocaleLowerCase(), v])).values()];
const tokens = (value: string): string[] => text(value, 8000).toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || [];

export function campaignFields(input: unknown): Omit<Campaign, 'id' | 'origin' | 'source_urls'> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new ResearchError('INVALID_CAMPAIGN', 'Enter campaign details.');
  const value = input as Record<string, unknown>;
  const string = (field: string, max: number, required = true) => {
    if (typeof value[field] !== 'string' || (required && !(value[field] as string).trim()) || (value[field] as string).length > max) {
      throw new ResearchError('INVALID_CAMPAIGN', `Enter ${field.replaceAll('_', ' ')}${required ? '' : ' or leave it empty'} (up to ${max} characters).`);
    }
    return (value[field] as string).trim();
  };
  const list = (field: string, max: number, required = false) => {
    const items = value[field];
    if (!Array.isArray(items) || items.length > 10 || items.some(item => typeof item !== 'string' || !item.trim() || item.length > max)) {
      throw new ResearchError('INVALID_CAMPAIGN', `Use up to 10 ${field.replaceAll('_', ' ')}, each up to ${max} characters.`);
    }
    const result = unique(items.map(item => item.trim()));
    if (required && !result.length) throw new ResearchError('INVALID_CAMPAIGN', 'Add at least one targeting keyword.');
    return result;
  };
  return { name: string('name', 100), target_audience: string('target_audience', 160), target_industry: string('target_industry', 100, false),
    ideal_customer: string('ideal_customer', 600), keywords: list('keywords', 80, true), target_locations: list('target_locations', 80),
    reasoning: string('reasoning', 600, false) };
}

// Local, evidence-led suggestions: no new crawl, LLM service, invented leads or
// market estimates. Adjacent audiences are explicitly hypotheses to review.
export function generateCampaigns(profile: CampaignProfile): CampaignPlan {
  const products = profile.products.filter(p => text(p.name));
  const offering = text(products[0]?.name, 100) || text(profile.business_description, 160);
  const productText = `${profile.business_description || ''} ${products.map(p => `${p.name} ${p.description || ''}`).join(' ')}`;
  const customersText = profile.customers.map(c => `${c.name} ${c.description || ''}`).join(' ');
  const candidates: { audience: string; industry: string; rationale: string; sources: string[]; keywords: string[]; score: number }[] = [];
  const sourceUrls = unique(profile.source_urls).slice(0, 10);
  const add = (audience: string, industry: string, rationale: string, sources: string[], keywords: string[], score: number) => {
    if (audience && offering && sources.length) candidates.push({ audience: text(audience, 100), industry, rationale, sources, keywords, score });
  };
  const languageLearning = /\b(english|esl|language)\b/i.test(productText) && /\b(learn\w*|teach\w*|tutor\w*|course\w*|education|vocabulary)\b/i.test(productText);
  const language = /\b(english|esl)\b/i.test(productText) ? 'English' : 'language';
  if (languageLearning) {
    const groups = [
      ['Language schools', 'Language education', `${language} language school`, 'structured language classes'],
      [language === 'English' ? 'ESL teachers' : 'Language teachers', 'Education', `${language} teacher`, 'supplementary lesson practice'],
      ['Private tutors', 'Tutoring', `${language} tutor`, 'individual language lessons'],
      ['Educational institutions', 'Education', `${language} language program`, 'language programs'],
    ];
    if (/\b(business english|corporate|workplace|employee|professional development)\b/i.test(`${productText} ${customersText}`)) {
      groups.push(['Corporate training providers', 'Professional training', `${language} corporate training`, 'workplace language training']);
    }
    for (const [audience, industry, keyword, use] of groups) add(audience, industry,
      `Suggested fit: the researched offering includes ${offering}; ${audience.toLowerCase()} could evaluate it for ${use}. This is a targeting hypothesis, not a confirmed customer relationship.`,
      sourceUrls, [keyword, text(offering, 80)], 3);
  }
  // Prefer explicit business audiences over inferred adjacent audiences. Do not
  // silently turn consumer segments into businesses for the Find Companies stage.
  const consumer = /\b(students?|learners?|consumers?|parents?|children|families|individuals?|hobbyists?)\b/i;
  const organization = /\b(schools?|teachers?|tutors?|universit\w*|institut\w*|compan\w*|business\w*|teams?|agenc\w*|providers?|retailers?|manufactur\w*|clinics?|hospitals?|enterprises?|startups?|organizations?|firms?)\b/i;
  for (const audience of profile.customers) {
    if (consumer.test(audience.name) && !organization.test(audience.name)) continue;
    add(audience.name, languageLearning ? 'Education' : '',
      `The company research explicitly describes ${text(`${audience.name}: ${audience.description || audience.name}`, 260)}. Proposed outreach should validate their need for ${offering}.`,
      audience.source_urls?.length ? audience.source_urls : sourceUrls, [text(audience.name, 80), text(offering, 80)], 5);
  }
  for (const competitor of (profile.competitor_research.results || []).filter(c => c.relationship === 'direct').slice(0, 5)) {
    for (const audience of competitor.customers) {
      if (consumer.test(audience.name) && !organization.test(audience.name)) continue;
      // Only carry over audiences connected by actual shared product vocabulary.
      const shared = unique(tokens(productText)).filter(word => tokens(`${competitor.description || ''} ${competitor.products.map(p => p.name).join(' ')}`).includes(word));
      if (shared.length < 2) continue;
      add(audience.name, languageLearning ? 'Education' : '',
        `Adjacent audience observed at ${competitor.domain}, a researched competitor with overlapping products (${shared.slice(0, 4).join(', ')}). Validate whether ${offering} fits this audience; it is not a confirmed customer of ${profile.company_name || 'your company'}.`,
        unique([...sourceUrls, ...(audience.source_urls || competitor.source_urls)]), [text(audience.name, 80), text(offering, 80)], 2);
    }
  }
  const seen = new Set<string>();
  const campaigns = candidates.sort((a, b) => b.score - a.score).filter(candidate => {
    const key = tokens(candidate.audience).join(' ').replace(/s\b/g, '');
    if (seen.has(key)) return false;
    seen.add(key); return true;
  }).slice(0, 6).map(candidate => ({ id: crypto.randomUUID(), name: candidate.audience,
    target_audience: candidate.audience, target_industry: candidate.industry,
    ideal_customer: `Target ${candidate.audience.toLowerCase()} with a demonstrated need for ${offering}. Evaluate fit against the researched offering: ${text(products[0]?.description || profile.business_description || offering, 260)}.`,
    keywords: unique(candidate.keywords).slice(0, 10), target_locations: [], // Office locations are not target markets.
    reasoning: text(candidate.rationale), source_urls: candidate.sources.slice(0, 15), origin: 'suggested' as const }));
  return { status: 'completed', version: 0, campaigns, selected_ids: campaigns.length ? [campaigns[0].id] : [],
    warnings: campaigns.length ? [] : ['The saved research does not identify a usable business audience. Create a campaign to define your target customer.'] };
}

export function campaignTargets(profile: CampaignProfile, plan: CampaignPlan) {
  const excluded_domains = unique([...profile.source_urls, ...profile.competitor_research.results.flatMap(c => c.source_urls)]
    .flatMap(url => { try { return [businessDomain(url)]; } catch { return []; } }));
  return plan.campaigns.filter(campaign => plan.selected_ids.includes(campaign.id)).map(campaign => ({
    campaign_id: campaign.id, project_id: profile.project_id, research_job_id: profile.job_id, plan_version: plan.version,
    name: campaign.name, audience: campaign.target_audience, industry: campaign.target_industry || null,
    ideal_customer: campaign.ideal_customer, keywords: campaign.keywords, locations: campaign.target_locations,
    reasoning: campaign.reasoning, source_urls: campaign.source_urls, excluded_domains,
  }));
}
