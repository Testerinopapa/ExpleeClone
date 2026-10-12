import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/extracted_js/36nvci3niro0s.js', 'r', encoding='utf-8', errors='ignore') as fl:
    s = fl.read()

idx = s.find('218M+ local businesses from Google Maps')
# Find the start of the array R = [ ...
start = s.rfind('[', 0, idx)
# And before that the variable name
print("Found array around index:", start)
print(s[start-100:start+1200])
