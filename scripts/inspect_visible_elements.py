import json

with open('loginpage/login-master.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=== ALL VISIBLE ELEMENTS ===")
for i, el in enumerate(data['visual']['elements']):
    if el.get('visible'):
        sel = el.get('selector', '')
        tag = el.get('tag', '')
        rect = el.get('rect', {})
        text = (el.get('text') or '').strip().replace('\n', ' ')
        classes = el.get('attrs', {}).get('class', '')
        st = el.get('style', {})
        bg = st.get('backgroundColor')
        color = st.get('color')
        border = st.get('border')
        radius = st.get('borderRadius')
        print(f"[{i}] <{tag}> w={rect.get('width')} h={rect.get('height')} x={rect.get('x')} y={rect.get('y')} | text: '{text[:30]}' | class: '{classes}'")
        if any([bg, color, border, radius]):
            print(f"     styles -> bg: {bg}, color: {color}, border: {border}, radius: {radius}")

