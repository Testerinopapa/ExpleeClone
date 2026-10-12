with open('b2bpage/rsc_line_7.txt', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('companiesCount')
print("companiesCount index:", idx)
with open('b2bpage/companies_count_snippet.txt', 'w', encoding='utf-8') as out:
    out.write(c[max(0, idx - 500):min(len(c), idx + 2000)])
print("Saved snippet to b2bpage/companies_count_snippet.txt")
