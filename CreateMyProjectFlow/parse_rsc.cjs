const fs = require('fs');
const content = fs.readFileSync('CreateMyProjectFlow/rsc_payload.txt', 'utf8');

// Next.js RSC format has lines starting with ID:JSON or similar
const lines = content.split('\n');
console.log('Total RSC lines:', lines.length);

lines.forEach((line, i) => {
  const match = line.match(/^([0-9a-f]+):(.*)/);
  if (match) {
    const id = match[1];
    const rest = match[2];
    if (rest.startsWith('{') || rest.startsWith('[')) {
      console.log(`Line ${i} [${id}]:`, rest.slice(0, 150));
      try {
        const obj = JSON.parse(rest);
        fs.writeFileSync(`CreateMyProjectFlow/rsc_item_${id}.json`, JSON.stringify(obj, null, 2), 'utf8');
        console.log(`  Saved rsc_item_${id}.json, keys:`, Object.keys(obj));
      } catch (err) {}
    }
  }
});
