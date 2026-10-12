import json

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    master = json.load(f)

elements = master.get('visual', {}).get('elements', [])
svg_elements = [el for el in elements if el.get('tag') in ['svg', 'path', 'circle', 'g', 'text', 'rect']]
print(f"Total SVG elements: {len(svg_elements)}")

# Inspect the main SVG container
main_svg = [el for el in elements if el.get('tag') == 'svg']
for s in main_svg:
    print("\n--- SVG TAG ---")
    print("attrs:", s.get('attrs'))
    print("rect:", s.get('rect'))

# Inspect sample paths
paths = [el for el in elements if el.get('tag') == 'path']
print(f"\nTotal paths: {len(paths)}")
for p in paths[:5]:
    print("Path attrs:", p.get('attrs'))
    print("Path style keys:", list(p.get('style', {}).keys())[:10] if isinstance(p.get('style'), dict) else p.get('style'))
    if isinstance(p.get('style'), dict):
        print("  fill:", p.get('style', {}).get('fill'), "stroke:", p.get('style', {}).get('stroke'), "opacity:", p.get('style', {}).get('opacity'))
    print("Path rect:", p.get('rect'))

# Inspect sample circles
circles = [el for el in elements if el.get('tag') == 'circle']
print(f"\nTotal circles: {len(circles)}")
for c in circles[:5]:
    print("Circle attrs:", c.get('attrs'))
    if isinstance(c.get('style'), dict):
        print("  fill:", c.get('style', {}).get('fill'), "stroke:", c.get('style', {}).get('stroke'), "opacity:", c.get('style', {}).get('opacity'))
    print("Circle rect:", c.get('rect'))

# Inspect groups and texts
groups = [el for el in elements if el.get('tag') == 'g']
texts = [el for el in elements if el.get('tag') == 'text']
rects = [el for el in elements if el.get('tag') == 'rect']
print(f"\nTotal groups: {len(groups)}, texts: {len(texts)}, rects: {len(rects)}")

for t in texts[:10]:
    print(f"Text: '{t.get('text')}' attrs: {t.get('attrs')} rect: {t.get('rect')}")
    if isinstance(t.get('style'), dict):
        print(f"  fill: {t.get('style', {}).get('fill')}, fontSize: {t.get('style', {}).get('fontSize')}")

for r in rects[:5]:
    print(f"Rect attrs: {r.get('attrs')} rect: {r.get('rect')}")
    if isinstance(r.get('style'), dict):
        print(f"  fill: {r.get('style', {}).get('fill')}, stroke: {r.get('style', {}).get('stroke')}")
