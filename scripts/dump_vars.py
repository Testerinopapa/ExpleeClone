import glob
import re

for f in sorted(glob.glob('scripts/extracted_css/*.css')):
    with open(f, 'r', encoding='utf-8') as fl:
        txt = fl.read()
    print(f"\n===== {f} =====")
    for sel in [':root', '.theme-light', '.landing-light']:
        pattern = re.escape(sel) + r'\s*\{([^}]+)\}'
        for m in re.finditer(pattern, txt):
            print(f"[{sel}] {m.group(1)[:200]}...")
