import urllib.request
from bs4 import BeautifulSoup
import json

req = urllib.request.Request('https://explee.com/', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')

soup = BeautifulSoup(html, 'html.parser')
scroll_content = soup.find('div', class_='landing-scroll-content')

sections = []
for i, child in enumerate(scroll_content.children):
    if getattr(child, 'name', None):
        sections.append((i, child))

print(f"Total sections: {len(sections)}")

# Dump each section HTML to a file in a debug folder
import os
os.makedirs('scripts/extracted_sections', exist_ok=True)

for idx, (i, sec) in enumerate(sections):
    fname = f'scripts/extracted_sections/sec_{idx}_{sec.name}.html'
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(str(sec.prettify()))
    print(f"Saved {fname} (length {len(str(sec))})")
