import urllib.request
from bs4 import BeautifulSoup
import re
import os

req = urllib.request.Request('https://explee.com/', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')

soup = BeautifulSoup(html, 'html.parser')
scripts = soup.find_all('script', src=True)

os.makedirs('scripts/extracted_js', exist_ok=True)
print(f"Found {len(scripts)} scripts")

for s in scripts:
    src = s.get('src')
    if src:
        if src.startswith('/'):
            src = 'https://explee.com' + src
        fname = os.path.basename(src.split('?')[0])
        local_path = os.path.join('scripts/extracted_js', fname)
        try:
            req_js = urllib.request.Request(src, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req_js) as resp_js:
                content = resp_js.read().decode('utf-8')
                with open(local_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                if 'canvas' in content or 'getContext' in content:
                    print(f"-> Script with canvas logic: {fname} ({len(content)} bytes)")
                else:
                    print(f"   Script {fname} ({len(content)} bytes)")
        except Exception as e:
            print(f"Failed to fetch {src}: {e}")
