const fs = require('fs');
const har = JSON.parse(fs.readFileSync('CreateMyProjectFlow/explee.com.har', 'utf8'));
for (const entry of har.log.entries) {
  const url = entry.request.url;
  if (url.includes('api/') || url.includes('.svg') || url.includes('.json')) {
    console.log('=== URL:', url);
    if (entry.request.postData && entry.request.postData.text) {
      console.log('Req Body:', entry.request.postData.text.slice(0, 300));
    }
    if (entry.response.content && entry.response.content.text) {
      console.log('Res Body:', entry.response.content.text.slice(0, 500));
    }
  }
}
