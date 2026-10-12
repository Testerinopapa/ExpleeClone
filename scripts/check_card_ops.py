import json

with open('explee-visual-capture/pages/001-introduction/visual.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find scalar-card containing endpoints
card_endpoints = []
for el in data['elements']:
    geom = el.get('geometry', {})
    classes = el.get('identity', {}).get('classes', [])
    # card is around y=686 to y=1324
    if 'endpoint' in classes and 686 <= geom.get('y', 0) <= 1350:
        selector = el.get('identity', {}).get('selector', '')
        card_endpoints.append((geom.get('y'), selector))

print(f"Endpoints inside AutoGTM operations card: {len(card_endpoints)}")
