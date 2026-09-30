import regionsJson from './gmRegions.json';
import { getAllCountries } from './countryData';

// Map 2-letter ISO country codes to region IDs
const COUNTRY_CODE_TO_REGION = {
  // North America (6)
  US: 'north-america', CA: 'north-america', MX: 'north-america', BM: 'north-america', GL: 'north-america', PM: 'north-america',

  // Europe (49)
  DE: 'europe', GB: 'europe', FR: 'europe', IT: 'europe', ES: 'europe', PL: 'europe', NL: 'europe', BE: 'europe',
  SE: 'europe', CH: 'europe', AT: 'europe', NO: 'europe', DK: 'europe', FI: 'europe', GR: 'europe', PT: 'europe',
  CZ: 'europe', IE: 'europe', RO: 'europe', HU: 'europe', UA: 'europe', SK: 'europe', BG: 'europe', HR: 'europe',
  RS: 'europe', LT: 'europe', SI: 'europe', LV: 'europe', EE: 'europe', CY: 'europe', LU: 'europe', MT: 'europe',
  IS: 'europe', AL: 'europe', MK: 'europe', BA: 'europe', ME: 'europe', XK: 'europe',
  AD: 'europe', LI: 'europe', MC: 'europe', SM: 'europe', VA: 'europe', FO: 'europe', GI: 'europe', IM: 'europe',
  JE: 'europe', GG: 'europe', SJ: 'europe',

  // Asia Pacific (17)
  CN: 'asia-pacific', IN: 'asia-pacific', JP: 'asia-pacific', KR: 'asia-pacific', TW: 'asia-pacific', HK: 'asia-pacific',
  PK: 'asia-pacific', BD: 'asia-pacific', LK: 'asia-pacific', NP: 'asia-pacific', MN: 'asia-pacific', MO: 'asia-pacific',
  AF: 'asia-pacific', BT: 'asia-pacific', MV: 'asia-pacific', KP: 'asia-pacific', IR: 'asia-pacific',

  // Southeast Asia (11)
  ID: 'southeast-asia', VN: 'southeast-asia', TH: 'southeast-asia', PH: 'southeast-asia', MY: 'southeast-asia',
  SG: 'southeast-asia', KH: 'southeast-asia', LA: 'southeast-asia', BN: 'southeast-asia', TL: 'southeast-asia',
  MM: 'southeast-asia',

  // Latin America (50)
  BR: 'latin-america', AR: 'latin-america', CO: 'latin-america', CL: 'latin-america', PE: 'latin-america',
  VE: 'latin-america', EC: 'latin-america', GT: 'latin-america', CU: 'latin-america', BO: 'latin-america',
  DO: 'latin-america', CR: 'latin-america', PA: 'latin-america', UY: 'latin-america', PY: 'latin-america',
  PR: 'latin-america', JM: 'latin-america', TT: 'latin-america', SV: 'latin-america', HN: 'latin-america',
  NI: 'latin-america', HT: 'latin-america', BS: 'latin-america', BB: 'latin-america', LC: 'latin-america',
  CW: 'latin-america', AW: 'latin-america', BZ: 'latin-america', GY: 'latin-america', SR: 'latin-america',
  GF: 'latin-america', GP: 'latin-america', MQ: 'latin-america', VI: 'latin-america', KY: 'latin-america',
  AG: 'latin-america', DM: 'latin-america', GD: 'latin-america', KN: 'latin-america', VC: 'latin-america',
  SX: 'latin-america', TC: 'latin-america', VG: 'latin-america', AI: 'latin-america', MS: 'latin-america',
  BL: 'latin-america', MF: 'latin-america', BQ: 'latin-america', FK: 'latin-america', XX: 'latin-america',

  // Middle East (15)
  TR: 'middle-east', SA: 'middle-east', AE: 'middle-east', IL: 'middle-east', IQ: 'middle-east',
  QA: 'middle-east', KW: 'middle-east', OM: 'middle-east', JO: 'middle-east', LB: 'middle-east', BH: 'middle-east',
  YE: 'middle-east', PS: 'middle-east', SY: 'middle-east', XN: 'middle-east',

  // CIS Countries (11)
  RU: 'cis', KZ: 'cis', UZ: 'cis', AZ: 'cis', AM: 'cis', GE: 'cis', KG: 'cis', TJ: 'cis', TM: 'cis',
  BY: 'cis', MD: 'cis',

  // Oceania (29) matching media_1790724089424.png
  AU: 'oceania', NZ: 'oceania', PG: 'oceania', FJ: 'oceania', PF: 'oceania', NC: 'oceania', GU: 'oceania',
  WS: 'oceania', SB: 'oceania', VU: 'oceania', MP: 'oceania', TO: 'oceania', PW: 'oceania', CK: 'oceania',
  FM: 'oceania', AS: 'oceania', KI: 'oceania', MH: 'oceania', WF: 'oceania', NF: 'oceania', NR: 'oceania',
  TV: 'oceania', NU: 'oceania', TK: 'oceania', PN: 'oceania', CX: 'oceania', CC: 'oceania', HM: 'oceania',
  UM: 'oceania',

  // Africa (56)
  ZA: 'africa', NG: 'africa', EG: 'africa', KE: 'africa', MA: 'africa', GH: 'africa', DZ: 'africa', ET: 'africa',
  TZ: 'africa', UG: 'africa', TN: 'africa', AO: 'africa', CI: 'africa', CM: 'africa', SN: 'africa', MG: 'africa',
  ZW: 'africa', MZ: 'africa', ZM: 'africa', SD: 'africa', LY: 'africa', NA: 'africa', BW: 'africa', GA: 'africa',
  CD: 'africa', CG: 'africa', RW: 'africa', MW: 'africa', ML: 'africa', BF: 'africa', NE: 'africa', GN: 'africa',
  SO: 'africa', TD: 'africa', SS: 'africa', BJ: 'africa', TG: 'africa', MR: 'africa', ER: 'africa', SL: 'africa',
  LR: 'africa', CF: 'africa', DJ: 'africa', GQ: 'africa', SZ: 'africa', LS: 'africa', GM: 'africa', GW: 'africa',
  KM: 'africa', CV: 'africa', ST: 'africa', SC: 'africa', YT: 'africa', RE: 'africa', SH: 'africa', MU: 'africa',
  BI: 'africa', EH: 'africa',
};

