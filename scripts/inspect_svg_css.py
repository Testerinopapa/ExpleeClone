import json
import re

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    master = json.load(f)

# Inspect interactionCssRules or mediaRules or CSS in master
css_rules = master.get('interaction', {}).get('interactionCssRules', [])
print(f"Total interaction CSS rules: {len(css_rules)}")

# Search for SVG, cluster, path, circle rules
interesting_rules = []
for r in css_rules:
    sel = r.get('selector', '')
    txt = r.get('cssText', '')
    if any(k in sel.lower() or k in txt.lower() for k in ['svg', 'path', 'circle', 'cluster', 'badge', 'blob', 'tooltip']):
        interesting_rules.append(r)

print(f"Found {len(interesting_rules)} interesting CSS rules:")
for r in interesting_rules[:20]:
    print(f"  {r['selector']} => {r['cssText'][:120]}")

# Also let's inspect the first 30 elements in master and their exact parent-child hierarchy in the SVG!
elements = master['visual']['elements']
svg_idx = None
for el in elements:
    if el.get('tag') == 'svg' and 'w-full h-full' in el.get('attrs', {}).get('class', ''):
        svg_idx = el.get('index')
        print(f"\nMain SVG found at index {svg_idx}: rect={el.get('rect')}")
        break

if svg_idx is not None:
    svg_children = [el for el in elements if el.get('index') > svg_idx]
    print(f"Elements after main SVG: {len(svg_children)}")
    # print types of children
    from collections import Counter
    print("Tag counts inside SVG:", Counter(el.get('tag') for el in svg_children))
