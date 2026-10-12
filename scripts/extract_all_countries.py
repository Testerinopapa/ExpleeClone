import json
import re
import os
import glob

def find_countries():
    # 1. Look in b2b-database.html
    with open('b2bpage/b2b-database.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Search for all occurrences of /b2b-database/locations/
    locations = set(re.findall(r'/b2b-database/locations/([a-zA-Z0-9_-]+)', html))
    print(f"Unique location slugs in b2b-database.html: {len(locations)}")

    # Check explee-public-api-docs-master-capture.json or other files in b2bpage
    for p in glob.glob('b2bpage/**/*.*', recursive=True):
        if p.endswith('.png') or p.endswith('.webm'):
            continue
        try:
            with open(p, 'r', encoding='utf-8') as f:
                c = f.read()
                locs = set(re.findall(r'/b2b-database/locations/([a-zA-Z0-9_-]+)', c))
                if len(locs) > 0:
                    print(f"File {p}: {len(locs)} location slugs")
        except Exception as e:
            pass

find_countries()
