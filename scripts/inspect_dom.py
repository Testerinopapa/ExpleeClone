import urllib.request
from bs4 import BeautifulSoup
import json

req = urllib.request.Request('https://explee.com/', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')

soup = BeautifulSoup(html, 'html.parser')
print('Title:', soup.title.string if soup.title else 'No title')

body = soup.find('body')
if body:
    print('Body structure:')
    for child in body.children:
        if getattr(child, 'name', None):
            classes = child.get('class', [])
            tag = child.name
            id_attr = child.get('id', '')
            text_preview = child.get_text(strip=True)[:60]
            print(f'  <{tag} id="{id_attr}" class="{" ".join(classes[:5])}"> {text_preview}')
