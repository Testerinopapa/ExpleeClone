import re
from bs4 import BeautifulSoup

for fname in ['explorer_landing.html', 'explorer_ai_meeting.html']:
    path = f'explorerpage/live_dump/{fname}'
    print(f"\n==================== {fname} ====================")
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    print("HTML length:", len(html))
    
    # Check for script tags
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
    print(f"Total script tags: {len(scripts)}")
    
    # Check for keywords
    for kw in ['cluster', 'Cluster', 'AI meeting note writer', 'day spa', 'Segment', 'd3', 'svg', 'canvas']:
        count = html.count(kw)
        print(f"  Count of '{kw}': {count}")
    
    # Check SVG tags
    svgs = re.findall(r'<svg[^>]*>.*?</svg>', html, re.DOTALL)
    print(f"Total SVG tags: {len(svgs)}")
    for i, s in enumerate(svgs):
        print(f"  SVG #{i} len={len(s)}, attrs={s[:100]}")

    # Check JS chunk script tags
    js_chunks = re.findall(r'src="([^"]+\.js[^"]*)"', html)
    print(f"JS chunks referenced ({len(js_chunks)}):")
    for j in js_chunks[:10]:
        print(f"  {j}")
