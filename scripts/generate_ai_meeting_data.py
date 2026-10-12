import json
import math
import random

random.seed(42)

def generate_organic_blob(cx, cy, rx, ry, points=12, irregularity=0.15):
    coords = []
    angle_step = (2 * math.pi) / points
    for i in range(points):
        angle = i * angle_step
        # vary radius slightly for organic feel
        offset = 1.0 + (math.sin(i * 2.3) * 0.1) + (math.cos(i * 1.7) * irregularity)
        x = cx + rx * offset * math.cos(angle)
        y = cy + ry * offset * math.sin(angle)
        coords.append((x, y))
    
    # Generate smooth SVG path through coords using cubic bezier
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

def generate_cluster_circles(cx, cy, rx, ry, count, color, min_r=2.5, max_r=9.0):
    circles = []
    for _ in range(count):
        # random point inside ellipse with gaussian distribution towards center
        angle = random.uniform(0, 2 * math.pi)
        dist = math.sqrt(random.uniform(0, 0.75))
        x = cx + (rx * 0.75) * dist * math.cos(angle)
        y = cy + (ry * 0.75) * dist * math.sin(angle)
        r = random.choice([2.5, 3.0, 3.5, 4.0, 5.0, 6.0, 7.5, 9.0])
        circles.append({
            'cx': round(x, 2),
            'cy': round(y, 2),
            'r': r,
            'fill': color
        })
    return circles

