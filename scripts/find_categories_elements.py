import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

elements = manifest['visual']['elements']

start_idx = None
end_idx = None

for el in elements:
    txt = el.get('text') or ''
    if "What's Inside Our Database" in txt:
        start_idx = el['index']
    if "Need custom place attributes?" in txt:
        end_idx = el['index']

print(f"Data categories section: from index {start_idx} to {end_idx}")

section_elements = [el for el in elements if start_idx <= el['index'] < end_idx]
print(f"Total elements in section: {len(section_elements)}")

# Let's inspect the categories in the nav
nav_items = []
for el in section_elements:
    if 'nav' in el.get('selector', '') and el.get('tag') == 'button':
        # Find spans inside or text
        pass

# Let's inspect all headings inside section_elements
for el in section_elements:
    if el.get('tag') in ['h2', 'h3', 'button']:
        print(f"[{el['tag']}] idx:{el['index']} {el.get('attrs', {}).get('class', '')[:40]} -> {repr(el.get('text'))[:60]}")

# Let's inspect the cards/sections inside section_elements
with open('scripts/categories_elements.json', 'w', encoding='utf-8') as out:
    json.dump([{
        'index': el['index'],
        'tag': el['tag'],
        'selector': el['selector'],
        'class': el.get('attrs', {}).get('class', ''),
        'text': el.get('text'),
        'rect': el.get('rect')
    } for el in section_elements], out, indent=2, ensure_ascii=False)

print("Saved categories_elements.json")
