import json

with open('explee-visual-capture/pages/001-introduction/visual.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for el in data['elements']:
    ident = el.get('identity', {})
    classes = ident.get('classes', [])
    geom = el.get('geometry', {})
    
    if 'introduction-card-item' in classes and geom.get('y', 0) < 200:
        print("=== Auth Card Container ===")
        print("layout:", el.get('layout'))
        print("border:", el.get('border'))
        print("bg:", el.get('background'))
        print("shadow:", el.get('shadowAndEffects'))

    if 'bg-b-2' in classes and geom.get('y', 0) < 200:
        print("=== Auth Card Header ===")
        print("layout:", el.get('layout'))
        print("border:", el.get('border'))
        print("bg:", el.get('background'))

    if 'client-libraries-list' in classes:
        print("=== Client Libraries List/Tabs ===")
        print("geom:", geom)
        print("layout:", el.get('layout'))
        print("border:", el.get('border'))
        print("bg:", el.get('background'))

    if 'card-footer' in classes:
        print("=== Card Footer ===")
        print("geom:", geom)
        print("layout:", el.get('layout'))
        print("border:", el.get('border'))
        print("bg:", el.get('background'))
        print("typo:", el.get('typography'))
