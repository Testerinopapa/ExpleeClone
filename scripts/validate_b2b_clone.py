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
    # Match standard desktop 1920x1080 at 1.25 DPR or 1520x850
    page = browser.new_page(viewport={'width': 1520, 'height': 850}, device_scale_factor=1.25)
    page.goto('http://127.0.0.1:3000', wait_until='domcontentloaded')
    time.sleep(2)

    def snap(path):
        page.screenshot(path=path, animations="disabled", timeout=10000)

    # 1. Hero
    snap('verification_screenshots/b2b/01_hero.png')
    print('Saved hero screenshot')

    # 2. First all-in-one / Data sources
    page.evaluate('window.scrollTo(0, 950)')
    time.sleep(0.8)
    snap('verification_screenshots/b2b/02_all_in_one.png')
    print('Saved all-in-one screenshot')

    # 2b. Ultimate Business Profile (sticky scroll)
    page.evaluate('window.scrollTo(0, 1600)')
    time.sleep(0.8)
    snap('verification_screenshots/b2b/02b_ultimate_profile.png')
    print('Saved ultimate profile screenshot')

    # 3. Regions
    page.locator('h2:text("Explore 105M+ companies across")').scroll_into_view_if_needed()
    time.sleep(0.8)
    snap('verification_screenshots/b2b/03_regions.png')
    print('Saved regions screenshot')

    # 4. Industries
    page.locator('h2:text("Explore companies across")').scroll_into_view_if_needed()
    time.sleep(0.8)
    snap('verification_screenshots/b2b/04_industries.png')
    print('Saved industries screenshot')

    # 5. Countries
    page.locator('h2:text("Browse the largest B2B company database across")').scroll_into_view_if_needed()
    time.sleep(0.8)
    snap('verification_screenshots/b2b/05_countries.png')
    print('Saved countries screenshot')

    # 6. Data Categories / Code explorer
    page.locator('h2:text("What\'s Inside Our Database")').scroll_into_view_if_needed()
    time.sleep(0.8)
    snap('verification_screenshots/b2b/06_data_categories.png')
    print('Saved data categories screenshot')

    # 7. Revenue driver
    page.locator('h2:text("From company database to")').scroll_into_view_if_needed()
    time.sleep(0.8)
    snap('verification_screenshots/b2b/07_revenue_driver.png')
    print('Saved revenue driver screenshot')

    # 8. Calendly demo booking
    page.locator('h2:text("Explore the largest")').scroll_into_view_if_needed()
    time.sleep(0.8)
    snap('verification_screenshots/b2b/08_calendly.png')
    print('Saved calendly screenshot')

    # 9. Footer & Wordmark animation
    page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
    time.sleep(1.5)
    snap('verification_screenshots/b2b/09_footer_wordmark.png')
    print('Saved footer wordmark screenshot')

    browser.close()
    print('All validation screenshots captured successfully')
