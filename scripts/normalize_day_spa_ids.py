import json

with open('src/data/explorer/day_spa_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

# Normalize clusters
for cl in d['clusters']:
    cl['id'] = cl['name']  # e.g. 'Cluster 16'

# Map paths to clusters based on closest center
for p in d['paths']:
    # extract first coordinate in d
    import re
    m = re.search(r'M\s+([\d.]+),([\d.]+)', p['d'])
    if m:
        px, py = float(m.group(1)), float(m.group(2))
        nearest_cl = min(d['clusters'], key=lambda cl: (cl['x'] - px)**2 + (cl['y'] - py)**2)
        p['clusterId'] = nearest_cl['name']
        p['name'] = nearest_cl['name']
        p['fill'] = nearest_cl['color']
        p['stroke'] = nearest_cl['color']

# Map circles to clusters based on closest center
for c in d['circles']:
    cx, cy = c['cx'], c['cy']
    nearest_cl = min(d['clusters'], key=lambda cl: (cl['x'] - cx)**2 + (cl['y'] - cy)**2)
    c['clusterId'] = nearest_cl['name']
    c['fill'] = nearest_cl['color']

# Map labels to clusters based on closest center
for lbl in d['labels']:
    lx, ly = lbl['x'], lbl['y']
    nearest_cl = min(d['clusters'], key=lambda cl: (cl['x'] - lx)**2 + (cl['y'] - ly)**2)
    lbl['clusterId'] = nearest_cl['name']

with open('src/data/explorer/day_spa_data.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

print("Normalized day_spa_data.json successfully.")
