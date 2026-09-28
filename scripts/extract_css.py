import urllib.request
from bs4 import BeautifulSoup
import os

req = urllib.request.Request('https://explee.com/', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')

soup = BeautifulSoup(html, 'html.parser')
os.makedirs('scripts/extracted_css', exist_ok=True)

links = soup.find_all('link', rel='stylesheet')
for idx, link in enumerate(links):
    href = link.get('href')
    if href:
        if href.startswith('/'):
            href = 'https://explee.com' + href
        try:
            req_css = urllib.request.Request(href, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req_css) as resp_css:
                css_data = resp_css.read().decode('utf-8')
                fname = f"scripts/extracted_css/style_{idx}_{os.path.basename(href.split('?')[0])}"
                with open(fname, 'w', encoding='utf-8') as f:
                    f.write(css_data)
                print(f"Downloaded CSS {fname} ({len(css_data)} bytes)")
        except Exception as e:
            print(f"Failed to fetch {href}: {e}")

styles = soup.find_all('style')
for idx, s in enumerate(styles):
    fname = f"scripts/extracted_css/inline_{idx}.css"
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(s.get_text())
    print(f"Saved inline style {fname} ({len(s.get_text())} bytes)")
