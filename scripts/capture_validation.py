from playwright.sync_api import sync_playwright
import time
import os

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
os.makedirs('verification_screenshots', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    page.goto('http://127.0.0.1:3000', wait_until='domcontentloaded')
    time.sleep(1.5)

    # 1. Hero
    page.screenshot(path='verification_screenshots/desktop_01_hero.png')
    print('Saved hero')

    # 2. Case studies
    page.locator('h2:text("What our customers got out of it")').scroll_into_view_if_needed()
    time.sleep(1)
    page.screenshot(path='verification_screenshots/desktop_02_cases.png')
    print('Saved cases')

    # 3. Testimonials
    page.locator('h2:text("What customers are saying")').scroll_into_view_if_needed()
    time.sleep(1)
    page.screenshot(path='verification_screenshots/desktop_03_testimonials.png')
    print('Saved testimonials')

    # 4. Pipeline Initial View
    page.locator('h2:text("We run the entire pipeline")').scroll_into_view_if_needed()
    time.sleep(1)
    page.screenshot(path='verification_screenshots/desktop_04_pipeline.png')
    print('Saved pipeline')

    # 4b. Pipeline Stacked
    page.evaluate('window.scrollTo(0, 4400)')
    time.sleep(1)
    page.screenshot(path='verification_screenshots/desktop_04_pipeline_stacked.png')
    print('Saved pipeline stacked')

    # 5. Three things
    page.locator('h2:text("Three things nobody else has")').scroll_into_view_if_needed()
    time.sleep(1)
    page.screenshot(path='verification_screenshots/desktop_05_three_things.png')
    print('Saved three things')

    # 6. Calculator
    page.locator('h2:text("Pay as you go with no subscription")').scroll_into_view_if_needed()
    time.sleep(1)
    page.screenshot(path='verification_screenshots/desktop_06_calculator.png')
    print('Saved calculator')

    # 7. FAQ
    page.locator('h2:text("Common questions")').scroll_into_view_if_needed()
    time.sleep(1)
    page.screenshot(path='verification_screenshots/desktop_07_faq.png')
    print('Saved faq')

    # 8. Bottom CTA
    page.locator('#cta-section').scroll_into_view_if_needed()
    time.sleep(1)
    page.screenshot(path='verification_screenshots/desktop_08_cta.png')
    print('Saved cta')

    # 9. Footer
    page.locator('footer').scroll_into_view_if_needed()
    time.sleep(1)
    page.screenshot(path='verification_screenshots/desktop_09_footer.png')
    print('Saved footer')

    # Full page desktop
    page.screenshot(path='verification_screenshots/desktop_full_page.png', full_page=True)
    print('Saved desktop full page')

    # Mobile screenshots
    mobile_page = browser.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
    mobile_page.goto('http://127.0.0.1:3000', wait_until='domcontentloaded')
    time.sleep(1.5)
    mobile_page.screenshot(path='verification_screenshots/mobile_01_hero.png')
    mobile_page.evaluate('window.scrollTo(0, 1100)')
    time.sleep(0.5)
    mobile_page.screenshot(path='verification_screenshots/mobile_02_cases.png')
    mobile_page.evaluate('window.scrollTo(0, 5800)')
    time.sleep(0.5)
    mobile_page.screenshot(path='verification_screenshots/mobile_03_calculator.png')
    mobile_page.screenshot(path='verification_screenshots/mobile_full_page.png', full_page=True)
    print('Saved mobile screenshots')

    browser.close()
    print('All validation screenshots captured successfully')
