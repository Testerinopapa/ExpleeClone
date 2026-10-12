const fs = require('fs');
const sse = JSON.parse(fs.readFileSync('CreateMyProjectFlow/sse_messages.json', 'utf8'));

console.log('SSE count:', sse.length);
const types = {};
sse.forEach(m => {
  types[m.type] = (types[m.type] || 0) + 1;
});
console.log('Types:', types);

// Let's check tool_result
const toolResults = sse.filter(m => m.type === 'tool_result');
toolResults.forEach((tr, i) => {
  console.log(`Tool Result [${i}]:`, tr.output ? tr.output.slice(0, 150) : '');
});

// Let's check segment_ready
const segments = sse.filter(m => m.type === 'segment_ready');
console.log('Segment ready count:', segments.length);
if (segments.length > 0) {
  fs.writeFileSync('CreateMyProjectFlow/segments_extracted.json', JSON.stringify(segments, null, 2), 'utf8');
}
