from playwright.sync_api import sync_playwright

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    
    # 1. Desktop tests
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    page.goto('http://127.0.0.1:3000', wait_until='domcontentloaded')
    
    # Test 1: Typing in hero input reveals arrow button
    btn_opacity_before = page.evaluate('() => window.getComputedStyle(document.querySelector("#hero-website-input").nextElementSibling).opacity')
    print('Launch button opacity before typing:', btn_opacity_before)
    assert btn_opacity_before == '0'
    
    page.fill('#hero-website-input', 'mycoolcompany.com')
    page.wait_for_timeout(300)
    btn_opacity_after = page.evaluate('() => window.getComputedStyle(document.querySelector("#hero-website-input").nextElementSibling).opacity')
    print('Launch button opacity after typing:', btn_opacity_after)
    assert btn_opacity_after == '1'
    
    # Test 2: "I don't have a website" opens modal
    page.click('text="I don\'t have a website"')
    page.wait_for_timeout(300)
    modal_title = page.locator('h3:text("No website yet?")')
    assert modal_title.is_visible()
    print('Modal dialog opened successfully')
    
    # Close modal
    page.click('text="Close"')
    page.wait_for_timeout(300)
    assert not modal_title.is_visible()
    print('Modal dialog closed successfully')
    
    # Test 3: Calculator slider interactions
    page.locator('#pricing').scroll_into_view_if_needed()
    page.wait_for_timeout(300)
    # Change budget slider to 60
    page.evaluate('''() => {
        const slider = document.querySelector('input[type="range"]');
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(slider, 60);
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
    }''')
    page.wait_for_timeout(300)
    emails_text = page.locator('text="2,000"').first
    assert emails_text.is_visible()
    print('Calculator at $60 shows 2,000 emails')
    
    # Test 4: FAQ accordion expansion
    faq_q = page.locator('text="What do I need to get started?"')
    faq_q.scroll_into_view_if_needed()
    faq_q.click()
    page.wait_for_timeout(400)
    faq_answer = page.locator('p:has-text("Just your website.")')
    assert faq_answer.is_visible()
    print('FAQ accordion expanded answer successfully')
    
    # 2. Mobile tests
    mobile_page = browser.new_page(viewport={'width': 390, 'height': 844})
    mobile_page.goto('http://127.0.0.1:3000', wait_until='domcontentloaded')
    
    # Test 5: Hamburger menu
    menu_btn = mobile_page.locator('button[aria-label="Menu"]')
    assert menu_btn.is_visible()
    menu_btn.click()
    mobile_page.wait_for_timeout(400)
    pricing_link = mobile_page.locator('header').locator('a:text("Pricing"):visible')
    assert pricing_link.is_visible()
    print('Mobile menu drawer opened successfully')
    
    menu_btn.click()
    mobile_page.wait_for_timeout(400)
    assert not pricing_link.is_visible()
    print('Mobile menu drawer closed successfully')
    
    browser.close()
    print('ALL INTERACTION TESTS PASSED CLEANLY!')
