import json

with open('explee-visual-capture/pages/001-introduction/visual.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for el in data['elements']:
    classes = el.get('identity', {}).get('classes', [])
    if 'endpoint' in classes:
        print("identity keys:", el.get('identity'))
        break

# Also let's check explee-docs-capture for the operations list
try:
    with open('explee-docs-capture/001-introduction.json', 'r', encoding='utf-8') as f:
        doc = json.load(f)
    print("Capture doc keys:", doc.keys())
    if 'sidebar' in doc:
        print("Sidebar keys:", doc['sidebar'].keys())
except Exception as e:
    print("Error reading capture doc:", e)
