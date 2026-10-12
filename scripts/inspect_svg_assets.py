import json

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    master = json.load(f)

svgs = master.get('visual', {}).get('assets', {}).get('svgs', [])
print(f"Total svgs in assets: {len(svgs)}")
for i, s in enumerate(svgs):
    print(f"\n--- SVG #{i} ---")
    if isinstance(s, dict):
        print("keys:", list(s.keys()))
        for k in ['selector', 'id', 'class', 'width', 'height', 'viewBox']:
            if k in s:
                print(f"  {k}: {s[k]}")
        content = s.get('content') or s.get('outerHTML') or s.get('svg') or s.get('html')
        if content:
            print(f"  content preview (len={len(content)}): {content[:300]}")
        else:
            print("  dict keys:", {k: str(v)[:100] for k, v in s.items()})
    else:
        print("String preview:", str(s)[:300])
