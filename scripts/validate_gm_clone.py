from playwright.sync_api import sync_playwright
import time
import os

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
os.makedirs('verification_screenshots/gm', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=chrome_path if os.path.exists(chrome_path) else None,
        headless=True
    )
    # Match standard desktop 1920x1080
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    page.goto('http://127.0.0.1:3000', wait_until='networkidle')
    time.sleep(2)

    def snap(path):
        page.screenshot(path=path, timeout=5000)

    # 1. Hero & Metrics (compare with Screenshot (3996).png)
    page.evaluate('window.scrollTo(0, 0)')
    time.sleep(1)
    snap('verification_screenshots/gm/01_hero_metrics.png')
    print('Saved 01_hero_metrics.png')

    # 2. Logos & Regions (compare with Screenshot (4000).png)
    page.locator('h2:text("Explore 218M+ locations across")').scroll_into_view_if_needed()
    page.evaluate('window.scrollBy(0, -120)')
    time.sleep(1)
    snap('verification_screenshots/gm/02_logos_regions.png')
    print('Saved 02_logos_regions.png')

    # 3. Countries (compare with Screenshot (4001).png)
    page.locator('h2:text("Browse the Most Comprehensive Google Maps dataset across")').scroll_into_view_if_needed()
    page.evaluate('window.scrollBy(0, -80)')
    time.sleep(1)
    snap('verification_screenshots/gm/03_countries.png')
    print('Saved 03_countries.png')

    # 4. Data Categories (compare with Screenshot (4002).png)
    page.locator('h2:text("What\'s Inside Our Database")').scroll_into_view_if_needed()
    page.evaluate('window.scrollBy(0, -80)')
    time.sleep(1)
    snap('verification_screenshots/gm/04_data_categories.png')
    print('Saved 04_data_categories.png')

    # 5. Custom Attributes (compare with Screenshot (4003).png)
    page.locator('h2:text("Need custom place attributes?")').scroll_into_view_if_needed()
    page.evaluate('window.scrollBy(0, -120)')
    time.sleep(1)
    snap('verification_screenshots/gm/05_custom_attributes.png')
    print('Saved 05_custom_attributes.png')

    # 6. Business Insights (compare with Screenshot (4004).png)
    page.locator('h2:text("From locations database to")').scroll_into_view_if_needed()
    page.evaluate('window.scrollBy(0, -80)')
    time.sleep(1)
    snap('verification_screenshots/gm/06_business_insights.png')
    print('Saved 06_business_insights.png')

    # 7. Calendly (compare with Screenshot (4005).png)
    page.locator('h2:text("Explore the largest")').scroll_into_view_if_needed()
    page.evaluate('window.scrollBy(0, -80)')
    time.sleep(1)
    snap('verification_screenshots/gm/07_calendly.png')
    print('Saved 07_calendly.png')

    browser.close()
    print('All GM validation screenshots captured successfully')
