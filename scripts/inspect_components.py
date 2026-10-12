import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

txt = open('b2bpage/js_chunks/1t1qwylozag2b.js', encoding='utf-8', errors='ignore').read()

components = [
    'DEFAULT_COUNTRY',
    'CalendlyWidget',
    'DarkHeader',
    'B2BDatabaseDarkWrapper',
    'DataFieldsAccordion',
    'DataSourcesAnimation',
    'TrustLogos',
    'UspCardsWithFlow',
    'Footer',
    'getAllCountries'
]

for comp in components:
    idx = txt.find(f'["{comp}",0')
    if idx != -1:
        print(f"=== {comp} ===")
        print(txt[idx:idx+800])
        print("\n")
