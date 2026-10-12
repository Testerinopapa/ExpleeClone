from playwright.sync_api import sync_playwright
import time

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)

    page.goto('http://127.0.0.1:3000/tools/explorer', wait_until='commit')
    time.sleep(2)
    page.screenshot(path='verification_screenshots/landing_no_cta_verified.png')
    print("Saved verification_screenshots/landing_no_cta_verified.png")
    browser.close()
