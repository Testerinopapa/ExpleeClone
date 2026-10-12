import sys
sys.stdout.reconfigure(encoding='utf-8')

txt = open('b2bpage/js_chunks/1t1qwylozag2b.js', encoding='utf-8', errors='ignore').read()

def dump_comp(name, length=3500):
    needle = f'["{name}",0'
    idx = txt.find(needle)
    if idx == -1:
        print(f"Not found: {name}")
        return
    print(f"=== {name} ===")
    print(txt[idx:idx+length])
    print("\n" + "="*40 + "\n")

dump_comp('DataSourcesAnimation')
dump_comp('UspCardsWithFlow')
dump_comp('DataFieldsAccordion')
