import sys
import re
import json

sys.stdout.reconfigure(encoding='utf-8')
txt = open('b2bpage/js_chunks/1t1qwylozag2b.js', encoding='utf-8', errors='ignore').read()

# Let's search for "General data" or "market_segments"
matches = [m.start() for m in re.finditer(r'General data', txt)]
print("Matches for 'General data':", matches)

for pos in matches:
    print(f"\n--- Match at {pos} ---")
    print(txt[max(0, pos-200):min(len(txt), pos+1500)])
