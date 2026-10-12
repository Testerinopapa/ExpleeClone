const fs = require('fs');
const html = fs.readFileSync('CreateMyProjectFlow/snap0.html', 'utf8');
const idx = html.indexOf('find your first customers');
// Find parent container before this
let start = html.lastIndexOf('<div class="flex h-', idx);
if (start === -1) start = html.lastIndexOf('<div class="flex', idx);
if (start === -1) start = html.lastIndexOf('<body', idx);

const end = html.indexOf('</body>', idx);
const slice = html.slice(start, end !== -1 ? end : undefined);
fs.writeFileSync('CreateMyProjectFlow/rendered_body.html', slice, 'utf8');
console.log('Saved rendered_body.html, length:', slice.length);
