import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('loginpage/login-master.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for idx in range(14, 35):
    el = data['visual']['elements'][idx]
    sel = el.get('selector')
    tag = el.get('tag')
    cls = el.get('attrs', {}).get('class', '')
    txt = el.get('text')
    st = el.get('style', {})
    rect = el.get('rect', {})
    print(f"EL {idx}: <{tag}> class='{cls}' text={repr(txt)}")
    print(f"   rect: w={rect.get('width')} h={rect.get('height')} x={rect.get('x')} y={rect.get('y')}")
    print(f"   border: {st.get('borderTopWidth')} {st.get('borderTopColor')} radius={st.get('borderTopLeftRadius')}")
    print(f"   bg: {st.get('backgroundColor')} color: {st.get('color')}")

    print(f"\n=== EL {idx}: <{tag}> {sel} ===")
    print('  rect:', el.get('rect'))
    print('  attrs:', el.get('attrs'))
    print('  text:', repr(el.get('text')))
    if el.get('after'):
        print('  after:', json.dumps(el.get('after'), indent=2))
    st = el.get('style', {})
    for k, v in st.items():
        if v and v not in ['none', '0px', 'normal', 'auto', 'rgba(0, 0, 0, 0)', 'static', 'visible']:
            print(f'  {k}: {v}')

