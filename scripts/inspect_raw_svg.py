import json

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    master = json.load(f)

svg_html = master['visual']['assets']['svgs'][2]['html']
print("First 3000 characters of SVG HTML:\n")
print(svg_html[:3000])
