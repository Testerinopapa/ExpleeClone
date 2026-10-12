import json
import os
import re

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

elements = data['visual']['elements']

os.makedirs('src/data/gm', exist_ok=True)

# 1. Extract Regions
# Regions are in section.mb-24:nth-of-type(1)
regions = []
# Look for region cards
for el in elements:
    sel = el.get('selector', '')
    if 'section.mb-24:nth-of-type(1)' in sel and el.get('tag') == 'a':
        href = el.get('attrs', {}).get('href', '')
        # find child h3 and stats
        regions.append({
            'selector': sel,
            'href': href,
            'text': el.get('text', '')
        })

print(f"Found {len(regions)} region raw links")

# Let's inspect region cards more closely
region_cards = []
for el in elements:
    if 'section.mb-24:nth-of-type(1)' in el.get('selector', '') and el.get('tag') == 'h3':
        # parent a
        name = el.get('text', '').strip()
        region_cards.append(name)
print("Region names:", region_cards)

# 2. Extract Countries
country_links = []
for el in elements:
    sel = el.get('selector', '')
    if 'section.mb-24:nth-of-type(2)' in sel and el.get('tag') == 'a':
        href = el.get('attrs', {}).get('href', '')
        country_links.append({
            'selector': sel,
            'href': href,
            'text': el.get('text', '')
        })
print(f"Found {len(country_links)} country raw links")

# 3. Extract Data Categories and Fields
cat_sections = ['#general', '#geography', '#contact', '#reviews', '#visitor', '#media', '#hospitality', '#labels']
categories_data = {}
for cat_id in cat_sections:
    cat_els = [el for el in elements if cat_id in el.get('selector', '')]
    categories_data[cat_id] = len(cat_els)
print("Category elements counts:", categories_data)

# Let's write out sample raw texts to inspect
with open('scripts/extracted_raw_gm.json', 'w', encoding='utf-8') as out:
    json.dump({
        'regions': regions,
        'country_links_count': len(country_links),
        'sample_countries': country_links[:10]
    }, out, indent=2, ensure_ascii=False)

print("Saved raw inspection")
