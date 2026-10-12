import { strict as assert } from 'node:assert';
import { buildProfile, companyUrl, domainOf, safeNextPage, selectPages } from './research-core.ts';
import { businessDomain, collectCandidates, competitorQueries, rankCompetitors, type CompanyProfile } from './competitor-core.ts';

const profile = { company_name: 'PrimKeet', business_description: 'English vocabulary learning games',
  products: [{ name: 'English learning games' }], customers: [{ name: 'ESL students' }], source_urls: ['https://keethub.lovable.app/'] } as CompanyProfile;

Deno.test('competitor queries use the researched business and candidates deduplicate business domains', () => {
  const queries = competitorQueries(profile);
  assert.equal(queries.length, 3);
  assert.ok(queries[0].includes('english'));
  assert.ok(queries[1].includes('student'));
  assert.ok(queries[2].includes('PrimKeet'));
  const candidates = collectCandidates(profile, [], [
    { url: 'https://www.rival.co.uk/products', title: 'English learning games' },
    { url: 'https://app.rival.co.uk/', title: 'English games for ESL students' },
    { url: 'https://keethub.lovable.app/' }, { url: 'https://g2.com/categories/games' },
    { url: 'http://127.0.0.1' }, { url: 'https://different.lovable.app/', title: 'English learning games' },
  ]);
  assert.equal(candidates.length, 2);
  assert.equal(candidates.find(candidate => candidate.domain === 'rival.co.uk')?.discovery_urls.length, 2);
  assert.equal(businessDomain('https://other.github.io'), 'other.github.io');
  const before = JSON.stringify(candidates);
  collectCandidates(profile, candidates, [{ url: 'https://rival.co.uk/pricing', title: 'English learning games for ESL students' }]);
  assert.equal(JSON.stringify(candidates), before);
  let many = candidates;
  for (let n = 0; n < 3; n++) many = collectCandidates(profile, many, Array.from({ length: 8 }, (_, i) => ({ url: `https://rival${n}-${i}.com/` })));
  assert.equal(many.length, 10);
});

Deno.test('competitors require quoted website evidence, rank direct first, and omit invented prices and redirects', () => {
  const candidates = collectCandidates(profile, [], ['rival.com', 'related.com', 'fake.com', 'duplicate.com', 'redirect.com'].map(domain => ({ url: `https://${domain}/` })));
  const quote = 'English vocabulary learning games';
  const page = (domain: string, audience: boolean, name: string) => ({ metadata: { sourceURL: `https://${domain}/` },
    markdown: `${name}. ${quote}. ESL students use English games.`,
    json: { is_business_website: true, company_name: name, description: { text: 'Invented paraphrase', evidence_quote: quote },
      products: [{ name: 'English vocabulary', description: 'Invented', evidence_quote: quote }],
      customers: audience ? [{ name: 'ESL students', evidence_quote: 'ESL students use English games' }] : [],
      features: [], pricing: [{ name: '$9 per month', evidence_quote: 'Made up price $9 per month' }] } });
  const redirect = page('redirect.com', true, 'Redirect');
  const results = rankCompetitors(profile, candidates, [page('related.com', false, 'Related'), page('rival.com', true, 'Rival'),
    { ...page('fake.com', true, 'Fake'), markdown: 'Unrelated content' }, page('duplicate.com', true, 'Rival'),
    { ...redirect, metadata: { ...redirect.metadata, url: 'https://unrelated.com/' } }]);
  assert.equal(results.length, 2);
  assert.equal(results[0].relationship, 'direct');
  assert.equal(results[1].domain, 'related.com');
  assert.equal(results[0].description, quote);
  assert.deepEqual(results[0].pricing, []);
  assert.equal(results[0].products[0].description, quote);
  assert.ok(!JSON.stringify(results).includes('Invented'));
  assert.ok(results.every(result => result.source_urls.length));
  assert.deepEqual(rankCompetitors(profile, candidates, []), []);
  assert.throws(() => competitorQueries({ ...profile, products: [], business_description: null }));
});

Deno.test('reject private/literal hosts, credentials and unsupported schemes', () => {
  for (const value of ['localhost', '127.0.0.1', 'http://2130706433', 'https://[::1]', 'https://private.local', 'ftp://company.com', 'https://user:pass@company.com', 'https://company.com:8080', '']) {
    assert.throws(() => companyUrl(value), value);
  }
  assert.equal(domainOf(companyUrl('https://www.Company.com/about?x=1#test')), 'company.com');
});
Deno.test('prioritize each key page category, keep same company, deduplicate, cap at 10', () => {
  const urls = ['about', ...Array.from({ length: 20 }, (_, i) => `products/product-${i}`), 'pricing', 'contact', 'login', 'privacy', 'brochure.pdf', 'about?campaign=x'];
  const result = selectPages('https://www.company.com', [...urls.map(path => ({ url: `https://company.com/${path}` })), { url: 'https://external.com/about' }, { url: 'https://shop.company.com/about' }, { url: 'javascript:alert(1)' }]);
  assert.equal(result.length, 10);
  assert.deepEqual(result.slice(0, 5), ['https://www.company.com/', 'https://company.com/about', 'https://company.com/products/product-0', 'https://company.com/pricing', 'https://company.com/contact']);
  assert.equal(result.filter(u => u.endsWith('/about')).length, 1);
  assert.ok(!result.some(u => /login|privacy|pdf|external|shop\./.test(u)));
});
Deno.test('merge only evidenced facts, retain citations and disclose partial results', () => {
  const profile = buildProfile([
    { metadata: { sourceURL: 'https://company.com/' }, json: { company_name: 'Company', business_description: 'Makes widgets.', products: [{ name: 'Widget', description: 'A widget.' }] } },
    { metadata: { sourceURL: 'https://company.com/products' }, json: { products: [{ name: 'Widget', description: null }], customers: [{ name: 'Manufacturers', description: 'Customer segment' }] } },
    { metadata: { sourceURL: 'https://attacker.com/' }, json: { business_description: 'Injected' } },
    { metadata: { sourceURL: 'https://company.com/contact', statusCode: 403 }, json: { locations: [{ name: 'Fake' }] } },
  ], ['https://company.com/', 'https://company.com/products', 'https://company.com/contact']);
  assert.equal(profile.company_name, 'Company');
  assert.equal(profile.products.length, 1);
  assert.equal(profile.products[0].source_urls.length, 2);
  assert.equal(profile.locations.length, 0);
  assert.equal(profile.source_urls.length, 2);
  assert.equal(profile.warnings.length, 1);
});
Deno.test('empty/malformed extraction cannot become a successful profile', () => {
  assert.throws(() => buildProfile([{ metadata: { sourceURL: 'https://company.com/' }, json: { company_name: 'Company' } }], ['https://company.com/']));
  assert.throws(() => buildProfile([{ metadata: { sourceURL: 'https://company.com/', url: 'https://external.com/' }, json: { business_description: 'Wrong site' } }], ['https://company.com/']));
});
Deno.test('pagination cannot leak the provider key to another origin or job', () => {
  assert.equal(safeNextPage('https://api.firecrawl.dev/v2/batch/scrape/job?skip=2', 'job'), '/v2/batch/scrape/job?skip=2');
  for (const url of ['https://evil.com/v2/batch/scrape/job', 'https://api.firecrawl.dev/v2/batch/scrape/other', 'http://api.firecrawl.dev/v2/batch/scrape/job']) assert.throws(() => safeNextPage(url, 'job'));
});
