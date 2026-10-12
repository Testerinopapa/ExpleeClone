import sys
sys.stdout.reconfigure(encoding='utf-8')

txt = open('b2bpage/js_chunks/1t1qwylozag2b.js', encoding='utf-8', errors='ignore').read()

idx = txt.find('DataFieldsAccordion')
# print 5000 characters before idx
print(txt[max(0, idx-5000):idx])
