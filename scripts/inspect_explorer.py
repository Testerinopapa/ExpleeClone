import json
import os

for fname in ['cluster master.json', 'cluster-master.json']:
    path = os.path.join('explorerpage', fname)
    if os.path.exists(path):
        print(f"=== {fname} ===")
        with open(path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                if isinstance(data, dict):
                    print("Dict with keys:", list(data.keys())[:20])
                    for k in list(data.keys())[:5]:
                        v = data[k]
                        if isinstance(v, (list, dict)):
                            print(f"  {k}: type={type(v).__name__}, len={len(v)}")
                        else:
                            print(f"  {k}: {v}")
                elif isinstance(data, list):
                    print(f"List with length {len(data)}")
                    if len(data) > 0:
                        sample = data[0]
                        if isinstance(sample, dict):
                            print("Sample keys:", list(sample.keys())[:20])
                        print("Sample item:", str(sample)[:300])
            except Exception as e:
                print(f"Error parsing {fname}: {e}")
