with open('b2bpage/b2b-database.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('ExampleSaas HR')
print("ExampleSaas HR index:", idx)
with open('b2bpage/code_preview_snippet.html', 'w', encoding='utf-8') as out:
    out.write(c[idx - 400:idx + 1500])
print("Saved code_preview_snippet.html")
