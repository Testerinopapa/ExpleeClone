import json

with open('explee-visual-capture/pages/001-introduction/visual.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for el in data['elements']:
    ident = el.get('identity', {})
    el_classes = ident.get('classes', [])
    geom = el.get('geometry', {})
    if 'introduction-section' in el_classes:
        print("introduction-section layout:")
        print(el.get('layout'))
        print(el.get('geometry'))
