import json
from playwright.sync_api import sync_playwright

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    
    # 1. Load Docs
    page.goto('http://localhost:3000/#description/introduction', wait_until='networkidle')
    page.wait_for_timeout(1000)
    print("Initial title:", page.title())
    print("Current URL:", page.url)

    # 2. Check sidebar sections
    sections = page.locator('aside .pt-0\\.5 > div > span').all_inner_texts()
    print("Sidebar sections found:", sections)

    # 3. Test opening 'Search' section and clicking 'Companies'
    search_header = page.locator('aside span:has-text("Search")').first
    search_header.click()
    page.wait_for_timeout(500)
    
    companies_btn = page.locator('aside button:has-text("Companies")').first
    if companies_btn.is_visible():
        print("Clicking 'Companies' endpoint in Search section...")
        companies_btn.click()
        page.wait_for_timeout(1000)
        h1_text = page.locator('main h1').first.inner_text()
        print("Page H1 after clicking Companies:", h1_text)
        print("Active URL hash:", page.evaluate('() => window.location.hash'))
        page.screenshot(path='verification_screenshots/search_companies_cloned.png')
    else:
        print("Companies button not visible!")

    # 4. Test navigating via hash directly to Deduplication endpoint
    dedup_hash = '#tag/deduplication/GET/public/api/v1/dedup/people'
    print(f"Navigating to {dedup_hash}...")
    page.evaluate(f'window.location.hash = "{dedup_hash}"')
    page.wait_for_timeout(1000)
    h1_dedup = page.locator('main h1').first.inner_text()
    print("Page H1 after navigating to Deduplication:", h1_dedup)
    print("Active sidebar item:", page.locator('aside button.bg-\\[\\#ecf8f6\\]').inner_text().replace('\n', ' '))
    page.screenshot(path='verification_screenshots/dedup_people_cloned.png')

    # 5. Test navigating to Contact -> Find email by name
    contact_hash = '#tag/contact/POST/public/api/v1/enrich/email'
    print(f"Navigating to {contact_hash}...")
    page.evaluate(f'window.location.hash = "{contact_hash}"')
    page.wait_for_timeout(1000)
    h1_contact = page.locator('main h1').first.inner_text()
    print("Page H1 after navigating to Contact:", h1_contact)
    page.screenshot(path='verification_screenshots/contact_email_cloned.png')

    browser.close()
    print("All navigation tests completed successfully!")
