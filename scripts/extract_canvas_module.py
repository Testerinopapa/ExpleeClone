with open('scripts/extracted_js/36nvci3niro0s.js', 'r', encoding='utf-8') as f:
    code = f.read()

idx = code.find('bezierCurveTo')
# Find enclosing module boundaries
# Next.js webpack/turbopack modules usually start with module id number, e.g. ,123456, or function
start = code.rfind(',function(', 0, idx)
if start == -1:
    start = code.rfind('function(', 0, idx)
if start == -1:
    start = max(0, idx - 5000)

end = code.find(',function(', idx)
if end == -1:
    end = min(len(code), idx + 8000)

print(f"Module size: {end - start}")
with open('scripts/canvas_component_raw.js', 'w', encoding='utf-8') as out:
    out.write(code[start:end])
print("Saved scripts/canvas_component_raw.js")
