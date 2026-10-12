import os
import re
import urllib.request

os.makedirs('explorerpage/js_chunks', exist_ok=True)

with open('explorerpage/live_dump/explorer_landing.html', 'r', encoding='utf-8') as f:
    html = f.read()

chunks = set(re.findall(r'(/_next/static/chunks/[^"]+\.js[^"]*)', html))
print(f"Found {len(chunks)} chunks in landing HTML")

for c in sorted(chunks):
    # Extract filename without query params
    fname = os.path.basename(c.split('?')[0])
    target = os.path.join('explorerpage/js_chunks', fname)
    url = f"https://explee.com{c}"
    if not os.path.exists(target):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp, open(target, 'wb') as out:
                out.write(resp.read())
            print(f"Downloaded {fname}")
        except Exception as e:
            print(f"Failed {fname}: {e}")
    else:
        print(f"Already have {fname}")

print("Done downloading chunks.")
