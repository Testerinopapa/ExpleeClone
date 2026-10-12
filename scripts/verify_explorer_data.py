import json

for fname in ['day_spa_data.json', 'ai_meeting_data.json']:
    path = f'src/data/explorer/{fname}'
    with open(path, 'r', encoding='utf-8') as f:
        d = json.load(f)
    print(f"=== {fname} ===")
    print("Query:", d.get('query'))
    print("ViewBox:", d.get('viewBox'))
    print(f"Paths count: {len(d.get('paths', []))}")
    print(f"Clusters count: {len(d.get('clusters', []))}")
    print(f"Circles count: {len(d.get('circles', []))}")
    print(f"Labels count: {len(d.get('labels', []))}")
    if d.get('clusters'):
        print("First 3 clusters:", d['clusters'][:3])
