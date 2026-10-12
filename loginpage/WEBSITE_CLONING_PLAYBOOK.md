# Website Cloning Playbook: End-to-End Workflow & Scripts Guide

This document captures the exact engineering workflow, script library, and best practices developed to clone **Explee** (`https://explee.com/b2b-database`) with pixel-level visual fidelity. Use this playbook across new projects or agent sessions to save time and avoid repetitive back-and-forth debugging.

---

## Table of Contents
1. [Core Principles & The "Golden Rules"](#1-core-principles--the-golden-rules)
2. [Phase 1: Deep Capture & Asset Harvesting](#2-phase-1-deep-capture--asset-harvesting)
3. [Phase 2: Reverse-Engineering Data & Code from Bundles](#3-phase-2-reverse-engineering-data--code-from-bundles)
4. [Phase 3: Core Architecture & Component Scaffolding](#4-phase-3-core-architecture--component-scaffolding)
5. [Phase 4: Common Pitfalls & How to Avoid Them](#5-phase-4-common-pitfalls--how-to-avoid-them)
6. [Phase 5: Automated Verification & Pixel-Matching Loop](#6-phase-5-automated-verification--pixel-matching-loop)
7. [Script Index & Reusable Snippets](#7-script-index--reusable-snippets)

---

## 1. Core Principles & The "Golden Rules"

1. **The Original DOM & Screenshots are the Single Source of Truth**:
   - Never guess layouts, color hex codes, margins, or animations.
   - Inspect the captured HTML or client JavaScript chunks—in 95% of modern Next.js/React websites, the original React components, JSX class lists, and raw JSON payloads exist directly inside the client bundles.
2. **Beware the "Dark Text" Pitfall (`text-foreground`)**:
   - In Tailwind projects where `foreground: '#0a0a0a'` is defined in `tailwind.config.js`, using `text-foreground` or `text-muted-foreground` will compile to near-black text on a dark background.
   - **Rule**: Always use explicit high-contrast tokens in dark themes: `text-white`, `text-[#f3f4f6]` for primary titles, `text-[#9ca3af]` for descriptions, and `text-white/40` for secondary metadata.
3. **Never Blindly Use `el.offsetTop` for Sticky Navigation**:
   - In any container with `position: relative`, `el.offsetTop` is relative to that container, **not** the document.
   - **Rule**: Always calculate absolute scroll position using:
     ```javascript
     const targetY = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
     window.scrollTo({ top: targetY, behavior: 'smooth' });
     ```
4. **Preserve Native Routing & Clickability**:
   - Even when replicating complex animations or accordions, cards must preserve interactive `href` URLs and buttons must have distinct, accessible click handlers.

---

## 2. Phase 1: Deep Capture & Asset Harvesting

Before writing React components, capture the complete raw assets, rendered HTML, CSS chunks, and media.

### Step 1: Headless Page Dump
Run a Playwright script with Chrome's native binary to dump full HTML, stylesheets, and screenshot milestones:

```python
# scripts/extract_html_and_assets.py
from playwright.sync_api import sync_playwright
import time
import os

os.makedirs('b2bpage', exist_ok=True)
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    
    # Use 'commit' or 'domcontentloaded' if canvas/continuous streams prevent networkidle
    page.goto('https://explee.com/b2b-database', wait_until='commit')
    time.sleep(5)
    
    # Save full DOM snapshot
    html = page.content()
    with open('b2bpage/b2b-database.html', 'w', encoding='utf-8') as f:
        f.write(html)
        
    page.screenshot(path='b2bpage/full_page_ref.png', full_page=True)
    browser.close()
```

### Step 2: Download Media, Logos & Videos
Download client SVG logos, icons, and looping video elements (e.g. WebM 60fps footer animations):

```python
# scripts/download_assets.py
import urllib.request
import os

os.makedirs('public/static/images', exist_ok=True)
os.makedirs('public/assets', exist_ok=True)

assets = {
    "public/static/images/vivid.svg": "https://explee.com/static/images/client-logos/vivid.svg",
    "public/static/images/eightify.svg": "https://explee.com/static/images/client-logos/eightify.svg",
    "public/assets/footer-animation.webm": "https://explee.com/assets/footer.webm"
}

for path, url in assets.items():
    try:
        urllib.request.urlretrieve(url, path)
        print(f"Downloaded: {path}")
    except Exception as e:
        print(f"Failed {url}: {e}")
```

---

## 3. Phase 2: Reverse-Engineering Data & Code from Bundles

Modern websites (built with Next.js Turbopack / Webpack) embed the exact React components and initial props in the HTML or client chunks. **Do not create dummy schemas when the real data is already in the bundle.**

### Step 1: Finding the Original React Component in JS Chunks
Search `b2bpage/js_chunks` for section keywords to locate the unminified original component:

```python
# scripts/find_component_code.py
import glob

keyword = "DarkCountriesSection" # or "What's Inside Our Database"
for file in glob.glob('b2bpage/js_chunks/*.js'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        if keyword in content:
            print(f"Found in: {file}")
            idx = content.find(keyword)
            print(content[idx:idx+1500])
```

*Example extraction result*: We found the exact original `DarkCountriesSection` component with its state (`[d, m] = useState(false)`), `e.slice(0, 21)`, and gradient button markup.

### Step 2: Extracting RSC JSON Payloads
Next.js renders initial data into React Server Component (RSC) lines:

```python
# scripts/extract_rsc_data.py
import json

with open('b2bpage/b2b-database.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Locate JSON objects by key (e.g., 'countries', 'companiesCount')
start = html.find('"countries":[')
if start != -1:
    depth = 0
    in_str = False
    escape = False
    arr_start = start + len('"countries":')
    arr_end = -1
    for i in range(arr_start, len(html)):
        ch = html[i]
        if escape: escape = False; continue
        if ch == '\\': escape = True; continue
        if ch == '"': in_str = not in_str; continue
        if not in_str:
            if ch == '[': depth += 1
            elif ch == ']':
                depth -= 1
                if depth == 0: arr_end = i + 1; break
    if arr_end != -1:
        data = json.loads(html[arr_start:arr_end])
        with open('src/data/b2bCountries.json', 'w', encoding='utf-8') as out:
            json.dump(data, out, indent=2, ensure_ascii=False)
        print(f"Saved {len(data)} items to b2bCountries.json")
```

---

## 4. Phase 3: Core Architecture & Component Scaffolding

### 1. Glassmorphism CSS Architecture (`src/b2b.css`)
Explee uses a multi-layer glass border technique:
```css
.b2b-dark {
  --background: #090b0b;
  --foreground: #ffffff;
  --muted-foreground: #9ca3af;
  background-color: #090b0b;
  color: #ffffff;
}

.b2b-dark .glass-window {
  backdrop-filter: blur(12px);
  background: #090b0b52;
  border-radius: 20px;
}

.b2b-dark .glass-window--inset {
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px;
}

.b2b-dark .glass-window-inner {
  background: radial-gradient(at 0 0, rgba(255, 255, 255, 0.06) 0%, rgba(0, 0, 0, 0) 60%),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0% 100%);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.b2b-dark .glass-window-inner:before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 40%, rgba(255, 255, 255, 0.02) 100%);
  padding: 1px;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
```

### 2. Sticky Sidebar + Scrolling Content Showcase Architecture
When creating pinned sidebar navigations that stick while right-side cards scroll by:

```jsx
// src/components/b2b/B2BDataCategoriesSection.jsx
export default function B2BDataCategoriesSection() {
  const [activeCategory, setActiveCategory] = useState('general');
  const sectionRefs = useRef({});
  const OFFSET = 96; // 64px sticky header + 32px breathing room

  // Smooth click scroll to matching section
  const scrollToCategory = (e, id) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveCategory(id);
    const el = sectionRefs.current[id];
    if (el) {
      const rect = el.getBoundingClientRect();
      const targetY = rect.top + window.scrollY - OFFSET;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  // Scrollspy tracking active section in viewport
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const ids = sectionsData.map((s) => s.id);
        const threshold = 180; // 180px below viewport top

        let current = ids[0];
        for (let i = 0; i < ids.length; i++) {
          const el = sectionRefs.current[ids[i]];
          if (el && el.getBoundingClientRect().top <= threshold) {
            current = ids[i];
          } else {
            break;
          }
        }
        setActiveCategory(current);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="mb-24">
      {/* IMPORTANT: Do NOT put items-start on this parent flex container!
          Without items-start, nav stretches to 100% height of all cards,
          allowing the inner div to remain sticky across the entire showcase. */}
      <div className="flex flex-col lg:flex-row gap-6 relative">
        <nav className="w-full lg:w-72 shrink-0">
          <div className="lg:sticky lg:top-24 glass-window glass-window--inset">
            <div className="glass-window-inner">
              <div className="p-4 border-b border-white/[0.08]">
                <h3 className="font-semibold text-sm text-white">Data Categories</h3>
              </div>
              <ul className="divide-y divide-white/[0.06]">
                {sectionsData.map((sec) => (
                  <li key={sec.id}>
                    <button
                      type="button"
                      onClick={(e) => scrollToCategory(e, sec.id)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                        activeCategory === sec.id
                          ? 'bg-brand-500/10 text-white border-l-2 border-brand-500'
                          : 'hover:bg-white/[0.04] text-[#9ca3af] hover:text-white border-l-2 border-transparent'
                      }`}
                    >
                      <span className="flex-1 text-sm font-medium truncate">{sec.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40">
                        {sec.fields.length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* Right Scrolling Content */}
        <div className="flex-1 min-w-0 space-y-8">
          {sectionsData.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              ref={(el) => (sectionRefs.current[sec.id] = el)}
              className="scroll-mt-24"
            >
              {/* Card content */}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 3. Expandable Disclosure Grid with Fade Overlay
Pattern for grids that show an initial subset (e.g. 21 cards) and expand in place to 200+ cards:

```jsx
export default function B2BCountriesSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleCountries = isExpanded ? countriesData : countriesData.slice(0, 21);

  return (
    <section className="mb-48">
      <h2 className="text-2xl md:text-3xl font-normal text-white mb-8 text-center">
        Browse the largest B2B company database across{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#05ac82] to-[#15addc]">
          {countriesData.length} countries
        </span>
      </h2>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCountries.map((c) => (
            <a key={c.code} href={c.href} className="group glass-window glass-window--inset">
              <div className="glass-window-inner flex items-center gap-4 p-5 min-h-[105px]">
                <span className="font-bold text-xl md:text-2xl text-white w-10 shrink-0 font-sans">
                  {c.code}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white group-hover:text-brand-400 truncate">
                    {c.name}
                  </h3>
                  <p className="text-sm text-[#9ca3af]">{c.count}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-brand-400 group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>

        {/* Collapsed State: Dark Fade & Centered Button */}
        {!isExpanded && (
          <>
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#090B0B] via-[#090B0B]/80 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="inline-flex items-center gap-2 glass-edge bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm font-medium px-6 py-3 rounded-xl transition-all pointer-events-auto"
              >
                <span>View all {countriesData.length} countries</span>
                <ChevronDown className="h-4 w-4 text-white/60" />
              </button>
            </div>
          </>
        )}

        {/* Expanded State: Show Less Button */}
        {isExpanded && (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="inline-flex items-center gap-2 glass-edge bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm font-medium px-6 py-3 rounded-xl transition-all"
            >
              <span>Show less</span>
              <ChevronUp className="h-4 w-4 text-white/60" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
```

---

## 5. Phase 4: Common Pitfalls & How to Avoid Them

| Problem | Cause | Permanent Fix |
|---|---|---|
| **Text is invisible black on dark card** | `text-foreground` resolves to `#0a0a0a` in Tailwind. | Use explicit `text-white` or `text-[#f3f4f6]`. Never use unconfigured `text-foreground`. |
| **Section heading is missing its first half** | First part used `text-foreground` while second part was gradient. | Always wrap heading prefixes in `text-white` or `text-foreground` with `--foreground: #ffffff`. |
| **Sticky sidebar scrolls off immediately** | Parent container had `items-start`, which collapsed `<nav>`'s height to its immediate content. | Remove `items-start` from parent flex container so `<nav>` naturally stretches to 100% of sibling height. |
| **Category click jumps to top of page/showcase** | Used `el.offsetTop`, which is relative to the `relative` parent container. | Use `el.getBoundingClientRect().top + window.scrollY - OFFSET`. |
| **Strings concatenated like `4countries`** | Scraped text stripped whitespace between child elements. | Use regex replacer `.replace(/(\d+)(countries)/i, '$1 countries')` or sanitize source JSON. |
| **Playwright `goto` hangs or times out** | Continuous canvas animation loop or video stream prevents `networkidle`. | Use `page.goto(url, wait_until='commit')` followed by explicit `time.sleep(3)`. |

---

## 6. Phase 5: Automated Verification & Pixel-Matching Loop

Always run automated capture scripts against the local dev server (`http://127.0.0.1:3000`) and crop side-by-side images with PIL:

```python
# scripts/verify_section_match.py
from playwright.sync_api import sync_playwright
import time
from PIL import Image

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    page.goto('http://127.0.0.1:3000', wait_until='commit')
    time.sleep(3)

    # Scroll to target heading
    heading = page.locator('h2:text("From company database to")')
    heading.scroll_into_view_if_needed()
    page.evaluate('window.scrollBy(0, -90)')
    time.sleep(1)

    page.screenshot(path='verification_screenshots/current_view.png', animations='disabled')
    browser.close()

# Crop and create comparison image
curr = Image.open('verification_screenshots/current_view.png')
ref = Image.open('b2bpage/Screenshot (3977).png')

# Measure card dimensions & contrast
print(f"Captured: {curr.size}, Reference: {ref.size}")
```

---

## 7. Script Index & Reusable Snippets

The following scripts in `scripts/` can be adapted for any website clone task:

1. **`scripts/extract_countries_json.py` / `scripts/parse_exact_countries.py`**:
   - Parses massive Next.js RSC payload lines to recover original data structures.
2. **`scripts/measure_card.py`**:
   - Scans image pixel columns to measure exact card padding, border width, card height, and gap dimensions.
3. **`scripts/capture_countries_section.py`**:
   - Tests collapsed state, click-to-expand, bottom fade overlay, and collapse back.
4. **`scripts/test_category_clicks.py`**:
   - Programmatically clicks each navigation item and verifies `window.scrollY` advances to the exact matching card without jumping to the top of the page.
5. **`scripts/compare_rev_driver.py` / `scripts/crop_card.py`**:
   - Crops identical viewport regions from current build and reference screenshot for instant visual comparison.
