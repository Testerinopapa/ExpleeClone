import json
import os
import re

os.makedirs('src/data/explorer', exist_ok=True)

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    master = json.load(f)

# Extract SVG paths from raw HTML if available or elements
svg_html = master['visual']['assets']['svgs'][2]['html']

# Parse all <path ...> tags from svg_html
path_matches = re.findall(r'<path\s+([^>]+)>', svg_html)
print(f"Paths in raw SVG HTML: {len(path_matches)}")
paths_data = []
for p in path_matches:
    d_m = re.search(r'd="([^"]+)"', p)
    fill_m = re.search(r'fill="([^"]+)"', p)
    opacity_m = re.search(r'fill-opacity="([^"]+)"', p)
    paths_data.append({
        'd': d_m.group(1) if d_m else '',
        'fill': fill_m.group(1) if fill_m else '#ffffff',
        'opacity': float(opacity_m.group(1)) if opacity_m else 0.15
    })

elements = master['visual']['elements']

# Extract texts (cluster names and counts and sub-labels)
cluster_headers = []
sub_labels = []

# Find text pairs: Cluster X followed by count
i = 0
while i < len(elements):
    el = elements[i]
    if el.get('tag') == 'text':
        txt = el.get('text', '')
        cls = el.get('attrs', {}).get('class', '')
        rect = el.get('rect', {})
        if 'capitalize' in cls and txt.startswith('Cluster '):
            # next element might be the count
            count_txt = ''
            if i + 1 < len(elements) and elements[i+1].get('tag') == 'text':
                count_txt = elements[i+1].get('text', '')
                count_rect = elements[i+1].get('rect', {})
            cluster_headers.append({
                'name': txt,
                'count': count_txt,
                'x': rect.get('x'),
                'y': rect.get('y'),
                'count_x': count_rect.get('x') if count_txt else 0,
                'count_y': count_rect.get('y') if count_txt else 0
            })
            i += 2
            continue
        elif 'pointer-events-none' in cls:
            sub_labels.append({
                'text': txt,
                'x': rect.get('x'),
                'y': rect.get('y')
            })
    i += 1

print(f"Extracted {len(cluster_headers)} cluster headers")
print(f"Extracted {len(sub_labels)} sub-labels")

# Extract circles
circles_data = []
for el in elements:
    if el.get('tag') == 'circle':
        rect = el.get('rect', {})
        w = rect.get('width', 4)
        x = rect.get('x', 0)
        y = rect.get('y', 0)
        r = w / 2.0
        cx = x + r
        cy = y + r
        circles_data.append({
            'cx': round(cx, 2),
            'cy': round(cy, 2),
            'r': round(r, 2)
        })

print(f"Extracted {len(circles_data)} circles")

day_spa_data = {
    'query': 'day spa',
    'viewBox': '0 0 1191 696',
    'paths': paths_data,
    'clusters': cluster_headers,
    'labels': sub_labels,
    'circles': circles_data
}

with open('src/data/explorer/day_spa_data.json', 'w', encoding='utf-8') as out:
    json.dump(day_spa_data, out, indent=2)

print("Saved src/data/explorer/day_spa_data.json successfully.")
