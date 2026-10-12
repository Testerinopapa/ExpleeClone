const fs = require('fs');
const har = JSON.parse(fs.readFileSync('CreateMyProjectFlow/explee.com.har', 'utf8'));
const entries = har.log.entries;
console.log('Total entries:', entries.length);
const cssEntries = entries.filter(e => e.request.url.includes('.css'));
console.log('CSS entries:', cssEntries.map(e => ({ url: e.request.url, size: e.response.content.size })));
if (cssEntries.length > 0 && cssEntries[0].response.content.text) {
  fs.writeFileSync('CreateMyProjectFlow/app.css', cssEntries[0].response.content.text, 'utf8');
  console.log('Saved app.css');
}
