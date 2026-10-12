import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/gm/all_code_blocks.json', 'r', encoding='utf-8') as f:
    all_blocks = json.load(f)

# Let's inspect raw spans for 'general' to see how lines are formed
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

structured_code = {}

for cid, start_i, end_i in cat_headers:
    cat_els = [el for el in elements if start_i <= el['index'] < end_i]
    # find lines: div.flex
    lines = []
    # check line "// ..." at start
    lines.append({'type': 'comment', 'text': '// ...'})
    
    for el in cat_els:
        cls = el.get('attrs', {}).get('class', '')
        sel = el.get('selector', '')
        # check if it is a line container (div.flex) inside code
        if el.get('tag') == 'div' and ('flex' in cls or 'bg-blue' in cls) and 'space-y-1' not in cls and 'items-start' not in cls and 'items-center justify-between' not in cls:
            # check if it has line number child
            # find children
            l_idx = el['index']
            # children are next 4-6 elements
            line_num = None
            key = None
            val = None
            is_highlighted = 'bg-blue' in cls
            
            for j in range(l_idx + 1, min(l_idx + 8, len(elements))):
                sub = elements[j]
                if sub['index'] >= end_i: break
                s_cls = sub.get('attrs', {}).get('class', '')
                t = sub.get('text')
                if not t: continue
                if 'select-none' in s_cls:
                    line_num = t.strip()
                elif 'text-emerald-400' in s_cls:
                    key = t.strip().strip('"').strip()
                elif 'text-amber-300' in s_cls or 'text-blue-300' in s_cls:
                    val = t.strip()
            
            if line_num and key:
                lines.append({
                    'type': 'code',
                    'lineNum': line_num,
                    'key': key,
                    'val': val or '""',
                    'highlight': is_highlighted
                })
                
    lines.append({'type': 'comment', 'text': '// ...'})
    structured_code[cid] = lines
    print(f"[{cid}] structured {len(lines)} lines")

with open('src/data/gm/gm_code_preview_structured.json', 'w', encoding='utf-8') as out:
    json.dump(structured_code, out, indent=2, ensure_ascii=False)
print("Saved gm_code_preview_structured.json")
