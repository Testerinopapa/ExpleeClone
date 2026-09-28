import glob
import re

css_files = glob.glob('scripts/extracted_css/*.css')

for f in css_files:
    with open(f, 'r', encoding='utf-8') as fl:
        txt = fl.read()
    if ':root' in txt or '.theme-light' in txt:
        print(f"Theme vars in {f}:")
        matches = re.findall(r'(:root|\.theme-light|\.landing-light)\s*\{[^}]+\}', txt)
        for m in matches[:5]:
            print(m[:300])
            print('---')
