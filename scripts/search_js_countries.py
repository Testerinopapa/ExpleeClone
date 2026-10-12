import glob
import re

for js in glob.glob('**/*.js', recursive=True):
    if 'node_modules' in js or 'dist' in js:
        continue
    try:
        with open(js, 'r', encoding='utf-8') as f:
            c = f.read()
            if '238' in c or 'View all' in c or 'locations' in c:
                loc_count = len(re.findall(r'/b2b-database/locations/([a-zA-Z0-9_-]+)', c))
                print(f"File {js}: '238' in c? {'238' in c}, 'locations' count: {loc_count}")
    except Exception as e:
        pass
