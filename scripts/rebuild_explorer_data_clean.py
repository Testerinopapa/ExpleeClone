import json
import math
import random
import re

random.seed(1337)

# ========================================================
# 1. REBUILD AI_MEETING_DATA.JSON (Screenshot 4019)
# ========================================================

def generate_organic_blob(cx, cy, rx, ry, points=12, irregularity=0.12):
    coords = []
    angle_step = (2 * math.pi) / points
    for i in range(points):
        angle = i * angle_step
        offset = 1.0 + (math.sin(i * 2.3) * 0.08) + (math.cos(i * 1.7) * irregularity)
        x = cx + rx * offset * math.cos(angle)
        y = cy + ry * offset * math.sin(angle)
        coords.append((x, y))
    
    n = len(coords)
    d = f"M {coords[0][0]:.2f},{coords[0][1]:.2f} "
    for i in range(n):
        p0 = coords[(i - 1) % n]
        p1 = coords[i]
        p2 = coords[(i + 1) % n]
        p3 = coords[(i + 2) % n]
        
        cp1x = p1[0] + (p2[0] - p0[0]) / 6.0
        cp1y = p1[1] + (p2[1] - p0[1]) / 6.0
        cp2x = p2[0] - (p3[0] - p1[0]) / 6.0
        cp2y = p2[1] - (p3[1] - p1[1]) / 6.0
        
        d += f"C {cp1x:.2f},{cp1y:.2f} {cp2x:.2f},{cp2y:.2f} {p2[0]:.2f},{p2[1]:.2f} "
    d += "Z"
    return d

def generate_cluster_circles(cluster_id, cx, cy, rx, ry, count, color, min_r=2.5, max_r=9.0):
    circles = []
    for _ in range(count):
        angle = random.uniform(0, 2 * math.pi)
        dist = math.sqrt(random.uniform(0.04, 0.72))
        x = cx + (rx * 0.78) * dist * math.cos(angle)
        y = cy + (ry * 0.78) * dist * math.sin(angle)
        r = random.choice([2.5, 3.0, 3.5, 4.0, 5.0, 6.0, 7.5, 9.0])
        circles.append({
            'clusterId': cluster_id,
            'cx': round(x, 2),
            'cy': round(y, 2),
            'r': r,
            'fill': color
        })
    return circles