// Demonyns for titles
const REGION_DEMONYMS = {
  'north-america': 'North American',
  europe: 'European',
  'asia-pacific': 'Asia Pacific',
  'southeast-asia': 'Southeast Asian',
  'latin-america': 'Latin American',
  'middle-east': 'Middle Eastern',
  cis: 'CIS',
  'cis-countries': 'CIS',
  oceania: 'Oceanian',
  africa: 'African',
};

// Canonical regions map
export const ALL_REGIONS = regionsJson.map((r) => {
  const demonym = REGION_DEMONYMS[r.id] || r.name;
  return {
    ...r,
    slug: r.id,
    demonym,
  };
});

// Fast lookup by slug (supporting aliases like cis-countries)
const regionSlugMap = new Map();
ALL_REGIONS.forEach((r) => {
  regionSlugMap.set(r.id, r);
  if (r.id === 'cis') {
    regionSlugMap.set('cis-countries', r);
  }
});

export function getRegionBySlug(slug) {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim();
  return regionSlugMap.get(clean) || null;
}

export function getAllRegions() {
  return ALL_REGIONS;
}

// Get all countries belonging to a specific region, maintaining relative order
export function getCountriesForRegion(regionSlug) {
  const reg = getRegionBySlug(regionSlug);
  if (!reg) return [];
  const normalizedRegionId = reg.id;

  const allCountries = getAllCountries();

  // Filter countries mapped to this region
  const filtered = allCountries.filter((c) => {
    const assigned = COUNTRY_CODE_TO_REGION[c.code];
    return assigned === normalizedRegionId;
  });

  return filtered;
}
