import os
import sys
import json
import argparse
import time
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops, ImageDraw

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
os.makedirs('verification_screenshots', exist_ok=True)

# Parse CLI options
parser = argparse.ArgumentParser(description="Visual comparison runner for Explee docs")
parser.add_argument('--start', type=int, default=None, help='Start route index (e.g. 6)')
parser.add_argument('--end', type=int, default=None, help='End route index (e.g. 64)')
parser.add_argument('--route', type=str, default='005-get-campaign-definition', help='Route folder, label, or index to compare')
parser.add_argument('--tag', type=str, default=None, help='Compare all routes within a specific tag')
parser.add_argument('--all', action='store_true', help='Compare representative routes across all sections')
parser.add_argument('--source', type=str, default='explee-visual-capture/pages', help='Directory with reference images')
parser.add_argument('--port', type=int, default=3000, help='Port of running Vite development server')
args = parser.parse_args()

# Load catalog
endpoints_data_path = 'src/data/endpointsData.json'
with open(endpoints_data_path, 'r', encoding='utf-8') as f:
    endpoints_data = json.load(f)

# Load master routes
master_path = 'explee-docs-capture/all-pages-master.json'
master_pages = []
if os.path.exists(master_path):
    with open(master_path, 'r', encoding='utf-8') as f:
        master_pages = json.load(f)

# Discover page folders
pages_dir = args.source
if not os.path.exists(pages_dir):
    pages_dir = 'explee-docs-capture/pages'

all_folders = sorted([d for d in os.listdir(pages_dir) if os.path.isdir(os.path.join(pages_dir, d))])

def find_target_routes():
    if args.start is not None and args.end is not None:
        matched = []
        for f in all_folders:
            parts = f.split('-', 1)
            if parts[0].isdigit():
                idx = int(parts[0])
                if args.start <= idx <= args.end:
                    matched.append(f)
        return sorted(matched, key=lambda x: int(x.split('-')[0]))
    elif args.all:
        return [
            '001-introduction',
            '004-list-autogtm-campaigns',
            '005-get-campaign-definition',
            '033-companies',
            '039-find-email-by-name',
            '046-list-explee-agents',
            '051-list-async-tasks',
            '053-get-balance',
            '055-send-feedback',
            '057-people-lists'
        ]
    elif args.tag:
        tag_lower = args.tag.lower()
        matched = []
        for p in master_pages:
            if p.get('tag', '').lower() == tag_lower:
                prefix = f"{p['routeIndex']:03d}"
                for f in all_folders:
                    if f.startswith(prefix):
                        matched.append(f)
                        break
        return matched if matched else [args.route]
    else:
        query = args.route.lower()
        for f in all_folders:
            if f.lower() == query or query in f.lower():
                return [f]
        for ep in endpoints_data:
            if query in ep['label'].lower():
                prefix = f"{ep['routeIndex']:03d}"
                for f in all_folders:
                    if f.startswith(prefix):
                        return [f]
        if 'intro' in query:
            return ['001-introduction']
        return [args.route]

target_folders = find_target_routes()
print(f"Targeting {len(target_folders)} route(s) for comparison (Source: {pages_dir})")

output_subfolder = 'verification_screenshots'
if args.start is not None and args.end is not None:
    output_subfolder = os.path.join('verification_screenshots', f'batch_{args.start}_to_{args.end}')
    os.makedirs(output_subfolder, exist_ok=True)

def calculate_similarity(img1, img2):
    w = min(img1.width, img2.width)
    h = min(img1.height, img2.height)
    c1 = img1.crop((0, 0, w, h)).convert('RGB')
    c2 = img2.crop((0, 0, w, h)).convert('RGB')
    diff = ImageChops.difference(c1, c2)
    stat = diff.getdata()
    total_diff = sum(sum(pixel) for pixel in stat)
    max_diff = w * h * 3 * 255
    similarity = (1.0 - (total_diff / max_diff)) * 100.0
    return similarity

def get_route_hash_and_label(folder_name):
    if 'introduction' in folder_name:
        return '#description/introduction', 'Introduction', 'general'
    
    parts = folder_name.split('-', 1)
    if len(parts) == 2 and parts[0].isdigit():
        r_idx = int(parts[0])
        for p in master_pages:
            if p.get('routeIndex') == r_idx:
                return p.get('hashRoute'), p.get('label'), p.get('tag')
        for ep in endpoints_data:
            if ep.get('routeIndex') == r_idx:
                return ep.get('hash'), ep.get('label'), ep.get('tag')
    
    slug = parts[1] if len(parts) == 2 else folder_name
    return f'#tag/{slug}', slug.replace('-', ' ').title(), 'general'

