import json

with open('explorerpage/cluster master.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("cluster master.json METADATA:")
print(json.dumps(data.get('metadata'), indent=2))
print("element count:", len(data.get('visual', {}).get('elements', [])))
