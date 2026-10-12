import json

for fname in ['cluster master.json', 'cluster-master.json']:
    print(f"\n==================== {fname} ====================")
    with open(f'explorerpage/{fname}', 'r', encoding='utf-8') as f:
        data = json.load(f)
    elements = data.get('visual', {}).get('elements', [])
    tags = {}
    for el in elements:
        t = el.get('tag')
        tags[t] = tags.get(t, 0) + 1
    print("Tag frequencies:", tags)
    print("\nFirst 15 elements summary:")
    for el in elements[:15]:
        print(f"[{el.get('index')}] <{el.get('tag')}> class={el.get('attrs', {}).get('class')} id={el.get('attrs', {}).get('id')} text={repr(el.get('text', ''))[:40]} rect={el.get('rect')}")
