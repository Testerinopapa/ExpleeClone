import json

with open('b2bpage/rsc_line_7.txt', 'r', encoding='utf-8') as f:
    c = f.read()

# Find the exact array around "united-states"
idx = c.find('united-states')
print("united-states found at:", idx)

# Search backward from idx for '['
arr_start = c.rfind('[', 0, idx)
print("arr_start:", arr_start)
print("context before arr_start:", repr(c[arr_start - 30:arr_start]))

# Find matching ']'
depth = 0
in_str = False
escape = False
arr_end = -1
for i in range(arr_start, len(c)):
    ch = c[i]
    if escape:
        escape = False
        continue
    if ch == '\\':
        escape = True
        continue
    if ch == '"':
        in_str = not in_str
        continue
    if not in_str:
        if ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0:
                arr_end = i + 1
                break

print("arr_end:", arr_end)
json_str = c[arr_start:arr_end]
countries = json.loads(json_str)
print("Total countries parsed:", len(countries))

with open('src/data/b2bCountriesAll.json', 'w', encoding='utf-8') as out:
    json.dump(countries, out, indent=2, ensure_ascii=False)

print("Saved successfully to src/data/b2bCountriesAll.json")
