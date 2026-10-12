import sys
import json
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

soup = BeautifulSoup(open('b2bpage/extracted_sections/03_div.html', encoding='utf-8'), 'html.parser')
sections = soup.find('div').find_all('section', recursive=False)

# 1. Regions (Section 0)
sec0 = sections[0]
regions = []
for a in sec0.find_all('a'):
    href = a.get('href')
    title = a.find('h3').get_text(strip=True)
    # Extract SVG map
    svg_container = a.find('div', class_='absolute')
    svg = svg_container.find('svg') if svg_container else None
    svg_html = str(svg) if svg else ""
    
    # spans
    spans = a.find_all('span')
    spans_text = [s.get_text(strip=True) for s in spans]
    # e.g. ["4 countries", "26M+ NA companies"]
    countries_text = spans_text[0] if len(spans_text) > 0 else ""
    companies_text = spans_text[1] if len(spans_text) > 1 else ""
    
    regions.append({
        'title': title,
        'href': href,
        'countries': countries_text,
        'companies': companies_text,
        'mapSvg': svg_html
    })

with open('src/data/b2bRegions.json', 'w', encoding='utf-8') as f:
    json.dump(regions, f, indent=2, ensure_ascii=False)
print(f"Saved {len(regions)} regions to src/data/b2bRegions.json")

# 2. NACE Industries (Section 1)
sec1 = sections[1]
industries = []
for a in sec1.find_all('a'):
    href = a.get('href')
    h3 = a.find('h3')
    title = h3.get_text(strip=True) if h3 else ""
    icon_span = a.find('span', class_='text-xl')
    icon = icon_span.get_text(strip=True) if icon_span else ""
    # subtitle e.g. "NACE J · 17M+ companies"
    sub_div = a.find('div', class_='text-muted-foreground')
    sub_text = sub_div.get_text(strip=True) if sub_div else ""
    
    industries.append({
        'title': title,
        'href': href,
        'icon': icon,
        'subtitle': sub_text
    })

with open('src/data/b2bIndustries.json', 'w', encoding='utf-8') as f:
    json.dump(industries, f, indent=2, ensure_ascii=False)
print(f"Saved {len(industries)} industries to src/data/b2bIndustries.json")

# 3. Countries (Section 2)
sec2 = sections[2]
countries = []
for a in sec2.find_all('a'):
    href = a.get('href')
    h3 = a.find('h3')
    name = h3.get_text(strip=True) if h3 else ""
    flag_span = a.find('span', class_='text-xl')
    flag = flag_span.get_text(strip=True) if flag_span else ""
    code_span = a.find('span', class_='font-bold')
    code = code_span.get_text(strip=True) if code_span else ""
    
    # company count
    sub_div = a.find('div', class_='text-muted-foreground')
    count_text = sub_div.get_text(strip=True) if sub_div else ""
    
    countries.append({
        'name': name,
        'href': href,
        'flag': flag,
        'code': code,
        'count': count_text
    })

with open('src/data/b2bCountries.json', 'w', encoding='utf-8') as f:
    json.dump(countries, f, indent=2, ensure_ascii=False)
print(f"Saved {len(countries)} countries to src/data/b2bCountries.json")
