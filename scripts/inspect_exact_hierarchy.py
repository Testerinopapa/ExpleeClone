import json

with open('explee-visual-capture/pages/001-introduction/visual.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("--- Inspecting section containers ---")
for el in data['elements']:
    ident = el.get('identity', {})
    classes = ident.get('classes', [])
    geom = el.get('geometry', {})
    if 'section-container' in classes:
        print(f"section-container: {geom}")
    if 'introduction-section' in classes:
        print(f"introduction-section: {geom} padding={el.get('layout', {}).get('padding')}")
    if 'section-header-wrapper' in classes and geom.get('y', 0) < 200:
        print(f"intro header-wrapper: {geom} layout={el.get('layout')}")
    if 'section-columns' in classes and geom.get('y', 0) < 200:
        print(f"intro section-columns: {geom} layout={el.get('layout')}")

print("\n--- Inspecting AutoGTM section container ---")
for el in data['elements']:
    ident = el.get('identity', {})
    classes = ident.get('classes', [])
    geom = el.get('geometry', {})
    if 'tag-section-container' in classes:
        print(f"tag-section-container: {geom} border={el.get('border')} padding={el.get('layout', {}).get('padding')}")
    if ident.get('tag') == 'section' and geom.get('y', 0) > 400 and geom.get('y', 0) < 700:
        print(f"AutoGTM section: {geom} layout={el.get('layout', {}).get('padding')}")
    if ident.get('tag') == 'h2' and geom.get('y', 0) > 500 and geom.get('y', 0) < 800:
        print(f"AutoGTM h2: {geom} typo={el.get('typography')}")
