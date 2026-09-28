import json

with open('explee-visual-manifest.json', 'r', encoding='utf-8') as f:
    vis = json.load(f)

for el in vis['elements']:
    if el.get('tag') == 'canvas':
        print('Visual Canvas:', el.get('classes'), el.get('geometry'), el.get('id'))

with open('explee-animation-manifest.json', 'r', encoding='utf-8') as f:
    anim = json.load(f)

for se in anim.get('specialElements', []):
    if se.get('tag') == 'canvas':
        print('Anim Canvas:', se)
