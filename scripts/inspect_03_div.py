import sys
sys.stdout.reconfigure(encoding='utf-8')
from bs4 import BeautifulSoup

soup = BeautifulSoup(open('b2bpage/extracted_sections/03_div.html', encoding='utf-8'), 'html.parser')
outer = soup.find('div')
for i, child in enumerate(outer.children):
    if getattr(child, 'name', None):
        cls = ' '.join(child.get('class', []))
        cid = child.get('id', '')
        headings = [h.get_text(strip=True) for h in child.find_all(['h2', 'h3', 'h4'])]
        print(f"[{i}] <{child.name}> id='{cid}' class='{cls}'")
        print(f"    Headings: {headings}")
        print(f"    Snippet: {child.get_text(strip=True)[:100]}\n")
