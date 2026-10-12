import glob

for p in glob.glob('b2bpage/**', recursive=True):
    if p.endswith('.png') or p.endswith('.webm'):
        continue
    try:
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
            if 'View all' in c:
                print(f"Found 'View all' in {p}")
    except:
        pass
