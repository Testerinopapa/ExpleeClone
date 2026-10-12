import json
import re

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    master = json.load(f)

svg_html = master['visual']['assets']['svgs'][2]['html']
path_matches = re.findall(r'<path\s+([^>]+)>', svg_html)
print(f"Total path matches: {len(path_matches)}")

# Extract colors of all 27 paths
colors = []
for p in path_matches:
    m = re.search(r'fill="(hsl\([^)]+\))"', p)
    if m:
        colors.append(m.group(1))

print(f"Extracted {len(colors)} path colors:")
for i, c in enumerate(colors[:10]):
    print(f"  Path #{i}: {c}")

# Also check texts in cluster-master.json:
elements = master['visual']['elements']
text_elements = [el for el in elements if el.get('tag') == 'text']
cluster_texts = [t for t in text_elements if t.get('text', '').startswith('Cluster ')]
print(f"Total cluster texts: {len(cluster_texts)}")
