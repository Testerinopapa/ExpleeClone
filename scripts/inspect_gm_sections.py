import json

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

elements = data['visual']['elements']

# Let's inspect sections in main
main_elements = []
for el in elements:
    sel = el.get('selector', '')
    if 'main' in sel:
        # Check direct or top-level children of main
        main_elements.append(el)

print(f"Total elements inside main: {len(main_elements)}")

# Group elements by their major container / section tag
sections = []
for el in elements:
    tag = el.get('tag', '').lower()
    if tag == 'section':
        sections.append(el)

print(f"Total <section> tags: {len(sections)}")
for i, s in enumerate(sections):
    print(f"\n--- SECTION {i+1} ---")
    print("Selector:", s.get('selector'))
    print("Classes:", s.get('attrs', {}).get('class', ''))
    print("Text preview:", (s.get('text') or '')[:120].strip().replace('\n', ' '))
