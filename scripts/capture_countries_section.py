from playwright.sync_api import sync_playwright
import time
import os

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
os.makedirs('verification_screenshots/b2b', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=chrome_path if os.path.exists(chrome_path) else None,
        headless=True
    )
    # Viewport 1920x1080 matching reference screenshot
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    page.goto('http://127.0.0.1:3000', wait_until='commit')
    time.sleep(3)

    # Scroll to the Countries section heading
    heading = page.locator('h2:text("Browse the largest B2B company database across")')
    heading.scroll_into_view_if_needed()
    # Scroll slightly up so header breathing room matches reference Screenshot (3975)
    page.evaluate('window.scrollBy(0, -90)')
    time.sleep(1)

    # 1. Capture collapsed view matching Screenshot (3975)
    page.screenshot(path='verification_screenshots/b2b/countries_collapsed.png', animations='disabled')
    print('Saved countries_collapsed.png')

    # 2. Scroll to the bottom of the collapsed section to see the fade and button
    view_all_btn = page.locator('button:text("View all 238 countries")')
    view_all_btn.scroll_into_view_if_needed()
    page.evaluate('window.scrollBy(0, -200)')
    time.sleep(1)
    page.screenshot(path='verification_screenshots/b2b/countries_bottom_fade.png', animations='disabled')
    print('Saved countries_bottom_fade.png')

    # 3. Click "View all 238 countries"
    view_all_btn.click()
    time.sleep(1)
    show_less_btn = page.locator('button:text("Show less")')
    show_less_btn.scroll_into_view_if_needed()
    page.evaluate('window.scrollBy(0, -200)')
    time.sleep(1)
    page.screenshot(path='verification_screenshots/b2b/countries_expanded_bottom.png', animations='disabled')
    print('Saved countries_expanded_bottom.png')

    # 4. Click "Show less"
    show_less_btn.click()
    time.sleep(1)
    heading.scroll_into_view_if_needed()
    page.evaluate('window.scrollBy(0, -90)')
    time.sleep(1)
    page.screenshot(path='verification_screenshots/b2b/countries_recollapsed.png', animations='disabled')
    print('Saved countries_recollapsed.png')

    browser.close()
    print('All countries screenshots captured successfully')
