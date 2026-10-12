import json

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    master = json.load(f)

circles = [el for el in master['visual']['elements'] if el.get('tag') == 'circle']
print(f"Total circles: {len(circles)}")
for i in [0, 10, 50, 100, 200]:
    c = circles[i]
    print(f"\nCircle #{i}:")
    print("  rect:", c.get('rect'))
    style = c.get('style', {})
    for sk in ['fill', 'stroke', 'backgroundColor', 'color', 'opacity']:
        print(f"  {sk}: {style.get(sk)}")
    # print any key in style that has a non-empty/non-default value
    non_defaults = {k: v for k, v in style.items() if v not in [None, 'none', 'normal', 'auto', '0px', 'rgba(0, 0, 0, 0)', 'static', 'visible', 'inline']}
    print("  other style keys:", non_defaults)
