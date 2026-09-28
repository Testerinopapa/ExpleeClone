with open('scripts/extracted_css/style_4_0xpg0vysobalm.css', 'r', encoding='utf-8') as f:
    txt = f.read()

import re
selectors = re.findall(r'([^{}]+)\{', txt)
clean_sel = set()
for s in selectors:
    s = s.strip()
    if not s.startswith('@'):
        clean_sel.add(s)

print(f"Total selectors: {len(clean_sel)}")
for s in sorted(clean_sel)[:50]:
    print("  ", s)
