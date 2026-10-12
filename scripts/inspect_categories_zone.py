import json

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

elements = manifest['visual']['elements']

# Let's inspect elements between Countries section and Custom attributes section
in_between = []
found_countries = False
for el in elements:
    sel = el.get('selector', '')
    if 'section.mb-24:nth-of-type(2)' in sel:
        found_countries = True
    elif 'section.relative.overflow-hidden:nth-of-type(1)' in sel:
        break
    elif found_countries:
        in_between.append(el)

print(f"Elements between countries and custom attributes: {len(in_between)}")

for el in in_between[:35]:
    text = (el.get('text') or '').strip().replace('\n', ' ')
    tag = el.get('tag', '')
    sel = el.get('selector', '')
    cls = el.get('attrs', {}).get('class', '')
    print(f"[{tag}] {sel[:60]} | {cls[:40]} | {text[:50]}")
