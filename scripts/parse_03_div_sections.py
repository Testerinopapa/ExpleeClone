import sys
import json
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

soup = BeautifulSoup(open('b2bpage/extracted_sections/03_div.html', encoding='utf-8'), 'html.parser')
sections = soup.find('div').find_all('section', recursive=False)
print(f"Total sections in 03_div: {len(sections)}")

for i, sec in enumerate(sections):
    h2 = sec.find('h2')
    h2_text = h2.get_text(strip=True) if h2 else "No H2"
    print(f"\n--- Section {i}: {h2_text} ---")
    cards = sec.find_all('a')
    print(f"  Total links/cards: {len(cards)}")
    for c in cards[:3]:
        print(f"    Sample card: {c.get('href')} -> {c.get_text(strip=True)[:60]}")
