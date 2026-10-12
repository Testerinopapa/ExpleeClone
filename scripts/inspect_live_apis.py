import json

with open('explorerpage/live_dump/api_responses.json', 'r', encoding='utf-8') as f:
    apis = json.load(f)

print(f"Total API URLs: {len(apis)}")
for url, val in apis.items():
    print('==============================')
    print('URL:', url)
    if isinstance(val, dict):
        print('Keys:', list(val.keys()))
        for k in list(val.keys())[:10]:
            v = val[k]
            length = len(v) if hasattr(v, '__len__') else 'N/A'
            print(f"  {k} ({type(v).__name__}, len={length}): {str(v)[:200]}")
    elif isinstance(val, list):
        print(f"List with length {len(val)}")
        if val:
            print("First item:", str(val[0])[:300])
    else:
        print("Val:", str(val)[:300])
