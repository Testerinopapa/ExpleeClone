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

    # Scroll to the revenue driver section heading
    heading = page.locator('h2:text("From company database to")')
    heading.scroll_into_view_if_needed()
    # Scroll slightly up to match the reference view in Screenshot (3977)
    page.evaluate('window.scrollBy(0, -90)')
    time.sleep(1)

    page.screenshot(path='verification_screenshots/b2b/revenue_driver_current.png', animations='disabled')
    print('Saved revenue_driver_current.png')
    browser.close()
