import json

with open('explee-visual-capture/pages/001-introduction/visual.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("--- Authentication Card Hierarchy ---")
for el in data['elements']:
    geom = el.get('geometry', {})
    classes = el.get('identity', {}).get('classes', [])
    y = geom.get('y', 0)
    x = geom.get('x', 0)
    w = geom.get('width', 0)
    if 150 <= y <= 286 and 888 <= x <= 890 and w > 400:
        tag = el.get('identity', {}).get('tag')
        cls = '.'.join(classes)
        print(f"{tag:<6} .{cls:<45} y={y:<4} h={geom.get('height'):<4} border={el.get('border', {}).get('border')} bg={el.get('background', {}).get('backgroundColor')}")
