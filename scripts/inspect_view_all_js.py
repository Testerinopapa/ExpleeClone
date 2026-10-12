for fname in ['b2bpage/js_chunks/25o2p12t-lu9p.js', 'b2bpage/js_chunks/38cltv3z6l9__.js']:
    with open(fname, 'r', encoding='utf-8') as f:
        c = f.read()
    print(f"=== {fname} (len {len(c)}) ===")
    idx = c.find('View all')
    while idx != -1:
        print(c[max(0, idx - 150):min(len(c), idx + 250)])
        print('---')
        idx = c.find('View all', idx + 1)
