import json

with open(r'loginpage/email validation.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=== METADATA ===")
print(data.get('metadata'))

print("\n=== INTERACTION CONTROLS ===")
for c in data.get('interaction', {}).get('controls', []):
    print(c.get('tag'), repr(c.get('text')), c.get('type'), c.get('selector'), c.get('rect'))

print("\n=== VISIBLE ELEMENTS WITH TEXT ===")
for el in data.get('visual', {}).get('elements', []):
    if el.get('visible') and el.get('text'):
        print(f"{el.get('tag'):<10} text={repr(el.get('text'))} rect={el.get('rect')}")

print("\n=== SVGS ===")
for s in data.get('visual', {}).get('assets', {}).get('svgs', []):
    print("SVG keys:", list(s.keys()))
    for k in s:
        print(f"  {k}: {str(s[k])[:100]}")

print("\n=== ALL VISIBLE ELEMENTS DETAILS ===")
for el in data.get('visual', {}).get('elements', []):
    if el.get('visible'):
        tag = el.get('tag')
        selector = el.get('selector')
        classes = el.get('attrs', {}).get('class', '')
        text = el.get('text')
        rect = el.get('rect')
        style = el.get('style', {})
        bg = style.get('backgroundColor')
        color = style.get('color')
        fontSize = style.get('fontSize')
        fontWeight = style.get('fontWeight')
        print(f"{tag:<8} sel={selector:<50} text={repr(text)} rect=({rect.get('x'):.1f}, {rect.get('y'):.1f}, {rect.get('width'):.1f}, {rect.get('height'):.1f}) bg={bg} col={color} fz={fontSize} fw={fontWeight}")
