import sys
sys.stdout.reconfigure(encoding='utf-8')
from bs4 import BeautifulSoup

with open('b2bpage/b2b-database.html', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

body = soup.find('body')
child2 = body.find_all(recursive=False)[2]

print("Child 2 tag:", child2.name, child2.get('class'))

b2b_dark = child2.find('div', class_='b2b-dark')
scroll_content = b2b_dark.find('div', class_='landing-scroll-content')
children = [c for c in scroll_content.children if getattr(c, 'name', None)]
print(f"Total direct children inside landing-scroll-content: {len(children)}")

for i, sec in enumerate(children):
    cls = " ".join(sec.get('class', [])) if sec.get('class') else ""
    cid = sec.get('id', '')
    headings = [h.get_text(strip=True) for h in sec.find_all(['h1', 'h2', 'h3', 'h4'])]
    print(f"\n--- Section {i}: <{sec.name}> id='{cid}' class='{cls}' ---")
    if headings:
        print(f"Headings: {headings}")
    print(f"Snippet: {sec.get_text(strip=True)[:150]}")
