import json
import re

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

elements = manifest['visual']['elements']

print("Loaded elements:", len(elements))

# Let's inspect the sections in visual.elements
# Let's group elements by their container hierarchy
# 1. Header (Navbar)
header_elements = [el for el in elements if 'header' in el.get('selector', '')]
print("Header elements:", len(header_elements))

# 2. Hero Section (text-center mb-10 and mb-16 metric cards and mb-0 logos)
hero_elements = [el for el in elements if 'section.text-center.mb-10' in el.get('selector', '')]
metrics_elements = [el for el in elements if 'section.mb-16:nth-of-type(2)' in el.get('selector', '')]
logos_elements = [el for el in elements if 'section.text-center.mb-0:nth-of-type(3)' in el.get('selector', '')]
print(f"Hero: {len(hero_elements)}, Metrics: {len(metrics_elements)}, Logos: {len(logos_elements)}")

# 3. Geographic Regions Section (section.mb-24:nth-of-type(1))
regions_elements = [el for el in elements if 'section.mb-24:nth-of-type(1)' in el.get('selector', '')]
print("Regions elements:", len(regions_elements))

# 4. Countries Section (section.mb-24:nth-of-type(2))
countries_elements = [el for el in elements if 'section.mb-24:nth-of-type(2)' in el.get('selector', '')]
print("Countries elements:", len(countries_elements))

# 5. Data Categories Section (section.mb-16:nth-of-type(3) or categories ids)
cat_ids = ['#general', '#geography', '#contact', '#reviews', '#visitor', '#media', '#hospitality', '#labels']
categories_elements = [el for el in elements if any(cid in el.get('selector', '') for cid in cat_ids) or 'Data Categories' in (el.get('text') or '')]
print("Categories elements:", len(categories_elements))

# 6. Custom Place Attributes Section (section.relative.overflow-hidden:nth-of-type(1))
custom_elements = [el for el in elements if 'section.relative.overflow-hidden:nth-of-type(1)' in el.get('selector', '')]
print("Custom attributes elements:", len(custom_elements))

# 7. Business Insights Section (section.py-16.md:py-24:nth-of-type(2))
insights_elements = [el for el in elements if 'section.py-16.md' in el.get('selector', '')]
print("Insights elements:", len(insights_elements))

# 8. Calendly Demo Booking Section (section.pt-24.md:pt-32.pb-16)
calendly_elements = [el for el in elements if 'section.pt-24' in el.get('selector', '')]
print("Calendly elements:", len(calendly_elements))

# 9. Footer
footer_elements = [el for el in elements if 'footer' in el.get('selector', '')]
print("Footer elements:", len(footer_elements))
