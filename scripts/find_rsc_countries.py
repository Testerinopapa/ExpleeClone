with open('b2bpage/b2b-database.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if '"companiesCount"' in l or '"emoji"' in l or 'DarkCountriesSection' in l or '"countries":' in l:
        print(f"Line {i}: len={len(l)}, preview={l[:200]}")
        # Save this line to a file for examination
        with open(f'b2bpage/rsc_line_{i}.txt', 'w', encoding='utf-8') as out:
            out.write(l)
