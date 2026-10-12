const fs = require('fs');
const data = JSON.parse(fs.readFileSync('CreateMyProjectFlow/explee-workflow-capture-2026-09-30T04-25-55-584Z.json', 'utf8'));

const fetches = data.events.filter(e => e.type === 'fetch.response' || e.type === 'xhr.response');
fetches.forEach((f, i) => {
  const url = f.url || f.requestUrl || '';
  if (url.includes('companies') || url.includes('people') || url.includes('table') || url.includes('rows') || url.includes('preview')) {
    console.log(`Fetch [${i}]:`, url, 'Status:', f.status);
    if (f.body) {
      const str = typeof f.body === 'string' ? f.body : JSON.stringify(f.body);
      console.log('  Preview:', str.slice(0, 200));
      if (url.includes('companies') && !fs.existsSync('CreateMyProjectFlow/companies_data.json')) {
        fs.writeFileSync('CreateMyProjectFlow/companies_data.json', str, 'utf8');
      }
      if (url.includes('people') && !fs.existsSync('CreateMyProjectFlow/people_data.json')) {
        fs.writeFileSync('CreateMyProjectFlow/people_data.json', str, 'utf8');
      }
    }
  }
});
