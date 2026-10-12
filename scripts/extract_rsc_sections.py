import sys
import re
import json
sys.stdout.reconfigure(encoding='utf-8')
from bs4 import BeautifulSoup

soup = BeautifulSoup(open('b2bpage/b2b-database.html', encoding='utf-8'), 'html.parser')
scripts = soup.find_all('script')

all_rsc_text = ""
for s in scripts:
    if s.string and '__next_f' in s.string:
        all_rsc_text += s.string + "\n"

# In RSC push calls, each call is self.__next_f.push([1, "..."])
# Let's extract all string payloads
chunks = []
for m in re.finditer(r'self\.__next_f\.push\(\[\d+,\s*"(.*?)"\]\)', all_rsc_text, re.DOTALL):
    s = m.group(1)
    # unescape standard javascript string escapes
    try:
        decoded = bytes(s, "utf-8").decode("unicode_escape")
        chunks.append(decoded)
    except Exception:
        chunks.append(s)

full_rsc = "".join(chunks)
print("Reassembled full RSC stream. Length:", len(full_rsc))

idx = full_rsc.find('"sections":[')
print('Found "sections":[ at', idx)
if idx != -1:
    start = full_rsc.find('[', idx)
    depth = 0
    in_string = False
    escape = False
    end = -1
    for i in range(start, len(full_rsc)):
        ch = full_rsc[i]
        if escape:
            escape = False
            continue
        if ch == '\\':
            escape = True
            continue
        if ch == '"':
            in_string = not in_string
            continue
        if not in_string:
            if ch == '[':
                depth += 1
            elif ch == ']':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
    
    sections_str = full_rsc[start:end]
    print("Found sections string. Length:", len(sections_str))
    try:
        sections = json.loads(sections_str)
        print("Success! Total categories parsed:", len(sections))
        with open('src/data/b2bDatabaseSections.json', 'w', encoding='utf-8') as f:
            json.dump(sections, f, indent=2, ensure_ascii=False)
        print("Wrote src/data/b2bDatabaseSections.json successfully!")
        for cat in sections:
            print(f" - {cat['id']}: {cat['name']} ({len(cat.get('fields', []))} fields)")
    except Exception as e:
        print("JSON parse error:", e)
        open('b2bpage/failed_sections.txt', 'w', encoding='utf-8').write(sections_str)