# Clusters precisely positioned based on Screenshot (4019)
# In 1920x940 coordinate system:
clusters_ai = [
    {
        'id': 'cluster-7',
        'name': 'Cluster 7',
        'count': '232',
        'color': '#a3e635', # Yellow-lime
        'badgeBg': '#bef264',
        'badgeTextColor': '#000000',
        'cx': 190, 'cy': 390, 'rx': 130, 'ry': 130,
        'badgePos': {'x': 158, 'y': 445},
        'dotsCount': 16,
        'labels': [
            {'text': 'meeting note taker', 'x': 105, 'y': 372},
            {'text': 'automated note-taking system', 'x': 200, 'y': 328}
        ]
    },
    {
        'id': 'cluster-4',
        'name': 'Cluster 4',
        'count': '1.5k',
        'color': '#2dd4bf', # Cyan/Teal
        'badgeBg': '#5eead4',
        'badgeTextColor': '#000000',
        'cx': 360, 'cy': 640, 'rx': 180, 'ry': 175,
        'badgePos': {'x': 290, 'y': 730},
        'dotsCount': 28,
        'labels': [
            {'text': 'ai transcription', 'x': 80, 'y': 585},
            {'text': 'ai meeting assistant', 'x': 260, 'y': 620},
            {'text': 'meeting summary tool', 'x': 345, 'y': 565},
            {'text': 'automated meeting summary', 'x': 490, 'y': 670}
        ]
    },
    {
        'id': 'cluster-10',
        'name': 'Cluster 10',
        'count': '3.3k',
        'color': '#a855f7', # Violet/Purple
        'badgeBg': '#9333ea',
        'badgeTextColor': '#ffffff',
        'cx': 550, 'cy': 430, 'rx': 280, 'ry': 210,
        'badgePos': {'x': 530, 'y': 600},
        'dotsCount': 48,
        'labels': [
            {'text': 'ai transcription software', 'x': 330, 'y': 440},
            {'text': 'meeting notes tool', 'x': 560, 'y': 540},
            {'text': 'voice-to-text software', 'x': 710, 'y': 435},
            {'text': 'ai meeting summarizer', 'x': 715, 'y': 345},
            {'text': 'meeting summary software', 'x': 605, 'y': 630}
        ]
    },
    {
        'id': 'cluster-6',
        'name': 'Cluster 6',
        'count': '1.2k',
        'color': '#38bdf8', # Slate blue
        'badgeBg': '#0284c7',
        'badgeTextColor': '#ffffff',
        'cx': 630, 'cy': 800, 'rx': 150, 'ry': 120,
        'badgePos': {'x': 580, 'y': 870},
        'dotsCount': 18,
        'labels': [
            {'text': 'ai scribe tool', 'x': 480, 'y': 835},
            {'text': 'meeting notes ai', 'x': 560, 'y': 822},
            {'text': 'automated transcription service', 'x': 665, 'y': 835},
            {'text': 'dictation software', 'x': 800, 'y': 840}
        ]
    },
    {
        'id': 'cluster-11',
        'name': 'Cluster 11',
        'count': '8',
        'color': '#10b981', # Forest green
        'badgeBg': '#059669',
        'badgeTextColor': '#ffffff',
        'cx': 890, 'cy': 330, 'rx': 75, 'ry': 70,
        'badgePos': {'x': 835, 'y': 355},
        'dotsCount': 9,
        'labels': [
            {'text': 'ai-powered meeting recording platform', 'x': 800, 'y': 310},
            {'text': 'smart meeting documentation', 'x': 925, 'y': 335}
        ]
    },
    {
        'id': 'cluster-1',
        'name': 'Cluster 1',
        'count': '160',
        'color': '#60a5fa', # Royal blue
        'badgeBg': '#2563eb',
        'badgeTextColor': '#ffffff',
        'cx': 960, 'cy': 455, 'rx': 75, 'ry': 65,
        'badgePos': {'x': 875, 'y': 480},
        'dotsCount': 12,
        'labels': [
            {'text': 'ai meeting notetaker', 'x': 795, 'y': 475},
            {'text': 'smart note-taking app', 'x': 935, 'y': 455}
        ]
    },
    {
        'id': 'cluster-5',
        'name': 'Cluster 5',
        'count': '923',
        'color': '#34d399', # Emerald
        'badgeBg': '#10b981',
        'badgeTextColor': '#000000',
        'cx': 1020, 'cy': 800, 'rx': 140, 'ry': 130,
        'badgePos': {'x': 915, 'y': 885},
        'dotsCount': 22,
        'labels': [
            {'text': 'speech-to-text software', 'x': 930, 'y': 740},
            {'text': 'audio transcription platform', 'x': 1050, 'y': 788},
            {'text': 'meeting note-taking tool', 'x': 1070, 'y': 868},
            {'text': 'ai meeting companion', 'x': 970, 'y': 700}
        ]
    },
    {
        'id': 'cluster-2',
        'name': 'Cluster 2',
        'count': '1.1k',
        'color': '#4ade80', # Bright lime
        'badgeBg': '#22c55e',
        'badgeTextColor': '#000000',
        'cx': 1160, 'cy': 240, 'rx': 115, 'ry': 95,
        'badgePos': {'x': 1090, 'y': 275},
        'dotsCount': 18,
        'labels': [
            {'text': 'meeting transcription tool', 'x': 1180, 'y': 235},
            {'text': 'automated note-taking platform', 'x': 1220, 'y': 210}
        ]
    },
    {
        'id': 'cluster-8',
        'name': 'Cluster 8',
        'count': '1.4k',
        'color': '#f472b6', # Magenta/Hot pink
        'badgeBg': '#db2777',
        'badgeTextColor': '#ffffff',
        'cx': 1220, 'cy': 350, 'rx': 130, 'ry': 110,
        'badgePos': {'x': 1185, 'y': 415},
        'dotsCount': 24,
        'labels': [
            {'text': 'automatic note-taking app', 'x': 1115, 'y': 350},
            {'text': 'meeting ai tool', 'x': 1120, 'y': 365},
            {'text': 'transcription software', 'x': 1260, 'y': 330},
            {'text': 'smart meeting assistant', 'x': 1370, 'y': 310},
            {'text': 'automated note generator', 'x': 1310, 'y': 390}
        ]
    },
    {
        'id': 'cluster-9',
        'name': 'Cluster 9',
        'count': '719',
        'color': '#c084fc', # Purple
        'badgeBg': '#9333ea',
        'badgeTextColor': '#ffffff',
        'cx': 1190, 'cy': 445, 'rx': 90, 'ry': 60,
        'badgePos': {'x': 1130, 'y': 448},
        'dotsCount': 14,
        'labels': [
            {'text': 'ai session notetaker', 'x': 1175, 'y': 425},
            {'text': 'ai meeting recorder', 'x': 1255, 'y': 425}
        ]
    },
    {
        'id': 'cluster-3',
        'name': 'Cluster 3',
        'count': '1.9k',
        'color': '#fbbf24', # Amber/Orange
        'badgeBg': '#f59e0b',
        'badgeTextColor': '#000000',
        'cx': 1390, 'cy': 760, 'rx': 180, 'ry': 170,
        'badgePos': {'x': 1320, 'y': 920},
        'dotsCount': 30,
        'labels': [
            {'text': 'ai transcription platform', 'x': 1365, 'y': 642},
            {'text': 'ai note taker', 'x': 1285, 'y': 792},
            {'text': 'note-taking ai', 'x': 1390, 'y': 838},
            {'text': 'meeting intelligence tool', 'x': 1410, 'y': 885},
            {'text': 'ai-powered note-taking platform', 'x': 1450, 'y': 780}
        ]
    },
    {
        'id': 'cluster-0',
        'name': 'Cluster 0',
        'count': '2.6k',
        'color': '#a3e635', # Lime/Olive
        'badgeBg': '#84cc16',
        'badgeTextColor': '#000000',
        'cx': 1630, 'cy': 430, 'rx': 210, 'ry': 210,
        'badgePos': {'x': 1595, 'y': 622},
        'dotsCount': 36,
        'labels': [
            {'text': 'ai notetaker', 'x': 1430, 'y': 360},
            {'text': 'ai transcription service', 'x': 1585, 'y': 355},
            {'text': 'real-time transcription', 'x': 1520, 'y': 525},
            {'text': 'meeting note generator', 'x': 1720, 'y': 478},
            {'text': 'real-time transcription', 'x': 1885, 'y': 365}
        ]
    }
]

