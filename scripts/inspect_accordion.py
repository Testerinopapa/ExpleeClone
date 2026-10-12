import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

txt = open('b2bpage/js_chunks/1t1qwylozag2b.js', encoding='utf-8', errors='ignore').read()

# Search for pre or code rendering in 1t1qwylozag2b.js
idx = txt.find('DataFieldsAccordion')
print(txt[idx:idx+5000])
