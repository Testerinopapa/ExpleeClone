from bs4 import BeautifulSoup
import json

for sec_name in ['scripts/extracted_sections/sec_1_section.html', 'scripts/extracted_sections/sec_8_section.html']:
    with open(sec_name, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    canvases = soup.find_all('canvas')
    print(sec_name, "canvases:", len(canvases))
    for c in canvases:
        print("  Canvas attrs:", c.attrs)
