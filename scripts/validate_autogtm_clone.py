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
    # Viewport matching Windows 1920x1080
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)

    print("--- 1. Testing /app-auto-gtm ---")
    page.goto('http://127.0.0.1:3000/app-auto-gtm', wait_until='domcontentloaded')
    time.sleep(1.5)
    page.screenshot(path='verification_screenshots/app_auto_gtm_clone.png')
    print("Saved verification_screenshots/app_auto_gtm_clone.png")

    print("--- 2. Testing phase=research_company_loading ---")
    page.goto('http://127.0.0.1:3000/auto-gtm/company/keethub.lovable.app/explore?src=cabinet&phase=research_company_loading', wait_until='domcontentloaded')
    time.sleep(1.5)
    page.screenshot(path='verification_screenshots/phase_research_company_loading_clone.png')
    print("Saved verification_screenshots/phase_research_company_loading_clone.png")

    print("--- 3. Testing phase=research_company ---")
    page.goto('http://127.0.0.1:3000/auto-gtm/company/keethub.lovable.app/explore?src=cabinet&phase=research_company', wait_until='domcontentloaded')
    time.sleep(1.5)
    page.screenshot(path='verification_screenshots/phase_research_company_clone.png')
    print("Saved verification_screenshots/phase_research_company_clone.png")

    print("--- 4. Testing phase=research_competitors ---")
    page.goto('http://127.0.0.1:3000/auto-gtm/company/keethub.lovable.app/explore?src=cabinet&phase=research_competitors', wait_until='domcontentloaded')
    time.sleep(1.5)
    page.screenshot(path='verification_screenshots/phase_research_competitors_clone.png')
    print("Saved verification_screenshots/phase_research_competitors_clone.png")

    print("--- 5. Testing phase=research_segments ---")
    page.goto('http://127.0.0.1:3000/auto-gtm/company/keethub.lovable.app/explore?src=cabinet&phase=research_segments', wait_until='domcontentloaded')
    time.sleep(1.5)
    page.screenshot(path='verification_screenshots/phase_research_segments_clone.png')
    print("Saved verification_screenshots/phase_research_segments_clone.png")

    print("--- 6. Testing phase=outreach_companies ---")
    page.goto('http://127.0.0.1:3000/auto-gtm/company/keethub.lovable.app/explore?src=cabinet&phase=outreach_companies', wait_until='domcontentloaded')
    time.sleep(1.5)
    page.screenshot(path='verification_screenshots/phase_outreach_companies_clone.png')
    print("Saved verification_screenshots/phase_outreach_companies_clone.png")

    print("--- 7. Testing phase=outreach_people ---")
    page.goto('http://127.0.0.1:3000/auto-gtm/company/keethub.lovable.app/explore?src=cabinet&phase=outreach_people', wait_until='domcontentloaded')
    time.sleep(1.5)
    page.screenshot(path='verification_screenshots/phase_outreach_people_clone.png')
    print("Saved verification_screenshots/phase_outreach_people_clone.png")

    print("--- 8. Testing phase=outreach_emails_loading ---")
    page.goto('http://127.0.0.1:3000/auto-gtm/company/keethub.lovable.app/explore?src=cabinet&phase=outreach_emails_loading', wait_until='domcontentloaded')
    time.sleep(2)
    page.screenshot(path='verification_screenshots/phase_outreach_emails_loading_clone.png')
    print("Saved verification_screenshots/phase_outreach_emails_loading_clone.png")

    print("--- 9. Testing phase=final ---")
    page.goto('http://127.0.0.1:3000/auto-gtm/company/keethub.lovable.app/explore?src=cabinet&phase=final', wait_until='domcontentloaded')
    time.sleep(1.5)
    page.screenshot(path='verification_screenshots/phase_final_clone.png')
    print("Saved verification_screenshots/phase_final_clone.png")

    browser.close()
    print("All validation screenshots captured successfully!")
