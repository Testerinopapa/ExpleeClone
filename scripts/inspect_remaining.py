import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

elements = manifest['visual']['elements']

# Let's inspect elements from 1380 to the end
print("=== REMAINING SECTIONS ===")
for i in range(1380, len(elements)):
    el = elements[i]
    t = el.get('text')
    cls = el.get('attrs', {}).get('class', '')
    tag = el.get('tag')
    sel = el.get('selector')
    if t or tag in ['button', 'input', 'img', 'svg', 'a', 'h2', 'h3', 'section', 'footer']:
        print(f"[{el['index']}] <{tag}> class='{cls[:50]}' text={repr(t)[:50]}")
        print(f"    sel: {sel[:80]}")
