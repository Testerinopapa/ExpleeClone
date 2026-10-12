export function campaignSegments(plan) {
  return (plan?.campaigns || []).map(campaign => ({
    id: campaign.id, label: campaign.name, dataSource: 'research',
    icon: /education|tutor|language/i.test(campaign.target_industry) ? 'graduation-cap' : 'building',
    useCase: campaign.ideal_customer, pain: campaign.reasoning,
    criteria: [campaign.target_audience, campaign.target_industry,
      campaign.target_locations.length ? `Locations: ${campaign.target_locations.join(', ')}` : 'Location: not restricted',
    ].filter(Boolean),
    keywords: campaign.keywords, exampleClients: [], sourceUrls: campaign.source_urls,
    selected: plan.selected_ids.includes(campaign.id), count: '—', percentage: null, estimatedCompanies: null,
  }));
}