# Floating labels outside of clusters
floating_labels_ai = [
    {'text': 'automatic meeting minutes generator', 'x': 910, 'y': 185},
    {'text': 'ai meeting scribe', 'x': 960, 'y': 200},
    {'text': 'real-time meeting summary', 'x': 1125, 'y': 570},
    {'text': 'meeting note tool', 'x': 1165, 'y': 660}
]

paths_ai = []
circles_ai = []
clusters_output_ai = []
labels_output_ai = list(floating_labels_ai)

for cl in clusters_ai:
    # Build organic hull
    d = generate_organic_blob(cl['cx'], cl['cy'], cl['rx'], cl['ry'])
    paths_ai.append({
        'id': cl['id'],
        'clusterId': cl['id'],
        'name': cl['name'],
        'd': d,
        'fill': cl['color'],
        'stroke': cl['color'],
        'opacity': 0.17
    })
    
    # Build colored nodes inheriting cluster color
    dots = generate_cluster_circles(cl['id'], cl['cx'], cl['cy'], cl['rx'], cl['ry'], cl['dotsCount'], cl['color'])
    circles_ai.extend(dots)
    
    # Calculate pill position cleanly offset from label text
    label_text_width = len(cl['name']) * 8.2 + 8
    clusters_output_ai.append({
        'id': cl['id'],
        'name': cl['name'],
        'count': cl['count'],
        'color': cl['color'],
        'badgeBg': cl['badgeBg'],
        'badgeTextColor': cl['badgeTextColor'],
        'x': cl['badgePos']['x'],
        'y': cl['badgePos']['y'],
        'count_x': round(cl['badgePos']['x'] + label_text_width, 1),
        'count_y': cl['badgePos']['y']
    })
    
    # Add representative labels (with cluster association)
    for lbl in cl['labels']:
        labels_output_ai.append({
            'clusterId': cl['id'],
            'text': lbl['text'],
            'x': lbl['x'],
            'y': lbl['y']
        })

ai_meeting_data_clean = {
    'query': 'AI meeting note writer',
    'viewBox': '0 0 1920 950',
    'paths': paths_ai,
    'clusters': clusters_output_ai,
    'labels': labels_output_ai,
    'circles': circles_ai
}

with open('src/data/explorer/ai_meeting_data.json', 'w', encoding='utf-8') as f:
    json.dump(ai_meeting_data_clean, f, indent=2)

print(f"Saved ai_meeting_data.json: {len(paths_ai)} paths, {len(circles_ai)} circles, {len(labels_output_ai)} labels")

