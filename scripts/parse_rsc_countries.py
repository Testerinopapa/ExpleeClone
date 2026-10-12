import re
import json

with open('b2bpage/rsc_line_7.txt', 'r', encoding='utf-8') as f:
    c = f.read()

# Let's search for "companiesCount"
idx = c.find('companiesCount')
print("companiesCount index:", idx)
if idx != -1:
    print(c[max(0, idx - 200):min(len(c), idx + 800)])

# Find all JSON-like objects with companiesCount
pattern = r'\{[^{}]*?"companiesCount"[^{}]*?\}'
matches = re.findall(pattern, c)
print(f"Total objects with companiesCount: {len(matches)}")
if matches:
    print("First 3 matches:")
    for m in matches[:3]:
        print(m)
    print("Last 3 matches:")
    for m in matches[-3:]:
        print(m)
