import sys
import io
sys.stdout.reconfigure(encoding='utf-8')
from bs4 import BeautifulSoup

with open('b2bpage/b2b-database.html', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

body = soup.find('body')
print('Body class:', body.get('class') if body else 'No body')

# Look for main or wrapper divs
root_div = soup.find('div', id='__next') or soup.find('div', class_='landing') or body
print('Root:', root_div.name, root_div.get('id'), root_div.get('class'))

# Print all direct sections or child divs
for i, child in enumerate(root_div.children):
    if getattr(child, 'name', None):
        cls = " ".join(child.get('class', [])) if child.get('class') else ""
        cid = child.get('id', '')
        headings = [h.get_text(strip=True) for h in child.find_all(['h1', 'h2', 'h3'])]
        print(f"Child {i}: <{child.name}> id='{cid}' class='{cls}'")
        if headings:
            print(f"   Headings: {headings}")
        text_preview = child.get_text(strip=True)[:100]
        if text_preview:
            print(f"   Snippet: {text_preview}")
