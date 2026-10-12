import sys
import json
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

soup = BeautifulSoup(open('b2bpage/extracted_sections/03_div.html', encoding='utf-8'), 'html.parser')
sec3 = soup.find('div').find_all('section', recursive=False)[3]

# In Section 3, find all category sections
cat_sections = sec3.find_all('section', recursive=True)
print(f"Total category sections: {len(cat_sections)}")

categories = []
for cs in cat_sections:
    cid = cs.get('id')
    title_el = cs.find('p', class_='font-semibold')
    title = title_el.get_text(strip=True) if title_el else cid
    
    # Extract fields
    fields = []
    # fields are in left col
    for row in cs.find_all('div', class_='flex items-start gap-3 py-2'):
        rate_span = row.find('span', class_='bg-brand-500')
        rate = rate_span.get_text(strip=True) if rate_span else ""
        text_div = row.find_all('div')[-1]
        field_text = text_div.get_text(separator=" ", strip=True)
        fields.append({'rate': rate, 'text': field_text})
    
    # Extract code snippet
    pre = cs.find('pre')
    code_text = pre.get_text() if pre else ""
    
    categories.append({
        'id': cid,
        'name': title,
        'fieldCount': len(fields),
        'fields': fields,
        'code': code_text
    })

print(f"Extracted {len(categories)} categories")
with open('b2bpage/categories_data.json', 'w', encoding='utf-8') as f:
    json.dump(categories, f, indent=2, ensure_ascii=False)
print("Saved b2bpage/categories_data.json")
