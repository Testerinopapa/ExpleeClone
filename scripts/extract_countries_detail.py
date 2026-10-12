import json

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

elements = manifest['visual']['elements']

countries_els = [el for el in elements if 'section.mb-24:nth-of-type(2)' in el.get('selector', '')]

country_cards = []
for el in countries_els:
    if el.get('tag') == 'a':
        href = el.get('attrs', {}).get('href', '')
        cls = el.get('attrs', {}).get('class', '')
        country_cards.append({
            'href': href,
            'class': cls,
            'text': el.get('text', '')
        })

print(f"Total country cards in DOM snapshot: {len(country_cards)}")
for c in country_cards[:10]:
    print(c)

# Let's inspect the heading and button in section.mb-24:nth-of-type(2)
heading_els = [el for el in countries_els if el.get('tag') in ['h2', 'span', 'button']]
for el in heading_els:
    print(f"[{el.get('tag')}] {el.get('attrs', {}).get('class', '')} -> '{el.get('text')}'")
