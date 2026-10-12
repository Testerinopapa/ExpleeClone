import glob, sys
sys.stdout.reconfigure(encoding='utf-8')

for f in glob.glob('scripts/extracted_js/*.js') + glob.glob('b2bpage/js_chunks/*.js'):
    with open(f, 'r', encoding='utf-8', errors='ignore') as fl:
        s = fl.read()
        if '/tools/explorer' in s:
            print('Found /tools/explorer in:', f)
            idx = 0
            while True:
                idx = s.find('/tools/explorer', idx)
                if idx == -1: break
                print('  Context:', s[max(0, idx-100):min(len(s), idx+200)])
                idx += len('/tools/explorer')
