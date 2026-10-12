from playwright.sync_api import sync_playwright
import time
import os
from PIL import Image

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
os.makedirs('verification_screenshots/b2b', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=chrome_path if os.path.exists(chrome_path) else None,
        headless=True
    )
    # The reference screenshot is 1920x1080 at DPR 1.25 (browser inner size 1536x864)
    # Or 1920x1080 device_scale_factor=1
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    page.goto('http://127.0.0.1:3000', wait_until='commit')
    time.sleep(3)

    # Scroll to the NACE heading
    heading = page.locator('h2:text("Explore companies across")')
    heading.scroll_into_view_if_needed()
    # Scroll slightly up so the sticky header and heading have the same breathing room
    page.evaluate('window.scrollBy(0, -90)')
    time.sleep(1)

    page.screenshot(path='verification_screenshots/b2b/nace_current.png', animations='disabled')
    print('Saved nace_current.png')
    browser.close()

# Also create side-by-side comparison if reference exists
ref_path = 'b2bpage/Screenshot (3974).png'
if os.path.exists(ref_path):
    ref_img = Image.open(ref_path)
    curr_img = Image.open('verification_screenshots/b2b/nace_current.png')
    
    # In Screenshot (3974), the browser viewport starts below the URL bar (roughly y=80)
    # and ends above the Windows taskbar (roughly y=1040)
    print(f"Ref size: {ref_img.size}, Current size: {curr_img.size}")
