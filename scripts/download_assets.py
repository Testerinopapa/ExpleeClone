import glob
from bs4 import BeautifulSoup
import urllib.request
import os

images = set()

for f in glob.glob('scripts/extracted_sections/*.html'):
    with open(f, 'r', encoding='utf-8') as fl:
        soup = BeautifulSoup(fl.read(), 'html.parser')
    for img in soup.find_all('img'):
        src = img.get('src')
        if src:
            images.add(src)

print(f"Total unique images found in extracted sections: {len(images)}")
for src in sorted(images):
    print("  ", src)

os.makedirs('public/assets', exist_ok=True)
download_map = {}

for src in sorted(images):
    url = src
    if url.startswith('/'):
        url = 'https://explee.com' + url
    # Clean filename
    clean_name = os.path.basename(url.split('?')[0])
    if not clean_name or clean_name == 'favicons':
        # Domain favicon
        import urllib.parse
        parsed = urllib.parse.urlparse(url)
        params = urllib.parse.parse_qs(parsed.query)
        dom = params.get('domain', ['favicon'])[0]
        clean_name = f"favicon_{dom}.png"
    
    local_path = os.path.join('public/assets', clean_name)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
            with open(local_path, 'wb') as out:
                out.write(data)
            download_map[src] = f"/assets/{clean_name}"
            print(f"Downloaded {url} -> {local_path} ({len(data)} bytes)")
    except Exception as e:
        print(f"Failed to download {url}: {e}")

import json
with open('scripts/image_download_map.json', 'w') as f:
    json.dump(download_map, f, indent=2)
