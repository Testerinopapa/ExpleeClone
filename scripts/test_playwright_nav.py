from playwright.sync_api import sync_playwright
import time

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1520, 'height': 850})
    print("Navigating with commit...")
    t0 = time.time()
    page.goto('http://127.0.0.1:3000', wait_until='commit', timeout=15000)
    print(f"Committed in {time.time()-t0:.2f}s")
    time.sleep(3)
    page.screenshot(path='verification_screenshots/b2b/test_snap.png', animations='disabled')
    print("Screenshot saved successfully!")
    browser.close()
