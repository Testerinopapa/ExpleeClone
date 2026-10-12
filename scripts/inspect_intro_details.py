import json

with open('explee-visual-capture/pages/001-introduction/visual.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for el in data['elements']:
    ident = el.get('identity', {})
    el_classes = ident.get('classes', [])
    text = (ident.get('textContent') or '').strip().replace('\n', ' ')
    tag = ident.get('tag')
    
    # Check intro section
    if 'introduction-section' in el_classes:
        print("=== introduction-section ===")
        print(f"geom: {el.get('geometry')}")
        print(f"layout: {el.get('layout')}")
        print(f"border: {el.get('border')}")
    
    # Check badge
    if 'badge' in el_classes and 'v1.0.0' in text:
        print("=== badge v1.0.0 ===")
        print(f"geom: {el.get('geometry')}")
        print(f"layout: {el.get('layout')}")
        print(f"typo: {el.get('typography')}")
        print(f"bg: {el.get('background')}")
        print(f"border: {el.get('border')}")

    # Check H1
    if tag == 'h1':
        print("=== H1 Explee Public API ===")
        print(f"geom: {el.get('geometry')}")
        print(f"layout: {el.get('layout')}")
        print(f"typo: {el.get('typography')}")

    # Check download-button
    if 'download-button' in el_classes and el.get('geometry', {}).get('width', 0) > 10:
        print("=== download-button ===")
        print(f"geom: {el.get('geometry')}")
        print(f"layout: {el.get('layout')}")
        print(f"typo: {el.get('typography')}")
        print(f"bg: {el.get('background')}")
        print(f"border: {el.get('border')}")

    # Check blockquote
    if tag == 'blockquote':
        print("=== blockquote ===")
        print(f"geom: {el.get('geometry')}")
        print(f"layout: {el.get('layout')}")
        print(f"typo: {el.get('typography')}")
        print(f"border: {el.get('border')}")

    # Check authentication card
    if 'introduction-card-item' in el_classes and el.get('geometry', {}).get('y', 0) < 200:
        print("=== authentication card ===")
        print(f"geom: {el.get('geometry')}")
        print(f"layout: {el.get('layout')}")
        print(f"border: {el.get('border')}")
        print(f"shadow: {el.get('shadowAndEffects')}")

    # Check client-libraries card
    if 'client-libraries-heading' in el_classes:
        print("=== client-libraries-heading ===")
        print(f"geom: {el.get('geometry')}")
        print(f"layout: {el.get('layout')}")
        print(f"typo: {el.get('typography')}")
