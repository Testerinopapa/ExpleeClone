const fs = require('fs');

const aggregate = JSON.parse(fs.readFileSync('CreateMyProjectFlow/project_aggregate.json', 'utf8'));
const sse = JSON.parse(fs.readFileSync('CreateMyProjectFlow/sse_messages.json', 'utf8'));

console.log('Company:', aggregate.company.name, aggregate.company.domain);
console.log('Competitors count:', aggregate.competitors.length);
console.log('Determinants:', aggregate.determinants);
console.log('Search queries:', aggregate.search_queries);
console.log('Segments count in aggregate:', aggregate.segments.length);

// Extract segments
const segments = aggregate.segments;
fs.writeFileSync('src/data/autogtm_project_data.json', JSON.stringify({
  company: aggregate.company,
  determinants: aggregate.determinants,
  competitors: aggregate.competitors,
  search_queries: aggregate.search_queries,
  segments: aggregate.segments,
  domains: aggregate.domains
}, null, 2), 'utf8');

console.log('Saved src/data/autogtm_project_data.json');