clusters_def = [
    {
        'id': 'cluster-0',
        'name': 'Cluster 0',
        'count': '2.6k',
        'color': '#84cc16',
        'fill': 'rgba(100, 160, 40, 0.22)',
        'stroke': 'rgba(132, 204, 22, 0.3)',
        'cx': 1630, 'cy': 430, 'rx': 210, 'ry': 210,
        'badgePos': {'x': 1600, 'y': 620},
        'dotsCount': 35,
        'labels': [
            {'text': 'real-time transcription', 'x': 1560, 'y': 525},
            {'text': 'ai transcription service', 'x': 1590, 'y': 360},
            {'text': 'ai notetaker', 'x': 1440, 'y': 365},
            {'text': 'meeting note generator', 'x': 1730, 'y': 480},
            {'text': 'real-time transcription', 'x': 1900, 'y': 365}
        ]
    },
    {
        'id': 'cluster-1',
        'name': 'Cluster 1',
        'count': '160',
        'color': '#3b82f6',
        'fill': 'rgba(50, 80, 180, 0.28)',
        'stroke': 'rgba(59, 130, 246, 0.3)',
        'cx': 970, 'cy': 455, 'rx': 80, 'ry': 65,
        'badgePos': {'x': 900, 'y': 480},
        'dotsCount': 12,
        'labels': [
            {'text': 'smart note-taking app', 'x': 975, 'y': 455},
            {'text': 'ai meeting notetaker', 'x': 870, 'y': 475}
        ]
    },
    {
        'id': 'cluster-2',
        'name': 'Cluster 2',
        'count': '1.1k',
        'color': '#22c55e',
        'fill': 'rgba(34, 197, 94, 0.22)',
        'stroke': 'rgba(34, 197, 94, 0.3)',
        'cx': 1160, 'cy': 250, 'rx': 110, 'ry': 95,
        'badgePos': {'x': 1100, 'y': 275},
        'dotsCount': 18,
        'labels': [
            {'text': 'automated note-taking platform', 'x': 1220, 'y': 210},
            {'text': 'meeting transcription tool', 'x': 1170, 'y': 238}
        ]
    },
    {
        'id': 'cluster-3',
        'name': 'Cluster 3',
        'count': '1.9k',
        'color': '#eab308',
        'fill': 'rgba(180, 120, 20, 0.22)',
        'stroke': 'rgba(234, 179, 8, 0.3)',
        'cx': 1400, 'cy': 760, 'rx': 180, 'ry': 170,
        'badgePos': {'x': 1320, 'y': 920},
        'dotsCount': 30,
        'labels': [
            {'text': 'ai transcription platform', 'x': 1400, 'y': 645},
            {'text': 'ai note taker', 'x': 1290, 'y': 795},
            {'text': 'note-taking ai', 'x': 1400, 'y': 840},
            {'text': 'meeting intelligence tool', 'x': 1450, 'y': 885},
            {'text': 'ai-powered note-taking platform', 'x': 1470, 'y': 780}
        ]
    },
    {
        'id': 'cluster-4',
        'name': 'Cluster 4',
        'count': '1.5k',
        'color': '#14b8a6',
        'fill': 'rgba(20, 150, 140, 0.22)',
        'stroke': 'rgba(20, 184, 166, 0.3)',
        'cx': 370, 'cy': 640, 'rx': 190, 'ry': 180,
        'badgePos': {'x': 290, 'y': 730},
        'dotsCount': 28,
        'labels': [
            {'text': 'ai transcription', 'x': 160, 'y': 585},
            {'text': 'ai meeting assistant', 'x': 320, 'y': 620},
            {'text': 'meeting summary tool', 'x': 420, 'y': 565},
            {'text': 'automated meeting summary', 'x': 540, 'y': 670},
            {'text': 'meeting summary software', 'x': 620, 'y': 630}
        ]
    },
    {
        'id': 'cluster-5',
        'name': 'Cluster 5',
        'count': '923',
        'color': '#10b981',
        'fill': 'rgba(16, 185, 129, 0.22)',
        'stroke': 'rgba(16, 185, 129, 0.3)',
        'cx': 1020, 'cy': 800, 'rx': 140, 'ry': 130,
        'badgePos': {'x': 950, 'y': 890},
        'dotsCount': 20,
        'labels': [
            {'text': 'speech-to-text software', 'x': 960, 'y': 740},
            {'text': 'meeting note-taking tool', 'x': 1080, 'y': 870},
            {'text': 'ai meeting companion', 'x': 1030, 'y': 700},
            {'text': 'audio transcription platform', 'x': 1050, 'y': 790}
        ]
    },
    {
        'id': 'cluster-6',
        'name': 'Cluster 6',
        'count': '1.2k',
        'color': '#0284c7',
        'fill': 'rgba(2, 132, 199, 0.22)',
        'stroke': 'rgba(2, 132, 199, 0.3)',
        'cx': 630, 'cy': 790, 'rx': 150, 'ry': 130,
        'badgePos': {'x': 580, 'y': 870},
        'dotsCount': 18,
        'labels': [
            {'text': 'ai scribe tool', 'x': 480, 'y': 835},
            {'text': 'meeting notes ai', 'x': 580, 'y': 825},
            {'text': 'automated transcription service', 'x': 680, 'y': 835},
            {'text': 'dictation software', 'x': 860, 'y': 840}
        ]
    },
    {
        'id': 'cluster-7',
        'name': 'Cluster 7',
        'count': '232',
        'color': '#84cc16',
        'fill': 'rgba(132, 204, 22, 0.2)',
        'stroke': 'rgba(132, 204, 22, 0.3)',
        'cx': 210, 'cy': 390, 'rx': 140, 'ry': 130,
        'badgePos': {'x': 160, 'y': 425},
        'dotsCount': 16,
        'labels': [
            {'text': 'meeting note taker', 'x': 130, 'y': 370},
            {'text': 'automated note-taking system', 'x': 255, 'y': 330}
        ]
    },
    {
        'id': 'cluster-8',
        'name': 'Cluster 8',
        'count': '1.4k',
        'color': '#ec4899',
        'fill': 'rgba(236, 72, 153, 0.22)',
        'stroke': 'rgba(236, 72, 153, 0.3)',
        'cx': 1220, 'cy': 350, 'rx': 130, 'ry': 110,
        'badgePos': {'x': 1170, 'y': 415},
        'dotsCount': 25,
        'labels': [
            {'text': 'automatic note-taking app', 'x': 1120, 'y': 350},
            {'text': 'meeting ai tool', 'x': 1120, 'y': 365},
            {'text': 'transcription software', 'x': 1280, 'y': 330},
            {'text': 'smart meeting assistant', 'x': 1380, 'y': 310},
            {'text': 'automated note generator', 'x': 1320, 'y': 390}
        ]
    },
    {
        'id': 'cluster-9',
        'name': 'Cluster 9',
        'count': '719',
        'color': '#a855f7',
        'fill': 'rgba(168, 85, 247, 0.25)',
        'stroke': 'rgba(168, 85, 247, 0.3)',
        'cx': 1180, 'cy': 440, 'rx': 90, 'ry': 60,
        'badgePos': {'x': 1130, 'y': 450},
        'dotsCount': 12,
        'labels': [
            {'text': 'ai session notetaker', 'x': 1180, 'y': 425},
            {'text': 'ai meeting recorder', 'x': 1260, 'y': 425}
        ]
    },
    {
        'id': 'cluster-10',
        'name': 'Cluster 10',
        'count': '3.3k',
        'color': '#9333ea',
        'fill': 'rgba(147, 51, 234, 0.25)',
        'stroke': 'rgba(147, 51, 234, 0.3)',
        'cx': 580, 'cy': 430, 'rx': 280, 'ry': 210,
        'badgePos': {'x': 530, 'y': 590},
        'dotsCount': 45,
        'labels': [
            {'text': 'ai transcription software', 'x': 370, 'y': 440},
            {'text': 'ai meeting summarizer', 'x': 750, 'y': 345},
            {'text': 'voice-to-text software', 'x': 740, 'y': 440},
            {'text': 'meeting notes tool', 'x': 600, 'y': 540}
        ]
    },
    {
        'id': 'cluster-11',
        'name': 'Cluster 11',
        'count': '8',
        'color': '#059669',
        'fill': 'rgba(5, 150, 105, 0.25)',
        'stroke': 'rgba(5, 150, 105, 0.3)',
        'cx': 900, 'cy': 330, 'rx': 80, 'ry': 75,
        'badgePos': {'x': 840, 'y': 355},
        'dotsCount': 10,
        'labels': [
            {'text': 'ai-powered meeting recording platform', 'x': 860, 'y': 310},
            {'text': 'smart meeting documentation', 'x': 970, 'y': 335}
        ]
    }
]

