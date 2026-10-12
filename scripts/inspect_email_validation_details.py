import json

with open(r'loginpage/email validation.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=== ALL ELEMENTS HIERARCHY ===")
for i, el in enumerate(data.get('visual', {}).get('elements', [])):
    tag = el.get('tag')
    text = el.get('text')
    rect = el.get('rect', {})
    classes = el.get('attrs', {}).get('class', '')
    style = el.get('style', {})
    if rect.get('y', 0) < 550 and rect.get('width', 0) > 0:
        print(f"[{i:2d}] <{tag}> {classes} | text={repr(text)} | x={rect.get('x'):.1f} y={rect.get('y'):.1f} w={rect.get('width'):.1f} h={rect.get('height'):.1f}")
        for prop in ['color', 'backgroundColor', 'borderRadius', 'borderTopLeftRadius', 'borderColor', 'borderWidth', 'fontSize', 'fontWeight', 'lineHeight', 'gap', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']:
            if style.get(prop) and style.get(prop) not in ['none', 'normal', '0px', 'rgba(0, 0, 0, 0)']:
                print(f"     {prop}: {style.get(prop)}")
