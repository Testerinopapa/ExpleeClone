import sys, json, os
sys.stdout.reconfigure(encoding='utf-8')

os.makedirs('src/data/gm', exist_ok=True)

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

# 1. Regions
with open('src/data/gm/regions_extracted.json', 'r', encoding='utf-8') as f:
    raw_regions = json.load(f)

with open('src/data/gm/region_map_svgs.json', 'r', encoding='utf-8') as f:
    region_svgs = json.load(f)

regions_data = []
region_meta = [
    {
        'id': 'north-america',
        'name': 'North America',
        'countries': '6 countries',
        'locations': '25M+ NA locations',
        'href': '/gm-dataset/locations/north-america'
    },
    {
        'id': 'europe',
        'name': 'Europe',
        'countries': '49 countries',
        'locations': '34M+ EU locations',
        'href': '/gm-dataset/locations/europe'
    },
    {
        'id': 'asia-pacific',
        'name': 'Asia Pacific',
        'countries': '17 countries',
        'locations': '88M+ APAC locations',
        'href': '/gm-dataset/locations/asia-pacific'
    },
    {
        'id': 'southeast-asia',
        'name': 'Southeast Asia',
        'countries': '11 countries',
        'locations': '26M+ SEA locations',
        'href': '/gm-dataset/locations/southeast-asia'
    },
    {
        'id': 'latin-america',
        'name': 'Latin America',
        'countries': '50 countries',
        'locations': '22M+ LATAM locations',
        'href': '/gm-dataset/locations/latin-america'
    },
    {
        'id': 'middle-east',
        'name': 'Middle East',
        'countries': '15 countries',
        'locations': '9M+ MENA locations',
        'href': '/gm-dataset/locations/middle-east'
    },
    {
        'id': 'cis',
        'name': 'CIS Countries',
        'countries': '11 countries',
        'locations': '2M+ CIS locations',
        'href': '/gm-dataset/locations/cis'
    },
    {
        'id': 'oceania',
        'name': 'Oceania',
        'countries': '29 countries',
        'locations': '2M+ OCE locations',
        'href': '/gm-dataset/locations/oceania'
    },
    {
        'id': 'africa',
        'name': 'Africa',
        'countries': '56 countries',
        'locations': '11M+ AFR locations',
        'href': '/gm-dataset/locations/africa'
    }
]

for r in region_meta:
    svg_info = region_svgs.get(r['id'], {})
    regions_data.append({
        **r,
        'svgHtml': svg_info.get('html', '')
    })

with open('src/data/gm/gmRegions.json', 'w', encoding='utf-8') as f:
    json.dump(regions_data, f, indent=2, ensure_ascii=False)
print("Saved gmRegions.json")

# 2. Countries: Build full 244 countries list
with open('src/data/gm/gm_21_countries.json', 'r', encoding='utf-8') as f:
    top21 = json.load(f)

# Read b2b countries to get the rest of the 244 countries
with open('src/data/b2bCountries.json', 'r', encoding='utf-8') as f:
    b2b_countries = json.load(f)

top21_slugs = {c['slug']: c for c in top21}

full_countries = []
# First add the 21 top countries in exact order
for c in top21:
    # get code from b2b if available
    code = ''
    for b in b2b_countries:
        if b['name'].lower() == c['name'].lower() or b['href'].split('/')[-1] == c['slug']:
            code = b['code']
            break
    if not code:
        if c['slug'] == 'turkiye': code = 'TR'
        elif c['slug'] == 'korea-republic-of': code = 'KR'
        elif c['slug'] == 'viet-nam': code = 'VN'
        else: code = c['name'][:2].upper()
        
    full_countries.append({
        'code': code,
        'name': c['name'],
        'count': c['count'],
        'raw_flag': c['raw_flag'],
        'href': c['href'],
        'slug': c['slug']
    })

# Add remaining countries
for b in b2b_countries:
    slug = b['href'].split('/')[-1]
    if slug not in top21_slugs and b['name'] not in [c['name'] for c in full_countries]:
        # replace b2b-database with gm-dataset
        href = f"/gm-dataset/locations/{slug}"
        # change "companies" to "locations"
        cnt = b['count'].replace('companies', 'locations')
        full_countries.append({
            'code': b['code'],
            'name': b['name'],
            'count': cnt,
            'raw_flag': '',
            'href': href,
            'slug': slug
        })

print(f"Total countries built: {len(full_countries)}")
with open('src/data/gm/gmCountries.json', 'w', encoding='utf-8') as f:
    json.dump(full_countries, f, indent=2, ensure_ascii=False)
print("Saved gmCountries.json")

# 3. Categories with full code blocks and active fields
with open('src/data/gm/gm_categories_full.json', 'r', encoding='utf-8') as f:
    categories = json.load(f)

with open('src/data/gm/all_code_blocks.json', 'r', encoding='utf-8') as f:
    all_code_blocks = json.load(f)

for cat in categories:
    cid = cat['id']
    cat['codeSpans'] = all_code_blocks.get(cid, [])

with open('src/data/gm/gmCategories.json', 'w', encoding='utf-8') as f:
    json.dump(categories, f, indent=2, ensure_ascii=False)
print("Saved gmCategories.json")
