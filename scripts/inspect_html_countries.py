with open('b2bpage/b2b-database.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('DarkCountriesSection')
while idx != -1:
    print(c[max(0, idx - 200):min(len(c), idx + 1000)])
    print('=== END CHUNK ===')
    idx = c.find('DarkCountriesSection', idx + 1)
