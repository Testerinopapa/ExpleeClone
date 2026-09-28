import urllib.request
import os

logos = ['seonity.svg', 'stayf.svg', '4dev.svg', 'apifdf.svg']
for l in logos:
    url = f'https://explee.com/static/images/landing/clients/light/{l}'
    path = os.path.join('public/assets', l)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        with open(path, 'wb') as f:
            f.write(resp.read())
        print(f"Downloaded {l} to {path}")
