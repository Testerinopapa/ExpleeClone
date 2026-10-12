import json

with open('explorerpage/cluster-master.json', 'r', encoding='utf-8') as f:
    master = json.load(f)

svg2 = master['visual']['assets']['svgs'][2]
html = svg2.get('html', '')
print("Length of SVG #2 HTML:", len(html))

# Save the full SVG to a file so we can analyze it
with open('scripts/explorer_day_spa.svg', 'w', encoding='utf-8') as f:
    f.write(html)

print("Saved scripts/explorer_day_spa.svg")
