import json

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

elements = manifest['visual']['elements']

def get_elements_in_selector(sel_sub):
    return [el for el in elements if sel_sub in el.get('selector', '')]

# 1. Header
header_els = get_elements_in_selector('header')
print("=== HEADER ===")
for el in header_els:
    print(f"[{el.get('tag')}] {el.get('attrs', {}).get('class', '')} -> text: '{el.get('text')}' attrs: {el.get('attrs')}")

# 2. Hero
hero_els = get_elements_in_selector('section.text-center.mb-10')
print("\n=== HERO ===")
for el in hero_els:
    print(f"[{el.get('tag')}] {el.get('attrs', {}).get('class', '')} -> text: '{el.get('text')}'")

# 3. Metric cards
metric_els = get_elements_in_selector('section.mb-16:nth-of-type(2)')
print("\n=== METRIC CARDS ===")
for el in metric_els:
    if el.get('text') or el.get('tag') in ['img', 'svg']:
        print(f"[{el.get('tag')}] {el.get('attrs', {}).get('class', '')} -> text: '{el.get('text')}' attrs: {el.get('attrs')}")

# 4. Logos
logo_els = get_elements_in_selector('section.text-center.mb-0:nth-of-type(3)')
print("\n=== LOGOS ===")
for el in logo_els:
    if el.get('text') or el.get('tag') in ['img', 'svg', 'a']:
        print(f"[{el.get('tag')}] {el.get('attrs', {}).get('class', '')} -> text: '{el.get('text')}' attrs: {el.get('attrs')}")