# ========================================================
# 2. REBUILD DAY_SPA_DATA.JSON WITH PROPER PER-CLUSTER COLORS
# ========================================================

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    master = json.load(f)

svg_html = master['visual']['assets']['svgs'][2]['html']
path_matches = re.findall(r'<path\s+([^>]+)>', svg_html)

# Extract 25-27 distinct HSL colors from path tags
day_spa_colors = []
for p in path_matches:
    m = re.search(r'fill="(hsl\([^)]+\))"', p)
    if m:
        day_spa_colors.append(m.group(1))

# Fallback palette for any remaining clusters
fallback_palette = [
    'hsl(92.5, 78%, 63%)', 'hsl(242.5, 78%, 63%)', 'hsl(275, 86%, 55%)',
    'hsl(145, 78%, 55%)', 'hsl(105, 70%, 55%)', 'hsl(52.5, 70%, 63%)',
    'hsl(60, 70%, 55%)', 'hsl(230, 86%, 55%)', 'hsl(177.5, 86%, 63%)',
    'hsl(282.5, 86%, 63%)', 'hsl(330, 80%, 60%)', 'hsl(20, 85%, 55%)',
    'hsl(190, 80%, 50%)', 'hsl(300, 75%, 60%)', 'hsl(45, 90%, 55%)',
    'hsl(160, 75%, 50%)', 'hsl(215, 80%, 60%)', 'hsl(15, 85%, 55%)',
    'hsl(260, 75%, 60%)', 'hsl(135, 70%, 50%)', 'hsl(80, 75%, 55%)',
    'hsl(315, 75%, 60%)', 'hsl(195, 75%, 55%)', 'hsl(35, 85%, 55%)',
    'hsl(250, 75%, 60%)', 'hsl(150, 75%, 50%)', 'hsl(290, 75%, 60%)'
]

while len(day_spa_colors) < 30:
    day_spa_colors.append(fallback_palette[len(day_spa_colors) % len(fallback_palette)])

# Read the previously extracted cluster headers and paths
with open('src/data/explorer/day_spa_data.json', 'r', encoding='utf-8') as f:
    old_spa = json.load(f)

# Reassign color to each cluster in day_spa
updated_clusters = []
for i, cl in enumerate(old_spa['clusters']):
    col = day_spa_colors[i % len(day_spa_colors)]
    # Extract hue from hsl(H, S, L) to determine badge text brightness
    h_m = re.search(r'hsl\(([\d.]+)', col)
    hue = float(h_m.group(1)) if h_m else 100
    is_dark = 210 <= hue <= 310
    
    label_w = len(cl['name']) * 8.2 + 8
    updated_clusters.append({
        'id': f"cluster-spa-{i}",
        'name': cl['name'],
        'count': cl.get('count', ''),
        'color': col,
        'badgeBg': col,
        'badgeTextColor': '#ffffff' if is_dark else '#000000',
        'x': cl['x'],
        'y': cl['y'],
        'count_x': round(cl['x'] + label_w, 1),
        'count_y': cl['y']
    })

# Assign paths their clusterId
updated_paths = []
for i, p in enumerate(old_spa['paths']):
    col = p.get('fill', day_spa_colors[i % len(day_spa_colors)])
    updated_paths.append({
        'id': f"cluster-spa-{i}",
        'clusterId': f"cluster-spa-{i}",
        'd': p['d'],
        'fill': col,
        'stroke': col,
        'opacity': 0.16
    })

# Reassign color to each circle in day_spa based on nearest cluster!
updated_circles = []
for c in old_spa['circles']:
    cx, cy = c['cx'], c['cy']
    nearest = min(updated_clusters, key=lambda cl: (cl['x'] - cx)**2 + (cl['y'] - cy)**2)
    updated_circles.append({
        'clusterId': nearest['id'],
        'cx': c['cx'],
        'cy': c['cy'],
        'r': c['r'],
        'fill': nearest['color']
    })

# Filter sub-labels to avoid excessive crowding (keep selective top 35 labels)
selective_labels = old_spa['labels'][:35]

day_spa_clean = {
    'query': 'day spa',
    'viewBox': '0 0 1191 696',
    'paths': updated_paths,
    'clusters': updated_clusters,
    'labels': selective_labels,
    'circles': updated_circles
}

with open('src/data/explorer/day_spa_data.json', 'w', encoding='utf-8') as f:
    json.dump(day_spa_clean, f, indent=2)

print(f"Saved day_spa_data.json: {len(updated_paths)} paths, {len(updated_circles)} circles, {len(selective_labels)} labels")
