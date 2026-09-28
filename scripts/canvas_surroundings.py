import json

with open('explee-visual-manifest.json', 'r', encoding='utf-8') as f:
    vis = json.load(f)

for idx, el in enumerate(vis['elements']):
    if el.get('tag') == 'canvas':
        print(f"Canvas at index {idx}:")
        for i in range(max(0, idx - 5), min(len(vis['elements']), idx + 5)):
            e = vis['elements'][i]
            print(f"  [{i}] <{e.get('tag')}> classes={e.get('classes')} geo={e.get('geometry')}")
