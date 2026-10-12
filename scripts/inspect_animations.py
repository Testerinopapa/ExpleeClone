import json

with open('googlemappage/explee-googlemappage.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("CSS Variables count:", len(data.get('cssVariables', {})))
print("Keyframes count:", len(data.get('animation', {}).get('keyframes', [])))
print("Active Animations count:", len(data.get('animation', {}).get('activeAnimations', [])))
print("Scroll Snapshots count:", len(data.get('animation', {}).get('scrollSnapshots', [])))
print("Controls count:", len(data.get('interaction', {}).get('controls', [])))

# Let's inspect keyframes
print("\n--- KEYFRAMES ---")
for kf in data.get('animation', {}).get('keyframes', []):
    print(kf.get('name'))

# Let's inspect active animations
print("\n--- ACTIVE ANIMATIONS ---")
for aa in data.get('animation', {}).get('activeAnimations', []):
    print(aa)
