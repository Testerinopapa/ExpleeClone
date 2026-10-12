import json

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

elements = manifest['visual']['elements']

countries_els = [el for el in elements if 'section.mb-24:nth-of-type(2)' in el.get('selector', '')]

# Look for button or view all text
for el in countries_els:
    t = (el.get('text') or '').strip()
    tag = el.get('tag', '')
    if 'view' in t.lower() or '244' in t.lower() or tag == 'button':
        print(f"[{tag}] {el.get('attrs', {}).get('class', '')} -> {t}")

# Check 21 countries rendered
countries = []
for i in range(1, 22):
    card_prefix = f"section.mb-24:nth-of-type(2) > div.relative > div.grid > a:nth-of-type({i})"
    # or find a
    pass

# Find all a tags
country_list = []
for el in countries_els:
    if el.get('tag') == 'a':
        href = el.get('attrs', {}).get('href', '')
        # find children of this a
        prefix = el.get('selector', '')
        children = [c for c in countries_els if c.get('selector', '').startswith(prefix) and c != el]
        texts = [c.get('text', '').strip() for c in children if c.get('text')]
        country_list.append({
            'href': href,
            'texts': texts,
            'selector': prefix
        })

print(f"Total countries extracted: {len(country_list)}")
with open('src/data/gm/countries_extracted_sample.json', 'w', encoding='utf-8') as out:
    json.dump(country_list, out, indent=2, ensure_ascii=False)

for c in country_list[:5]:
    print(c['href'], c['texts'])
