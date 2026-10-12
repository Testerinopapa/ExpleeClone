import json, os

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

svgs = manifest['visual']['assets']['svgs']
regions_svgs = [s for s in svgs if 'section.mb-24:nth-of-type(1)' in s.get('selector', '') and s.get('viewBox') == '0 0 200 200']

print(f"Found {len(regions_svgs)} region map SVGs")

region_slugs = [
    'north-america',
    'europe',
    'asia-pacific',
    'southeast-asia',
    'latin-america',
    'middle-east',
    'cis',
    'oceania',
    'africa'
]

region_map = {}
for i, s in enumerate(regions_svgs):
    slug = region_slugs[i]
    region_map[slug] = {
        'html': s.get('html'),
        'viewBox': s.get('viewBox')
    }

with open('src/data/gm/region_map_svgs.json', 'w', encoding='utf-8') as out:
    json.dump(region_map, out, indent=2, ensure_ascii=False)

print("Saved region_map_svgs.json with all 9 region silhouettes!")
