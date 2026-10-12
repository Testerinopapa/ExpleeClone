import json

with open('explee-visual-capture/pages/001-introduction/visual.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("\n--- Key Main Content Elements (x > 280, y < 160) ---")
containers = []
for el in data['elements']:
    geom = el.get('geometry', {})
    ident = el.get('identity', {})
    y = geom.get('y', 99999)
    x = geom.get('x', 0)
    w = geom.get('width', 0)
    h = geom.get('height', 0)
    tag = ident.get('tag')
    classes = '.'.join(ident.get('classes', []))
    text = (ident.get('textContent') or '')[:60].strip().replace('\n', ' ')
    
    if x > 280 and y < 160:
        containers.append((x, y, w, h, tag, classes, text))

for x, y, w, h, tag, classes, text in containers:
    print(f"x={x:<4} y={y:<4} w={w:<4} h={h:<4} | {tag:<6} .{classes[:40]:<40} | '{text}'")
