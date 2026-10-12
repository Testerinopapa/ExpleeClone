import { strict as assert } from 'node:assert';
import { buildProfile, companyUrl, domainOf, safeNextPage, selectPages } from './research-core.ts';

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
