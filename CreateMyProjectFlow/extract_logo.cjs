const fs = require('fs');
const html = fs.readFileSync('CreateMyProjectFlow/snap0.html', 'utf8');
const logoIdx = html.indexOf('fill="currentColor"></path></svg></a><button data-slot="sidebar-trigger"');
if (logoIdx !== -1) {
  const logoStart = html.lastIndexOf('<a', logoIdx);
  console.log(html.slice(logoStart, logoIdx + 40));
}
