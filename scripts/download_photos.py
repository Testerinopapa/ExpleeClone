import urllib.request
import os

images = [
    "/static/images/landing/testimonials/alex-sunshine.jpg",
    "/static/images/landing/testimonials/camille-rose.jpg",
    "/static/images/landing/testimonials/farhat-asif.jpg",
    "/static/images/landing/testimonials/wole-fagbohun.jpg"
]

for img in images:
    url = "https://explee.com" + img
    target = os.path.join("public/assets", os.path.basename(img))
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
            with open(target, 'wb') as f:
                f.write(data)
            print(f"Downloaded {target} ({len(data)} bytes)")
    except Exception as e:
        print(f"Failed {img}: {e}")
