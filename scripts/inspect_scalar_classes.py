import json

with open('explee-visual-capture/pages/001-introduction/visual.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

classes_to_check = [
    'references-rendered',
    'narrow-references-container',
    'section-container',
    'introduction-section',
    'section-columns',
    'section-column',
    'introduction-card',
    'introduction-card-item',
    'client-libraries-heading',
    'download-container',
    'download-button'
]

for el in data['elements']:
    ident = el.get('identity', {})
    el_classes = ident.get('classes', [])
    for c in classes_to_check:
        if c in el_classes:
            geom = el.get('geometry', {})
            layout = el.get('layout', {})
            typo = el.get('typography', {})
            bg = el.get('background', {})
            border = el.get('border', {})
            print(f"=== {ident.get('tag')} .{'.'.join(el_classes)} ===")
            print(f"  Geom: x={geom.get('x')} y={geom.get('y')} w={geom.get('width')} h={geom.get('height')}")
            print(f"  Layout: {layout}")
            print(f"  Border: {border}")
            print(f"  Bg: {bg.get('background')}")
            print()
            break
