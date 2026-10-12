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

code_snippets = {}

for cid, start_i, end_i in cat_headers:
    cat_els = [el for el in elements if start_i <= el['index'] < end_i]
    lines = []
    for el in cat_els:
        t = (el.get('text') or '').strip()
        cls = el.get('attrs', {}).get('class', '')
        # check if it looks like code or line number or json
        if ('font-mono' in cls or 'text-blue' in cls or 'text-emerald' in cls or 'text-amber' in cls or 'text-zinc' in cls) and t:
            lines.append((el['index'], el['tag'], cls, t))
    code_snippets[cid] = lines
    print(f"[{cid}] found {len(lines)} code-related text spans")

with open('src/data/gm/gm_code_snippets.json', 'w', encoding='utf-8') as out:
    json.dump(code_snippets, out, indent=2, ensure_ascii=False)
print("Saved gm_code_snippets.json")
