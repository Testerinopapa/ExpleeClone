import glob, sys, re
sys.stdout.reconfigure(encoding='utf-8')

print("Searching for explorer / company graph content...")

files = (
    glob.glob('**/*.html', recursive=True) +
    glob.glob('**/*.json', recursive=True) +
    glob.glob('**/*.js', recursive=True)
)

for f in files:
    if '.git' in f or 'node_modules' in f: continue
    try:
        with open(f, 'r', encoding='utf-8', errors='ignore') as fl:
            content = fl.read()
            if 'company graph' in content.lower() or 'segments explorer' in content.lower():
                print(f"Matched in {f}:")
                for line in content.splitlines():
                    if 'company graph' in line.lower() or 'segments explorer' in line.lower() or '/tools/explorer' in line.lower():
                        print("  ", line.strip()[:150])
    except Exception as e:
        pass
