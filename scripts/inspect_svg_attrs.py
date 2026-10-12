import json

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    master = json.load(f)

elements = master.get('visual', {}).get('elements', [])
for el in elements:
    if el.get('tag') in ['path', 'circle', 'text', 'rect', 'g']:
        print(f"Tag: {el.get('tag')}, attrs keys: {list(el.get('attrs', {}).keys())}")
        print(f"  attrs: {el.get('attrs')}")
        break

# Let's check if there are other keys in element
sample_el = [el for el in elements if el.get('tag') == 'path'][2]
print("\nSample path keys:", list(sample_el.keys()))
for k, v in sample_el.items():
    if k != 'style':
        print(f"  {k}: {v}")
    else:
        # print non-None style values
        non_empty_style = {sk: sv for sk, sv in v.items() if sv not in [None, 'none', 'normal', 'auto', '0px']}
        print(f"  style (non-empty): {list(non_empty_style.items())[:15]}")
