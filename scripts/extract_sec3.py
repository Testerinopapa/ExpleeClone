import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

elements = manifest['visual']['elements']

# Let's inspect the categories navigation list
nav_categories = []
for el in elements:
    sel = el.get('selector', '')
    if 'nav.lg\\:w-72' in sel and el.get('tag') == 'button':
        # get text
        pass

# Let's inspect the sections: #general, #geography, #contact, #reviews, #visitor, #media, #hospitality, #labels
cat_ids = ['general', 'geography', 'contact', 'reviews', 'visitor', 'media', 'hospitality', 'labels']

categories_data = []

for cid in cat_ids:
    sec_els = [el for el in elements if f'#{cid}' in el.get('selector', '')]
    print(f"Category #{cid}: {len(sec_els)} elements")

# Let's inspect all elements inside section.mb-16:nth-of-type(3)
sec3_els = [el for el in elements if 'section.mb-16:nth-of-type(3)' in el.get('selector', '')]
print(f"Total elements in section.mb-16:nth-of-type(3): {len(sec3_els)}")

# Let's dump all text and tags in section 3 to understand its internal DOM
with open('scripts/sec3_dump.txt', 'w', encoding='utf-8') as out:
    for el in sec3_els:
        out.write(f"[{el.get('index')}] [{el.get('tag')}] {el.get('attrs', {}).get('class', '')} -> {repr(el.get('text'))}\n")
        out.write(f"    sel: {el.get('selector')}\n")

print("Saved sec3_dump.txt")
