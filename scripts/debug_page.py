import os
from playwright.sync_api import sync_playwright

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=chrome_path if os.path.exists(chrome_path) else None,
        headless=True
    )
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    page.on("console", lambda msg: print("CONSOLE:", msg.type, msg.text))
    page.on("pageerror", lambda err: print("PAGE ERROR:", err))

    url = 'http://127.0.0.1:3000/auto-gtm/company/keethub.lovable.app/explore?src=cabinet&phase=research_competitors'
    print("Navigating to:", url)
    page.goto(url, wait_until='domcontentloaded')
    page.wait_for_timeout(2000)
    browser.close()
