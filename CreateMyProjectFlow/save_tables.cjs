const fs = require('fs');

const compEvent = JSON.parse(fs.readFileSync('CreateMyProjectFlow/londonschool_event.json', 'utf8'));
const peopleEvent = JSON.parse(fs.readFileSync('CreateMyProjectFlow/people_response.json', 'utf8'));

fs.writeFileSync('src/data/autogtm_companies.json', JSON.stringify(compEvent.body.rows || compEvent.body, null, 2), 'utf8');
console.log('Saved src/data/autogtm_companies.json, count:', (compEvent.body.rows || compEvent.body).length);

fs.writeFileSync('src/data/autogtm_people.json', JSON.stringify(peopleEvent.rows || peopleEvent, null, 2), 'utf8');
console.log('Saved src/data/autogtm_people.json, count:', (peopleEvent.rows || peopleEvent).length);
