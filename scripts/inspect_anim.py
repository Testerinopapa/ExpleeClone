import json

with open('explee-animation-manifest.json', 'r', encoding='utf-8') as f:
    anim = json.load(f)

print("=== ANIMATION MANIFEST SUMMARY ===")
print("Keys:", list(anim.keys()))
print("WebAnimations:", len(anim.get('webAnimations', [])))
for wa in anim.get('webAnimations', []):
    print("  WebAnim:", wa.get('id'), wa.get('target', {}).get('tag'), wa.get('target', {}).get('classes'))

print("\nCSS Keyframes / Transitions in anim['css']:")
if 'keyframes' in anim.get('css', {}):
    print("  Keyframe names:", [kf.get('name') for kf in anim['css']['keyframes']])
if 'transitions' in anim.get('css', {}):
    print("  Transitions count:", len(anim['css']['transitions']))

print("\nSpecial Elements count:", len(anim.get('specialElements', [])))
for se in anim.get('specialElements', [])[:10]:
    print("  Special element:", se.get('type'), se.get('tag'), se.get('classes'))

print("\nActual motion:", anim.get('actualMotion', {}).keys())
for k, v in anim.get('actualMotion', {}).items():
    print(f"  actualMotion[{k}]: len = {len(v) if isinstance(v, list) else type(v)}")