floating_labels = [
    {'text': 'automatic meeting minutes generator', 'x': 920, 'y': 190},
    {'text': 'ai meeting scribe', 'x': 970, 'y': 205},
    {'text': 'real-time meeting summary', 'x': 1130, 'y': 565},
    {'text': 'meeting note tool', 'x': 1170, 'y': 660}
]

output_clusters = []
all_circles = []
all_paths = []
all_labels = list(floating_labels)

for c in clusters_def:
    d = generate_organic_blob(c['cx'], c['cy'], c['rx'], c['ry'])
    path_obj = {
        'id': c['id'],
        'd': d,
        'fill': c['color'],
        'opacity': 0.18,
        'name': c['name']
    }
    all_paths.append(path_obj)
    
    circles = generate_cluster_circles(c['cx'], c['cy'], c['rx'], c['ry'], c['dotsCount'], c['color'])
    all_circles.extend(circles)
    
    output_clusters.append({
        'id': c['id'],
        'name': c['name'],
        'count': c['count'],
        'color': c['color'],
        'x': c['badgePos']['x'],
        'y': c['badgePos']['y'],
        'count_x': c['badgePos']['x'] + 85,
        'count_y': c['badgePos']['y']
    })
    
    for l in c['labels']:
        all_labels.append(l)

ai_meeting_data = {
    'query': 'AI meeting note writer',
    'viewBox': '0 0 1920 950',
    'paths': all_paths,
    'clusters': output_clusters,
    'labels': all_labels,
    'circles': all_circles
}

with open('src/data/explorer/ai_meeting_data.json', 'w', encoding='utf-8') as out:
    json.dump(ai_meeting_data, out, indent=2)

print("Saved src/data/explorer/ai_meeting_data.json successfully.")
