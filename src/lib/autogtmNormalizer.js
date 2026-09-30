/**
 * Normalization utilities for AutoGTM workflow data.
 * Guarantees uniform array and object contracts across all UI consumers.
 */

/**
 * Normalizes campaign/segment data into a guaranteed CampaignSegment[] array.
 *
 * @param {any} raw - Array, nested object, dictionary of segments, or JSON string.
 * @returns {Array<CampaignSegment>}
 */
export function normalizeSegments(raw) {
  if (!raw) return [];

  let value = raw;

  // Handle JSON string
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (e) {
      console.warn('Failed to parse segments JSON string:', value);
      return [];
    }
  }

  let list = [];

  if (Array.isArray(value)) {
    list = value;
  } else if (value && typeof value === 'object') {
    if (Array.isArray(value.segments)) {
      list = value.segments;
    } else if (Array.isArray(value.items)) {
      list = value.items;
    } else if (Array.isArray(value.data)) {
      list = value.data;
    } else {
      // Check if it's an object keyed by segment IDs (e.g., { "ge7hll": { label: "ESL teachers", ... } })
      const entries = Object.entries(value);
      const isSegmentMap =
        entries.length > 0 &&
        entries.every(
          ([_, v]) =>
            v &&
            typeof v === 'object' &&
            (v.label || v.use_case || v.useCase || v.pain || v.name)
        );

      if (isSegmentMap) {
        list = entries.map(([key, seg]) => ({
          id: seg.id || key,
          ...seg,
        }));
      } else {
        console.warn('Unexpected campaign/segment payload shape:', raw);
        return [];
      }
    }
  } else {
    console.warn('Unexpected campaign/segment payload shape:', raw);
    return [];
  }

  // Safe helper to convert any array or comma/json string into an array
  const toSafeArray = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) return parsed;
      } catch (_) {}
      return v.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  return list.map((seg, idx) => {
    if (!seg || typeof seg !== 'object') {
      return {
        id: `seg-${idx}`,
        label: String(seg || `Campaign ${idx + 1}`),
        icon: 'graduation-cap',
        useCase: '',
        pain: '',
        criteria: [],
        negativeCriteria: [],
        keywords: [],
        exampleClients: [],
        percentage: 15,
        estimatedCompanies: 5000,
        count: '5.0K',
      };
    }

    // Format count / percentage
    let countDisplay = seg.count;
    if (!countDisplay) {
      const est = seg.estimatedCompanies || seg.estimated_companies;
      if (est) {
        countDisplay =
          est >= 1000
            ? `${(est / 1000).toFixed(1).replace(/\.0$/, '')}K`
            : String(est);
      } else if (seg.percentage) {
        countDisplay = `${seg.percentage}%`;
      } else {
        countDisplay = '5.0K';
      }
    }

    return {
      id: seg.id || `seg-${idx}`,
      label: seg.label || seg.name || `Campaign ${idx + 1}`,
      icon: seg.icon || 'graduation-cap',
      useCase: seg.useCase || seg.use_case || '',
      pain: seg.pain || '',
      criteria: toSafeArray(seg.criteria),
      negativeCriteria: toSafeArray(
        seg.negativeCriteria ?? seg.negative_criterias ?? seg.negative_criteria
      ),
      keywords: toSafeArray(seg.keywords),
      exampleClients: toSafeArray(
        seg.exampleClients ?? seg.example_clients
      ),
      percentage: Number(seg.percentage) || 15,
      estimatedCompanies:
        Number(seg.estimatedCompanies || seg.estimated_companies) || 5000,
      count: countDisplay,
      buyerType: seg.buyerType || seg.buyer_type || 'company',
      decisionMaker: seg.decisionMaker || seg.decision_maker || '',
    };
  });
}

/**
 * Normalizes competitor list into a guaranteed Array<{ domain: string, name?: string, faviconUrl?: string }>.
 *
 * @param {any} raw - Array, JSON string, or nested object.
 * @returns {Array<{ domain: string, name: string, faviconUrl: string|null }>}
 */
export function normalizeCompetitors(raw) {
  if (!raw) return [];

  let value = raw;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (e) {
      console.warn('Failed to parse competitors JSON string:', value);
      return [];
    }
  }

  let list = [];
  if (Array.isArray(value)) {
    list = value;
  } else if (value && typeof value === 'object') {
    if (Array.isArray(value.competitors)) {
      list = value.competitors;
    } else if (Array.isArray(value.items)) {
      list = value.items;
    } else {
      list = Object.values(value).filter(
        (v) => v && typeof v === 'object' && v.domain
      );
    }
  }

  return list.map((item, idx) => {
    if (typeof item === 'string') {
      return {
        domain: item,
        name: item,
        faviconUrl: `https://www.google.com/s2/favicons?domain=${item}&sz=32`,
      };
    }
    const domain = item?.domain || `competitor-${idx + 1}.com`;
    return {
      domain,
      name: item?.name || domain,
      faviconUrl:
        item?.faviconUrl ||
        item?.favicon_url ||
        `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
    };
  });
}

/**
 * Normalizes product determinants array.
 */
export function normalizeDeterminants(raw) {
  if (!raw) return [];
  let value = raw;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (_) {
      return value.split('\n').filter(Boolean);
    }
  }
  return Array.isArray(value) ? value : [];
}

/**
 * Normalizes search queries array.
 */
export function normalizeSearchQueries(raw) {
  if (!raw) return [];
  let value = raw;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (_) {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return Array.isArray(value) ? value : [];
}
