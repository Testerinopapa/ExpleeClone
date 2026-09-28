with open('scripts/extracted_js/36nvci3niro0s.js', 'r', encoding='utf-8') as f:
    code = f.read()

idx = code.find('bezierCurveTo')
start = max(0, idx - 1000)
end = min(len(code), idx + 2500)
print("Canvas code excerpt:")
print(code[start:end])
