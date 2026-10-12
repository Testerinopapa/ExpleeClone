with open('b2bpage/b2b-database.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('revenue driver')
print("revenue driver index:", idx)
if idx != -1:
    with open('b2bpage/revenue_driver_extracted.html', 'w', encoding='utf-8') as out:
        out.write(c[idx - 200:idx + 3000])
    print("Saved to revenue_driver_extracted.html")
