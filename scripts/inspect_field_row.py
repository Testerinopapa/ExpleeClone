import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

elements = manifest['visual']['elements']

# Let's inspect elements around index 610 to 650 (General Information)
for i in range(610, 660):
    el = elements[i]
    t = el.get('text')
    print(f"[{el['index']}] <{el['tag']}> class='{el.get('attrs', {}).get('class', '')[:40]}' text={repr(t)[:50]}")
