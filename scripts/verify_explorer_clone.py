from playwright.sync_api import sync_playwright
import time
import os

os.makedirs('verification_screenshots', exist_ok=True)
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)

    # 1. Landing Page
    print("Testing Landing Page at http://127.0.0.1:3000/tools/explorer...")
    page.goto('http://127.0.0.1:3000/tools/explorer', wait_until='commit')
    time.sleep(2)
    page.screenshot(path='verification_screenshots/local_explorer_landing.png', full_page=True)
    print("Saved verification_screenshots/local_explorer_landing.png")

    # 2. Direct AI Meeting query
    print("Testing AI Meeting view at http://127.0.0.1:3000/tools/explorer?q=AI+meeting+note+writer...")
    page.goto('http://127.0.0.1:3000/tools/explorer?q=AI+meeting+note+writer', wait_until='commit')
    time.sleep(2)
    page.screenshot(path='verification_screenshots/local_explorer_ai_meeting.png', full_page=True)
    print("Saved verification_screenshots/local_explorer_ai_meeting.png")

    # 3. Test interactive search on landing page to capture loading state
    print("Testing interactive search transition...")
    page.goto('http://127.0.0.1:3000/tools/explorer', wait_until='commit')
    time.sleep(1)
    # Click suggestion button 'day spa'
    spa_btn = page.locator('button:has-text("day spa")')
    if spa_btn.count() > 0:
        spa_btn.first.click()
        time.sleep(0.4)
        page.screenshot(path='verification_screenshots/local_explorer_loading.png')
        print("Saved verification_screenshots/local_explorer_loading.png")
        time.sleep(2)
        page.screenshot(path='verification_screenshots/local_explorer_day_spa.png')
        print("Saved verification_screenshots/local_explorer_day_spa.png")

    browser.close()
    print("Verification screenshots captured successfully!")
