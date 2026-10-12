import sys
import re
sys.stdout.reconfigure(encoding='utf-8')
from bs4 import BeautifulSoup

soup = BeautifulSoup(open('b2bpage/b2b-database.html', encoding='utf-8'), 'html.parser')
scripts = soup.find_all('script')

all_rsc_text = ""
for s in scripts:
    if s.string and '__next_f' in s.string:
        all_rsc_text += s.string + "\n"

print("Total RSC text length:", len(all_rsc_text))
idx = all_rsc_text.find('General data')
print("General data index in RSC:", idx)
if idx != -1:
    print(all_rsc_text[max(0, idx-200):min(len(all_rsc_text), idx+3000)])
