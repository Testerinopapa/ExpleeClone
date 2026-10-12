import json

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

elements = data['visual']['elements']

print("--- MAIN SECTIONS BY SELECTOR & TAG ---")
sections = []
for el in elements:
    tag = el.get('tag', '').lower()
    sel = el.get('selector', '')
    if tag in ['header', 'main', 'footer', 'nav'] or (tag == 'section') or ('container' in sel and tag == 'div'):
        sections.append((el.get('index'), tag, sel, el.get('text', '')[:40] if el.get('text') else ''))

for s in sections[:40]:
    print(s)

print("\n--- BUTTONS & LINKS ---")
actions = []
for el in elements:
    tag = el.get('tag', '').lower()
    if tag in ['button', 'a'] and el.get('visible'):
        text = (el.get('text') or '').strip().replace('\n', ' ')
        href = el.get('attrs', {}).get('href', '')
        if text or href:
            actions.append((tag, text[:30], href, el.get('selector', '')[:60]))

for a in actions[:30]:
    print(a)
