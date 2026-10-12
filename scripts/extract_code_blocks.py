import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

elements = manifest['visual']['elements']

cat_headers = [
    ('general', 610, 773),
    ('geography', 773, 859),
    ('contact', 859, 915),
    ('reviews', 915, 1024),
    ('visitor', 1024, 1110),
    ('media', 1110, 1151),
    ('hospitality', 1151, 1192),
    ('labels', 1192, 1382)
]

all_snippets = {}

for cid, start_i, end_i in cat_headers:
    cat_els = [el for el in elements if start_i <= el['index'] < end_i]
    # find container with bg-slate-900
    code_container = None
    for el in cat_els:
        if 'bg-slate-900' in el.get('attrs', {}).get('class', ''):
            code_container = el
            break
            
    if code_container:
        # find lines
        lines = []
        c_idx = code_container['index']
        # iterate children
        for el in cat_els:
            if el['index'] > c_idx:
                cls = el.get('attrs', {}).get('class', '')
                t = el.get('text')
                if t:
                    lines.append({
                        'idx': el['index'],
                        'tag': el['tag'],
                        'class': cls,
                        'text': t
                    })
        all_snippets[cid] = lines

print(f"Captured code blocks for {len(all_snippets)} categories")
with open('src/data/gm/all_code_blocks.json', 'w', encoding='utf-8') as out:
    json.dump(all_snippets, out, indent=2, ensure_ascii=False)
