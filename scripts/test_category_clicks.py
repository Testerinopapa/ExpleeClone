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
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    page.goto('http://127.0.0.1:3000', wait_until='commit')
    time.sleep(3)

    # 1. Scroll to the Data Categories section
    heading = page.locator('h2:text("What\'s Inside Our Database")')
    heading.scroll_into_view_if_needed()
    page.evaluate('window.scrollBy(0, -90)')
    time.sleep(1)

    y_initial = page.evaluate('window.scrollY')
    print('Initial scrollY at General data:', y_initial)

    # 2. Click "Full Web Data"
    web_btn = page.locator('nav button:has-text("Full Web Data")')
    print('Clicking Full Web Data...')
    web_btn.click()
    time.sleep(2)

    y_web = page.evaluate('window.scrollY')
    print('scrollY after clicking Full Web Data:', y_web)
    assert y_web > y_initial + 1000, f"Expected scrollY to advance significantly, but got {y_web}"

    page.screenshot(path='verification_screenshots/b2b/click_01_web_data.png', animations='disabled')
    print('Saved click_01_web_data.png')

    # 3. Click "Contact data"
    contact_btn = page.locator('nav button:has-text("Contact data")')
    print('Clicking Contact data...')
    contact_btn.click()
    time.sleep(2)

    y_contact = page.evaluate('window.scrollY')
    print('scrollY after clicking Contact data:', y_contact)
    assert y_contact < y_web, f"Expected contact scrollY to be less than web data, but got {y_contact}"
    assert y_contact > y_initial, f"Expected contact scrollY to be greater than initial, but got {y_contact}"

    page.screenshot(path='verification_screenshots/b2b/click_02_contact_data.png', animations='disabled')
    print('Saved click_02_contact_data.png')

    # 4. Click "General data"
    gen_btn = page.locator('nav button:has-text("General data")')
    print('Clicking General data...')
    gen_btn.click()
    time.sleep(2)

    y_back = page.evaluate('window.scrollY')
    print('scrollY after clicking General data:', y_back)
    assert abs(y_back - y_initial) < 300, f"Expected to return near initial, got {y_back}"

    page.screenshot(path='verification_screenshots/b2b/click_03_back_to_general.png', animations='disabled')
    print('Saved click_03_back_to_general.png')

    browser.close()
    print('All category click assertions PASSED!')
