with open('b2bpage/b2b-database.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('Data Categories')
print("Data Categories index:", idx)
if idx != -1:
    with open('b2bpage/extracted_data_categories.html', 'w', encoding='utf-8') as out:
        out.write(c[max(0, idx - 400):min(len(c), idx + 8000)])
    print("Saved to extracted_data_categories.html")
