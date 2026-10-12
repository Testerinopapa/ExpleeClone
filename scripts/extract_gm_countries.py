import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

elements = manifest['visual']['elements']

countries_els = [el for el in elements if 'section.mb-24:nth-of-type(2)' in el.get('selector', '')]

countries = []
i = 0
while i < len(countries_els):
    el = countries_els[i]
    if el.get('tag') == 'a':
        href = el.get('attrs', {}).get('href', '')
        # find the span (code/emoji), h3 (name), p (count)
        flag_span = countries_els[i+1]
        name_h3 = countries_els[i+3]
        count_p = countries_els[i+4]
        
        # let's derive code from href or flag
        # href: /gm-dataset/locations/china
        slug = href.split('/')[-1]
        
        countries.append({
            'name': name_h3.get('text', ''),
            'count': count_p.get('text', ''),
            'raw_flag': flag_span.get('text', ''),
            'href': href,
            'slug': slug
        })
        i += 5
    else:
        i += 1

print(f"Extracted {len(countries)} countries:")
for c in countries:
    print(c)

with open('src/data/gm/gm_21_countries.json', 'w', encoding='utf-8') as out:
    json.dump(countries, out, indent=2, ensure_ascii=False)
