import urllib.request
from bs4 import BeautifulSoup

req = urllib.request.Request('https://explee.com/', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')

soup = BeautifulSoup(html, 'html.parser')
landing = soup.find('div', class_='landing')

if landing:
    print("Direct children of .landing:")
    for i, child in enumerate(landing.children):
        if getattr(child, 'name', None):
            classes = " ".join(child.get('class', []))
            tag = child.name
            id_str = f" id='{child.get('id')}'" if child.get('id') else ""
            h_tags = [h.get_text(strip=True) for h in child.find_all(['h1', 'h2', 'h3'])]
            print(f"[{i}] <{tag}{id_str} class='{classes}'>")
            print(f"     Headings: {h_tags}")
            print(f"     Snippet: {child.get_text(strip=True)[:100]}")
