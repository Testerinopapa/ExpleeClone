import json
import re

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    master = json.load(f)

# Extract SVG paths from raw HTML
svg_html = master['visual']['assets']['svgs'][2]['html']
path_matches = re.findall(r'<path\s+([^>]+)>', svg_html)
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

cluster_headers = []
sub_labels = []

# Collect all text elements
text_elements = [el for el in elements if el.get('tag') == 'text']
for idx, el in enumerate(text_elements):
    txt = el.get('text', '')
    cls = el.get('attrs', {}).get('class', '')
    rect = el.get('rect', {})
    if 'capitalize' in cls and txt.startswith('Cluster '):
        # find the next text element which is the count!
        count_txt = ''
        count_x = 0
        count_y = 0
        if idx + 1 < len(text_elements):
            next_txt = text_elements[idx+1].get('text', '')
            if not next_txt.startswith('Cluster ') and not next_txt.startswith('spa') and len(next_txt) < 10:
                count_txt = next_txt
                count_rect = text_elements[idx+1].get('rect', {})
                count_x = count_rect.get('x', 0)
                count_y = count_rect.get('y', 0)
        
        # Determine color from matching path if possible, or HSL
        # Notice path fills: hsl(92.5, 78%, 63%), hsl(242.5, 78%, 63%), etc.
        cluster_headers.append({
            'name': txt,
            'count': count_txt,
            'x': rect.get('x'),
            'y': rect.get('y'),
            'count_x': count_x,
            'count_y': count_y
        })
    elif 'pointer-events-none' in cls:
        sub_labels.append({
            'text': txt,
            'x': rect.get('x'),
            'y': rect.get('y')
        })

print(f"Extracted {len(cluster_headers)} cluster headers:")
for ch in cluster_headers[:5]:
    print(" ", ch)

circles_data = []
for el in elements:
    if el.get('tag') == 'circle':
        rect = el.get('rect', {})
        w = rect.get('width', 4)
        x = rect.get('x', 0)
        y = rect.get('y', 0)
        r = w / 2.0
        circles_data.append({
            'cx': round(x + r, 2),
            'cy': round(y + r, 2),
            'r': round(r, 2)
        })

# Assign cluster color to each circle based on nearest cluster or matching region
for c in circles_data:
    # default color or nearest cluster
    cx, cy = c['cx'], c['cy']
    nearest = min(cluster_headers, key=lambda cl: (cl['x'] - cx)**2 + (cl['y'] - cy)**2)
    # Give it a color
    c['cluster'] = nearest['name']

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

print("Updated src/data/explorer/day_spa_data.json successfully.")
