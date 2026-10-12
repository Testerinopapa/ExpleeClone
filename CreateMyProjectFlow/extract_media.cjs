const fs = require('fs');
const path = require('path');
const har = JSON.parse(fs.readFileSync('CreateMyProjectFlow/explee.com.har', 'utf8'));

for (const entry of har.log.entries) {
  const url = entry.request.url;
  const content = entry.response.content;
  if (!content || !content.text) continue;

  let filename = null;
  if (url.includes('findymail-icon.svg')) filename = 'findymail-icon.svg';
  else if (url.includes('leadmagic-icon.svg')) filename = 'leadmagic-icon.svg';
  else if (url.includes('wole-fagbohun.jpg')) filename = 'wole-fagbohun.jpg';
  else if (url.includes('stuart-armley-jones.png')) filename = 'stuart-armley-jones.png';
  else if (url.includes('wil-geller.jpg')) filename = 'wil-geller.jpg';
  else if (url.includes('hunter.io')) filename = 'hunter-icon.png';
  else if (url.includes('zerobounce.net')) filename = 'zerobounce-icon.png';

  if (filename) {
    const outPath = path.join('public', filename);
    const buf = content.encoding === 'base64' 
      ? Buffer.from(content.text, 'base64')
      : Buffer.from(content.text, 'utf8');
    fs.writeFileSync(outPath, buf);
    console.log('Saved:', outPath, 'size:', buf.length);
  }
}
