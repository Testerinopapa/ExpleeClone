import urllib.request
from bs4 import BeautifulSoup
import json

req = urllib.request.Request('https://explee.com/', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')

soup = BeautifulSoup(html, 'html.parser')
root = soup.find('div', class_='autogtm-root')

def explore(node, depth=0, max_depth=3):
    if depth > max_depth:
        return
    indent = "  " * depth
    classes = " ".join(node.get('class', [])) if node.get('class') else ""
    tag = node.name
    id_str = f" id='{node.get('id')}'" if node.get('id') else ""
    text_snippet = node.get_text(strip=True)[:40].replace('\n', ' ')
    print(f"{indent}<{tag}{id_str} class='{classes}'> : {text_snippet}")
    for child in node.children:
        if getattr(child, 'name', None):
            explore(child, depth + 1, max_depth)

if root:
    print("Found autogtm-root:")
    explore(root, max_depth=2)
else:
    print("autogtm-root not found")
