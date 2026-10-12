const fs = require('fs');
const data = JSON.parse(fs.readFileSync('CreateMyProjectFlow/explee-workflow-capture-2026-09-30T04-25-55-584Z.json', 'utf8'));

const fetches = data.events.filter(e => e.type === 'fetch.response' || e.type === 'xhr.response');
console.log('Fetches / XHR count:', fetches.length);
fetches.forEach(f => {
  console.log('Fetch URL:', f.url, 'Status:', f.status, 'Body length:', f.body ? f.body.length : 0);
  if (f.url && (f.url.includes('api') || f.url.includes('stream') || f.url.includes('explore') || f.url.includes('project') || f.url.includes('run'))) {
    console.log('  Preview:', (f.body || '').slice(0, 300));
  }
});