results = []
start_time = time.time()

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 1000}, device_scale_factor=1)
    page.on("pageerror", lambda err: print(f"    [Browser JS Error] {err}"))

    for i, folder in enumerate(target_folders):
        ref_path = os.path.join(pages_dir, folder, 'full-page.png')
        if not os.path.exists(ref_path):
            alt_ref = os.path.join('explee-docs-capture/pages', folder, 'full-page.png')
            if os.path.exists(alt_ref):
                ref_path = alt_ref
            else:
                print(f"[{i+1}/{len(target_folders)}] Skipping {folder}: full-page.png not found")
                continue

        ref_img = Image.open(ref_path)
        ref_w, ref_h = ref_img.size

        route_hash, label, tag = get_route_hash_and_label(folder)
        slug = folder.split('-', 1)[1] if '-' in folder else folder
        r_idx = int(folder.split('-')[0]) if folder.split('-')[0].isdigit() else i + 1

        out_clone = os.path.join(output_subfolder, f'cloned_{folder}.png')
        out_combo = os.path.join(output_subfolder, f'compare_{folder}_side_by_side.png')

        target_url = f'http://127.0.0.1:{args.port}/{route_hash}'
        print(f"[{i+1}/{len(target_folders)}] (#{r_idx:02d}) {label} -> {route_hash} ({ref_w}x{ref_h})")

        page.set_viewport_size({'width': 1440, 'height': ref_h})
        page.goto(target_url, wait_until='domcontentloaded', timeout=60000)
        page.wait_for_timeout(1000)

        page.screenshot(path=out_clone)

        # Compute similarity
        clone_img = Image.open(out_clone)
        sim = calculate_similarity(ref_img, clone_img)
        print(f"    Similarity: {sim:.2f}%")

        # Side-by-side composite
        target_h = min(ref_h, clone_img.height)
        header_h = 40
        combo = Image.new('RGB', (ref_w + clone_img.width, target_h + header_h), color=(240, 240, 240))
        draw = ImageDraw.Draw(combo)

        draw.rectangle([(0, 0), (ref_w, header_h)], fill=(230, 235, 240))
        draw.rectangle([(ref_w, 0), (ref_w + clone_img.width, header_h)], fill=(225, 245, 235))
        draw.text((20, 12), f"REFERENCE: {label} (Saved PNG)", fill=(30, 30, 30))
        draw.text((ref_w + 20, 12), f"CLONE: {label} (Running Server) - Similarity: {sim:.1f}%", fill=(0, 100, 80))

        c_ref = ref_img.crop((0, 0, ref_w, target_h))
        c_clone = clone_img.crop((0, 0, clone_img.width, target_h))
        combo.paste(c_ref, (0, header_h))
        combo.paste(c_clone, (ref_w, header_h))

        combo.save(out_combo)

        results.append({
            'index': r_idx,
            'folder': folder,
            'label': label,
            'tag': tag,
            'hash': route_hash,
            'ref_dimensions': [ref_w, ref_h],
            'similarity': round(sim, 2),
            'composite_path': out_combo
        })

    page.close()
    browser.close()

elapsed = time.time() - start_time
print(f"\n=======================================================")
print(f"BATCH COMPARISON COMPLETED in {elapsed:.1f}s")
print(f"Total Routes Compared: {len(results)}")
avg_sim = sum(r['similarity'] for r in results) / len(results) if results else 0
print(f"Average Visual Similarity: {avg_sim:.2f}%")
print(f"Output Directory: {output_subfolder}")
print(f"=======================================================\n")

# Save reports
report_json_path = os.path.join(output_subfolder, 'report.json')
with open(report_json_path, 'w', encoding='utf-8') as f:
    json.dump({
        'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'totalRoutes': len(results),
        'averageSimilarity': round(avg_sim, 2),
        'elapsedSeconds': round(elapsed, 1),
        'results': results
    }, f, indent=2)

report_md_path = os.path.join(output_subfolder, 'report.md')
with open(report_md_path, 'w', encoding='utf-8') as f:
    f.write(f"# Visual Comparison Batch Report (Pages {args.start or 1} to {args.end or len(results)})\n\n")
    f.write(f"- **Completed**: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}\n")
    f.write(f"- **Total Routes**: {len(results)}\n")
    f.write(f"- **Average Visual Similarity**: **{avg_sim:.2f}%**\n")
    f.write(f"- **Elapsed Time**: {elapsed:.1f}s\n\n")
    f.write("| # | Section / Tag | Label | Dimensions | Similarity | Status |\n")
    f.write("| :-: | :--- | :--- | :-: | :-: | :-: |\n")
    for r in results:
        status = "✅ PASS" if r['similarity'] >= 88.0 else "⚠️ REVIEW"
        f.write(f"| {r['index']} | `{r['tag']}` | {r['label']} | {r['ref_dimensions'][0]}×{r['ref_dimensions'][1]} | **{r['similarity']:.2f}%** | {status} |\n")

print(f"Saved JSON report to: {report_json_path}")
print(f"Saved Markdown report to: {report_md_path}")
