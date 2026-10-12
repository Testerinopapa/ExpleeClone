const fs = require('fs');
const data = JSON.parse(fs.readFileSync('CreateMyProjectFlow/explee-workflow-capture-2026-09-30T04-25-55-584Z.json', 'utf8'));

const ev607 = data.events[607];
if (ev607 && ev607.body) {
  try {
    const parsed = typeof ev607.body === 'string' ? JSON.parse(ev607.body) : ev607.body;
    fs.writeFileSync('CreateMyProjectFlow/project_aggregate.json', JSON.stringify(parsed, null, 2), 'utf8');
    console.log('Saved project_aggregate.json, top keys:', Object.keys(parsed));
  } catch (e) {
    fs.writeFileSync('CreateMyProjectFlow/project_aggregate.txt', ev607.body, 'utf8');
    console.log('Saved as text');
  }
}
