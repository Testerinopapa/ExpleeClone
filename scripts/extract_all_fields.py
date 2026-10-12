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

categories_data = []

for cid, title, start_i, end_i in cat_headers:
    cat_els = [el for el in elements if start_i <= el['index'] < end_i]
    
    fields = []
    i = 0
    while i < len(cat_els):
        el = cat_els[i]
        # find container with py-3
        cls = el.get('attrs', {}).get('class', '')
        if 'flex items-start gap-3 py-3' in cls:
            # find percentage
            pct = ''
            name = ''
            desc = ''
            for j in range(i+1, min(i+15, len(cat_els))):
                sub = cat_els[j]
                s_cls = sub.get('attrs', {}).get('class', '')
                t = (sub.get('text') or '').strip()
                if not pct and '%' in t and len(t) <= 6:
                    pct = t
                elif not name and 'font-semibold text-foreground' in s_cls:
                    name = t
                elif not desc and 'text-muted-foreground' in s_cls and t.startswith('—'):
                    desc = t.lstrip('— ').strip()
                    break
            if name:
                fields.append({
                    'pct': pct,
                    'name': name,
                    'desc': desc
                })
        i += 1
        
    # Find code block in this category
    code_block = None
    code_lines = []
    in_code = False
    for el in cat_els:
        c = el.get('attrs', {}).get('class', '')
        # pre or font-mono or rounded-xl
        if el.get('tag') == 'pre' or 'font-mono' in c:
            # get all spans / text
            pass
        if 'font-mono' in c and el.get('tag') == 'div':
            pass
            
    categories_data.append({
        'id': cid,
        'name': title,
        'count': f"{len(fields)} fields",
        'fields': fields
    })

print(f"Extracted {len(categories_data)} categories:")
for c in categories_data:
    print(f"[{c['id']}] {c['name']} -> {len(c['fields'])} fields")

with open('src/data/gm/gm_categories_full.json', 'w', encoding='utf-8') as out:
    json.dump(categories_data, out, indent=2, ensure_ascii=False)
print("Saved gm_categories_full.json")
