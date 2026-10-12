import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('explorerpage/cluster master.json', 'r', encoding='utf-8') as f:
    master1 = json.load(f)

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    master2 = json.load(f)

print("--- CLUSTER MASTER 1 DETAILS ---")
print("URL:", master1['metadata']['url'])
print("Title:", master1['metadata']['title'])
print("CSS Variables count:", len(master1['cssVariables']))

# Extract suggestion cards from master1
elements1 = master1['visual']['elements']
suggestion_buttons = []
for el in elements1:
    if el.get('tag') == 'button' and 'group flex items-center' in el.get('attrs', {}).get('class', ''):
        # find text or emoji
        btn_idx = el.get('index')
        children = [c for c in elements1 if c.get('index') in [btn_idx + 1, btn_idx + 2]]
        texts = [c.get('text') for c in children if c.get('text')]
        suggestion_buttons.append({'button': el.get('attrs'), 'children_texts': texts})

print(f"\nFound {len(suggestion_buttons)} suggestion buttons:")
for b in suggestion_buttons:
    print(" ", b['children_texts'])

# Now let's extract all clusters, circles, labels, and paths from master2!
print("\n--- CLUSTER MASTER 2 DETAILS ---")
elements2 = master2['visual']['elements']
clusters = {}
labels = []
circles = []
paths = []

for el in elements2:
    tag = el.get('tag')
    text = el.get('text')
    rect = el.get('rect')
    attrs = el.get('attrs', {})
    cls = attrs.get('class', '')
    style = el.get('style', {})

    if tag == 'path' and 'cursor-pointer' in cls:
        paths.append({'rect': rect, 'attrs': attrs, 'style': style})
    elif tag == 'circle' and 'cursor-pointer' in cls:
        circles.append({'rect': rect, 'attrs': attrs, 'style': style})
    elif tag == 'text':
        labels.append({'text': text, 'rect': rect, 'attrs': attrs, 'style': style})

print(f"Total paths: {len(paths)}")
print(f"Total circles: {len(circles)}")
print(f"Total text labels: {len(labels)}")

# Print unique cluster names and badges
print("\nSample Labels:")
for l in labels[:25]:
    print(f"  '{l['text']}' @ ({l['rect']['x']}, {l['rect']['y']}) class={l['attrs'].get('class')}")
