const fs = require('fs');
const html = fs.readFileSync('CreateMyProjectFlow/snap0.html', 'utf8');
const target = 'flex-1 overflow-auto';
const idx = html.indexOf(target);
if (idx !== -1) {
  const sidebarHtml = html.slice(Math.max(0, idx - 4000), idx + 200);
  fs.writeFileSync('CreateMyProjectFlow/sidebar.html', sidebarHtml, 'utf8');
  console.log('Sidebar extracted, length:', sidebarHtml.length);
} else {
  console.log('Target not found');
}
