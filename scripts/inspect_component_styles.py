import json

with open('explee-visual-capture/pages/001-introduction/visual.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("--- Inspecting Operations Card ---")
for el in data['elements']:
    ident = el.get('identity', {})
    classes = ident.get('classes', [])
    geom = el.get('geometry', {})
    if 'scalar-card' in classes and geom.get('y', 0) > 600 and geom.get('y', 0) < 800:
        print(f"scalar-card: {geom}")
        print(f"  border: {el.get('border')}")
        print(f"  bg: {el.get('background')}")
        print(f"  shadow: {el.get('shadowAndEffects')}")
    if 'endpoint' in classes:
        print(f"endpoint: {geom} typo={el.get('typography')}")
        break

print("\n--- Inspecting Auth card table & rows ---")
for el in data['elements']:
    ident = el.get('identity', {})
    classes = ident.get('classes', [])
    geom = el.get('geometry', {})
    if 'scalar-data-table' in classes:
        print(f"scalar-data-table: {geom} border={el.get('border')}")
    if ident.get('tag') == 'td' and geom.get('y', 0) < 300:
        print(f"td: {geom} border={el.get('border')} bg={el.get('background', {}).get('backgroundColor')}")

print("\n--- Inspecting Sidebar active item & badges ---")
for el in data['elements']:
    ident = el.get('identity', {})
    classes = ident.get('classes', [])
    geom = el.get('geometry', {})
    text = (ident.get('textContent') or '').strip()
    if text == 'Introduction' and geom.get('x', 0) < 288:
        print(f"Sidebar Intro: {geom} bg={el.get('background', {}).get('backgroundColor')} typo={el.get('typography')} border={el.get('border')}")
    if 'group/button' in classes and geom.get('y', 0) < 90:
        print(f"group/button: {geom} bg={el.get('background', {}).get('backgroundColor')}")
    if text == 'GET' and geom.get('x', 0) < 288 and geom.get('y', 0) < 200:
        print(f"Sidebar GET: {geom} bg={el.get('background', {}).get('backgroundColor')} typo={el.get('typography')}")
