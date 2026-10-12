import json

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

elements = manifest['visual']['elements']

regions_els = [el for el in elements if 'section.mb-24:nth-of-type(1)' in el.get('selector', '')]

# Look at headings and cards
cards = []
curr_card = None
for el in regions_els:
    tag = el.get('tag', '')
    sel = el.get('selector', '')
    text = (el.get('text') or '').strip().replace('\n', ' ')
    if tag == 'a':
        curr_card = {
            'href': el.get('attrs', {}).get('href', ''),
            'classes': el.get('attrs', {}).get('class', ''),
            'rect': el.get('rect', {}),
            'children': []
        }
        cards.append(curr_card)
    elif curr_card:
        curr_card['children'].append({
            'tag': tag,
            'selector': sel,
            'text': text,
            'attrs': el.get('attrs', {}),
            'style': {k: el.get('style', {}).get(k) for k in ['backgroundImage', 'backgroundColor', 'color', 'fontSize', 'fontWeight', 'display']}
        })

print(f"Parsed {len(cards)} region cards")
for i, c in enumerate(cards):
    print(f"\n--- CARD {i+1}: {c['href']} ---")
    texts = [child['text'] for child in c['children'] if child['text']]
    svgs = [child for child in c['children'] if child['tag'] == 'svg']
    imgs = [child for child in c['children'] if child['tag'] == 'img']
    bg_imgs = [child['style']['backgroundImage'] for child in c['children'] if child['style'].get('backgroundImage') and child['style']['backgroundImage'] != 'none']
    print("Texts:", texts)
    print("SVGs count:", len(svgs))
    print("Background Images:", bg_imgs)

# Save card details
with open('src/data/gm/regions_extracted.json', 'w', encoding='utf-8') as out:
    json.dump(cards, out, indent=2, ensure_ascii=False)
