import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

elements = manifest['visual']['elements']

cat_headers = [
    ('general', 'General Information', 610, 773),
    ('geography', 'Location Data', 773, 859),
    ('contact', 'Contact Information', 859, 915),
    ('reviews', 'Reviews & Ratings', 915, 1024),
    ('visitor', 'Visitor Information', 1024, 1110),
    ('media', 'Media Content', 1110, 1151),
    ('hospitality', 'Hospitality Features', 1151, 1192),
    ('labels', 'Place Labels & Attributes', 1192, 1382)
]

categories_result = []

for cid, title, start_i, end_i in cat_headers:
    cat_els = [el for el in elements if start_i <= el['index'] < end_i]
    
    # Extract fields
    # Each field typically has:
    # 1. Fill percentage badge (e.g. "100%", "29.7%")
    # 2. Field Name
    # 3. Description
    # Also in each category, there is a code preview panel on the right!
    
    # Let's inspect all text elements in cat_els
    fields = []
    # Let's find spans with %
    for i, el in enumerate(cat_els):
        txt = (el.get('text') or '').strip()
        if '%' in txt and len(txt) <= 6:
            # this is a percentage badge!
            pct = txt
            # next elements will be field name and description
            # let's look at subsequent elements in cat_els
            name = None
            desc = None
            for j in range(i+1, min(i+10, len(cat_els))):
                sub_txt = (cat_els[j].get('text') or '').strip()
                if sub_txt and not name and '%' not in sub_txt and 'fields' not in sub_txt and sub_txt != title:
                    # check tag
                    name = sub_txt
                elif sub_txt and name and not desc:
                    desc = sub_txt
                    break
            fields.append({
                'pct': pct,
                'name': name,
                'desc': desc
            })
            
    # Extract code preview lines
    code_lines = []
    for el in cat_els:
        # Pre or code or lines
        sel = el.get('selector', '')
        if 'code' in sel.lower() or 'pre' in sel.lower() or 'font-mono' in el.get('attrs', {}).get('class', ''):
            t = el.get('text')
            if t:
                code_lines.append(t)
                
    categories_result.append({
        'id': cid,
        'title': title,
        'fieldsCount': len(fields),
        'fields': fields,
        'codeLinesSample': code_lines[:10]
    })

print(f"Parsed {len(categories_result)} categories:")
for cat in categories_result:
    print(f"\n[{cat['title']}] - {len(cat['fields'])} fields:")
    for f in cat['fields']:
        print(f"  {f['pct']} | {f['name']} | {f['desc']}")

with open('src/data/gm/gm_categories.json', 'w', encoding='utf-8') as out:
    json.dump(categories_result, out, indent=2, ensure_ascii=False)
