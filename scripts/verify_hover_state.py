from playwright.sync_api import sync_playwright
import time
import os

os.makedirs('verification_screenshots', exist_ok=True)
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)

    print("Navigating to http://127.0.0.1:3000/tools/explorer?q=day+spa...")
    page.goto('http://127.0.0.1:3000/tools/explorer?q=day+spa', wait_until='commit')
    time.sleep(2)

    # Find Cluster 16 text element
    c16 = page.locator('text="Cluster 16"')
    print("Found Cluster 16 count:", c16.count())
    if c16.count() > 0:
        c16.first.hover()
        time.sleep(0.5)
        page.screenshot(path='verification_screenshots/hover_cluster_16.png')
        print("Captured verification_screenshots/hover_cluster_16.png")

    browser.close()
    print("Hover verification complete.")
