import json

with open('loginpage/login-master.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=== IMAGES ===")
for i, img in enumerate(data['visual']['assets']['images']):
    print(f"IMAGE {i}:")
    for k, v in img.items():
        if k != 'dataUri':
            print(f"  {k}: {v}")
        else:
            print(f"  dataUri: {v[:60]}... (len {len(v)})")

print("\n=== SVGS ===")
for i, svg in enumerate(data['visual']['assets']['svgs']):
    print(f"SVG {i}: keys={list(svg.keys())}")
    for k in svg:
        v = str(svg[k])
        print(f"  {k}: {v[:120]}")

print("\n=== INTERACTION CONTROLS ===")
for i, ctrl in enumerate(data['interaction']['controls']):
    print(f"CTRL {i}: tag={ctrl.get('tag')} id={ctrl.get('id')} name={ctrl.get('name')} type={ctrl.get('type')} text={ctrl.get('text')}")

print("\n=== ANIMATIONS ===")
print("activeAnimations:", len(data['animation']['activeAnimations']))
print("keyframes:", len(data['animation']['keyframes']))
for kf in data['animation']['keyframes'][:5]:
    print("  kf:", kf)

