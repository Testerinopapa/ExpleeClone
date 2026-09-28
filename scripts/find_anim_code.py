import glob
import re

for f in glob.glob('scripts/extracted_js/*.js'):
    with open(f, 'r', encoding='utf-8') as fl:
        txt = fl.read()
    if 'bezierCurveTo' in txt or 'quadraticCurveTo' in txt or 'requestAnimationFrame' in txt:
        print(f"Found curves/anim in {f}")
        matches = re.findall(r'.{0,100}(?:bezierCurveTo|quadraticCurveTo).{0,100}', txt)
        for m in matches[:3]:
            print("   Match:", m.replace('\n', ' '))
