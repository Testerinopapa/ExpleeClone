const fs = require('fs');
const data = JSON.parse(fs.readFileSync('CreateMyProjectFlow/explee-workflow-capture-2026-09-30T04-25-55-584Z.json', 'utf8'));

console.log('Event 607:', JSON.stringify(data.events[607], null, 2));

const sseMessages = data.events.filter(e => e.type === 'sse.message');
console.log('Total SSE messages:', sseMessages.length);
if (sseMessages.length > 0) {
  fs.writeFileSync('CreateMyProjectFlow/sse_messages.json', JSON.stringify(sseMessages.map(m => m.data), null, 2), 'utf8');
  console.log('Saved sse_messages.json');
}
