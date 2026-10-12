const fs = require('fs');
const html = fs.readFileSync('CreateMyProjectFlow/snap0.html', 'utf8');
const styles = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
console.log('Style tags found:', styles.length);
if (styles.length > 0) {
  fs.writeFileSync('CreateMyProjectFlow/extracted_styles.css', styles.join('\n\n'), 'utf8');
  console.log('Saved extracted_styles.css');
}
