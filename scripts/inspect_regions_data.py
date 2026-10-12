import json

with open('src/data/b2bRegions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for i, r in enumerate(data):
    print(f"{i+1}: title='{r.get('title')}', countries='{r.get('countries')}', companies='{r.get('companies')}'")
