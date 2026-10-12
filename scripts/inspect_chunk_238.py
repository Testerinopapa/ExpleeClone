with open('b2bpage/js_chunks/0alimk2bc801_.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('238')
while idx != -1:
    print(c[max(0, idx - 100):min(len(c), idx + 150)])
    print('---')
    idx = c.find('238', idx + 1)
