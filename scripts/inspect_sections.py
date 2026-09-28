import urllib.request
from bs4 import BeautifulSoup

req = urllib.request.Request('https://explee.com/', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')

soup = BeautifulSoup(html, 'html.parser')
scroll_content = soup.find('div', class_='landing-scroll-content')

if scroll_content:
    print("Children of .landing-scroll-content:")
    for i, child in enumerate(scroll_content.children):
        if getattr(child, 'name', None):
            classes = " ".join(child.get('class', []))
            tag = child.name
            id_str = f" id='{child.get('id')}'" if child.get('id') else ""
            h_tags = [h.get_text(strip=True) for h in child.find_all(['h1', 'h2', 'h3', 'h4'])]
            print(f"\n--- Section [{i}] <{tag}{id_str} class='{classes}'> ---")
            print(f"Headings: {h_tags}")
            print(f"First 150 chars: {child.get_text(strip=True)[:150]}")
