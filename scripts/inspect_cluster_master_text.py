import json

with open('explorerpage/cluster master.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

elements = data.get('visual', {}).get('elements', [])
for el in elements:
    tag = el.get('tag')
    text = el.get('text')
    cls = el.get('attrs', {}).get('class')
    if text or tag in ['input', 'textarea', 'button', 'h1', 'h2', 'h3', 'h4', 'header', 'footer']:
        print(f"<{tag} class='{cls}'> text: {repr(text)}")
