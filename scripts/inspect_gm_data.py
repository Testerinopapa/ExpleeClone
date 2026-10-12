import json

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Title:", data.get('metadata', {}).get('title'))
print("URL:", data.get('metadata', {}).get('url'))

elements = data.get('visual', {}).get('elements', [])
print(f"Total elements: {len(elements)}")

# Inspect element schema
if elements:
    print("Element keys:", list(elements[0].keys()))

# Extract headings
headings = []
for el in elements:
    tag = el.get('tag') or el.get('tagName') or ''
    text = el.get('text') or el.get('textContent') or ''
    if text:
        text = text.strip().replace('\n', ' ')
    if tag.upper() in ['H1', 'H2', 'H3', 'H4']:
        headings.append((tag.upper(), text[:80], el.get('className', '')))

print("\n--- HEADINGS ---")
for tag, text, cls in headings:
    print(f"[{tag}] {text} (class: {cls[:50]})")

print("\n--- ASSETS ---")
assets = data.get('visual', {}).get('assets', {})
for k, v in assets.items():
    print(f"{k}: {len(v) if isinstance(v, list) else v}")
    if isinstance(v, list) and v:
        print(f"  sample: {v[:3]}")
