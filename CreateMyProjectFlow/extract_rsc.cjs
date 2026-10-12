const fs = require('fs');
const data = JSON.parse(fs.readFileSync('CreateMyProjectFlow/explee-workflow-capture-2026-09-30T04-25-55-584Z.json', 'utf8'));

const rscEvent = data.events.find(e => e.url && e.url.includes('/explore?src=cabinet') && typeof e.body === 'string' && e.body.length > 5000);
if (rscEvent) {
  fs.writeFileSync('CreateMyProjectFlow/rsc_payload.txt', rscEvent.body, 'utf8');
  console.log('Saved rsc_payload.txt, length:', rscEvent.body.length);
} else {
  console.log('Not found');
}
