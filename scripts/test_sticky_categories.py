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
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    page.goto('http://127.0.0.1:3000', wait_until='commit')
    time.sleep(3)

    # 1. Scroll to Data Categories header
    heading = page.locator('h2:text("What\'s Inside Our Database")')
    heading.scroll_into_view_if_needed()
    page.evaluate('window.scrollBy(0, -90)')
    time.sleep(1)
    page.screenshot(path='verification_screenshots/b2b/cat_01_general.png', animations='disabled')
    print('Saved cat_01_general.png')

    # Check active category text
    active_text = page.locator('nav button.text-white').inner_text()
    print('Active category at top:', active_text)

    # 2. Scroll down 1200px into the showcase
    page.evaluate('window.scrollBy(0, 1200)')
    time.sleep(1)
    page.screenshot(path='verification_screenshots/b2b/cat_02_scrolled.png', animations='disabled')
    print('Saved cat_02_scrolled.png')
    active_text = page.locator('nav button.text-white').inner_text()
    print('Active category after 1200px scroll:', active_text)

    # 3. Scroll down another 1800px (to professional network / web data)
    page.evaluate('window.scrollBy(0, 1800)')
    time.sleep(1)
    page.screenshot(path='verification_screenshots/b2b/cat_03_deep_scroll.png', animations='disabled')
    print('Saved cat_03_deep_scroll.png')
    active_text = page.locator('nav button.text-white').inner_text()
    print('Active category after deep scroll:', active_text)

    # 4. Click "General data" tab to test click navigation
    general_btn = page.locator('nav button:has-text("General data")')
    general_btn.click()
    time.sleep(1)
    page.screenshot(path='verification_screenshots/b2b/cat_04_clicked_general.png', animations='disabled')
    print('Saved cat_04_clicked_general.png')
    active_text = page.locator('nav button.text-white').inner_text()
    print('Active category after clicking General data:', active_text)

    browser.close()
    print('Sticky test completed successfully')
