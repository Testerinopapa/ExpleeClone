import json

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("METADATA:")
print(json.dumps(data.get('metadata'), indent=2)[:1000])

print("\nVISUAL KEYS:")
print(list(data.get('visual', {}).keys()))

print("\nINTERACTION KEYS:")
print(list(data.get('interaction', {}).keys()))

print("\nANIMATION KEYS:")
print(list(data.get('animation', {}).keys()))

for k in ['visual', 'interaction', 'animation']:
    sub = data.get(k, {})
    print(f"\n--- {k.upper()} SUBSECTIONS ---")
    for sk, sv in sub.items():
        if isinstance(sv, list):
            print(f"  {sk}: list of {len(sv)} items. First item type: {type(sv[0]).__name__ if sv else 'empty'}")
            if sv and isinstance(sv[0], dict):
                print(f"    sample keys: {list(sv[0].keys())[:10]}")
        elif isinstance(sv, dict):
            print(f"  {sk}: dict with keys {list(sv.keys())[:10]}")
        else:
            print(f"  {sk}: {type(sv).__name__} = {str(sv)[:100]}")
