import os
import time
from playwright.sync_api import sync_playwright

os.makedirs('verification_screenshots', exist_ok=True)
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=chrome_path if os.path.exists(chrome_path) else None,
        headless=True
    )
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})

    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))
    page.on("console", lambda msg: errors.append(f"CONSOLE {msg.type}: {msg.text}") if msg.type == 'error' else None)

    print("--- 1. Testing direct refresh on phase=outreach_emails_loading ---")
    page.goto('http://127.0.0.1:3000/auto-gtm/company/keethub.lovable.app/explore?src=cabinet&phase=outreach_emails_loading', wait_until='domcontentloaded')
    time.sleep(2)
    page.screenshot(path='verification_screenshots/step6_loading_verified.png')
    print("Screenshot saved to verification_screenshots/step6_loading_verified.png")

    print("--- 2. Testing direct refresh on phase=outreach_emails ---")
    page.goto('http://127.0.0.1:3000/auto-gtm/company/keethub.lovable.app/explore?src=cabinet&phase=outreach_emails', wait_until='domcontentloaded')
    time.sleep(2)
    page.screenshot(path='verification_screenshots/step6_emails_verified.png')
    print("Screenshot saved to verification_screenshots/step6_emails_verified.png")

    print("--- 3. Testing direct refresh on phase=final ---")
    page.goto('http://127.0.0.1:3000/auto-gtm/company/keethub.lovable.app/explore?src=cabinet&phase=final', wait_until='domcontentloaded')
    time.sleep(2)
    page.screenshot(path='verification_screenshots/step6_final_verified.png')
    print("Screenshot saved to verification_screenshots/step6_final_verified.png")

    browser.close()

    print("\nErrors detected:", len(errors))
    for err in errors:
        print("  ERROR:", err)

    if len(errors) == 0:
        print("\nSUCCESS: All Step 6 routes rendered with 0 errors!")
    else:
        print("\nFAILURE: Errors occurred during execution.")
