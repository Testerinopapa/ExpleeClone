import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    master = json.load(f)

elements = master['visual']['elements']

# Let's inspect the groups and see how cluster blobs, badges, texts, and circles relate
groups = [el for el in elements if el.get('tag') == 'g']
print(f"Total groups: {len(groups)}")
for i, g in enumerate(groups[:5]):
    print(f"Group #{i}: attrs={g.get('attrs')} rect={g.get('rect')}")

# Let's check all texts
texts = [el for el in elements if el.get('tag') == 'text']
print(f"\nTotal texts: {len(texts)}")
for t in texts:
    txt = t.get('text')
    rect = t.get('rect')
    cls = t.get('attrs', {}).get('class')
    print(f"  [{cls}] '{txt}' at ({rect['x']}, {rect['y']})")
