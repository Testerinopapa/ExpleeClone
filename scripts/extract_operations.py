import json

with open('explee-visual-capture/pages/001-introduction/visual.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

endpoints = []
for el in data['elements']:
    classes = el.get('identity', {}).get('classes', [])
    if 'endpoint' in classes and el.get('identity', {}).get('tag') == 'a':
        text = el.get('identity', {}).get('textContent', '').strip()
        endpoints.append(text)

print(f"Total operations in Operations table: {len(endpoints)}")
for ep in endpoints:
    print(ep)
