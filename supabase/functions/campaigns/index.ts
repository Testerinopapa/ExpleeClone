import { adminClient, authenticate, endpoint, json, readBody, type Admin } from '../_shared/backend.ts';
import { campaignFields, campaignTargets, generateCampaigns, type Campaign, type CampaignPlan, type CampaignProfile } from '../_shared/campaigns-core.ts';
import { isUuid, ResearchError } from '../_shared/research-core.ts';

async function save(db: Admin, profile: CampaignProfile, version: number, plan: CampaignPlan) {
  const { data, error } = await db.rpc('autogtm_save_campaigns', { p_job: profile.job_id, p_owner: profile.owner_id, p_version: version, p_plan: plan });
  if (error) throw new ResearchError('SAVE_FAILED', 'Could not save campaigns. Retry to load the saved plan.', 503);
  return data as { applied: boolean; plan: CampaignPlan };
}
export const handler = endpoint(async (req) => {
  const db = adminClient();
  const { ownerId } = await authenticate(req, db);
  const body = await readBody(req);
  if (!isUuid(body.job_id)) throw new ResearchError('INVALID_REQUEST', 'A company research job ID is required.');
  const action = body.action || 'load';
  if (!['load', 'create', 'update', 'delete', 'select'].includes(String(action))) throw new ResearchError('INVALID_REQUEST', 'Unknown campaign action.');
  const { data, error } = await db.from('company_profiles').select('*').eq('job_id', body.job_id).eq('owner_id', ownerId).maybeSingle();
  if (error) throw new ResearchError('DATABASE_UNAVAILABLE', 'Could not load campaigns.', 503);
  if (!data) throw new ResearchError('NOT_FOUND', 'Company research was not found for this project.', 404);
  if (!Object.hasOwn(data, 'campaign_plan')) throw new ResearchError('NOT_DEPLOYED', 'The Phase 3 database migration has not been deployed.', 503);
  const profile = data as CampaignProfile;
  if (profile.competitor_research?.status !== 'completed') throw new ResearchError('RESEARCH_PENDING', 'Finish competitor research before defining campaigns.', 409);
  let plan = profile.campaign_plan;
  if (!plan) plan = (await save(db, profile, 0, generateCampaigns(profile))).plan;
  if (action !== 'load') {
    if (!Number.isInteger(body.version) || body.version !== plan.version) throw new ResearchError('CONFLICT', 'Campaigns changed in another tab. Reload the latest plan before saving.', 409);
    let campaigns = plan.campaigns;
    let selected_ids = plan.selected_ids;
    if (action === 'create') {
      if (campaigns.length >= 12) throw new ResearchError('CAMPAIGN_LIMIT', 'Keep up to 12 campaigns per research project.');
      if (!isUuid(body.campaign_id)) throw new ResearchError('INVALID_REQUEST', 'A unique campaign ID is required.');
      if (campaigns.some(c => c.id === body.campaign_id)) throw new ResearchError('CONFLICT', 'This campaign already exists. Reload the saved plan.', 409);
      const campaign: Campaign = { ...campaignFields(body.campaign), id: body.campaign_id, origin: 'custom', source_urls: [] };
      campaigns = [...campaigns, campaign];
    } else if (action === 'update' || action === 'delete') {
      const current = campaigns.find(c => c.id === body.campaign_id);
      if (!current) throw new ResearchError('NOT_FOUND', 'This campaign is no longer in the project.', 404);
      if (action === 'update') campaigns = campaigns.map(c => c.id === current.id ? { ...c, ...campaignFields(body.campaign), origin: 'customized' } : c);
      else { campaigns = campaigns.filter(c => c.id !== current.id); selected_ids = selected_ids.filter(id => id !== current.id); }
    } else if (action === 'select') {
      if (!Array.isArray(body.selected_ids) || body.selected_ids.length > 12 || body.selected_ids.some(id => !campaigns.some(c => c.id === id))) {
        throw new ResearchError('INVALID_CAMPAIGN', 'Select only campaigns belonging to this project.');
      }
      selected_ids = [...new Set(body.selected_ids as string[])];
    }
    const result = await save(db, profile, plan.version, { ...plan, campaigns, selected_ids });
    if (!result.applied) throw new ResearchError('CONFLICT', 'Campaigns changed in another tab. Reload the latest plan before saving.', 409);
    plan = result.plan;
  }
  return json({ job_id: profile.job_id, project_id: profile.project_id, plan, targets: campaignTargets(profile, plan) });
});
if (import.meta.main) Deno.serve(handler);
