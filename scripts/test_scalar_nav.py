from playwright.sync_api import sync_playwright

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    page.goto('https://api.explee.com/public/api/docs', wait_until='networkidle')
    page.wait_for_timeout(2000)
    
    # Check how hash change works
    target_hash = '#tag/autogtm/GET/public/api/v1/autogtm/projects'
    print(f'Navigating to hash: {target_hash}')
    
    # Method A: setting location.hash
    page.evaluate(f'window.location.hash = "{target_hash}"')
    page.wait_for_timeout(2000)
    page.screenshot(path='verification_screenshots/test_nav_hash.png')
    
    # Check heading and visible content
    heading = page.evaluate('''() => {
        const h = document.querySelector('h1, h2');
        const activeItem = document.querySelector('.sidebar-item--active, [aria-current="true"], .active');
        return {
            title: document.title,
            url: window.location.href,
            heading: h ? h.innerText : null,
            activeSidebar: activeItem ? activeItem.innerText : null,
            scrollY: window.scrollY
        };
    }''')
    print('Nav result:', heading)
    
    # Try clicking the sidebar link directly
    target_hash_2 = '#tag/autogtm/PATCH/public/api/v1/autogtm/campaigns/{campaign_id}'
    print(f'Navigating by clicking sidebar link: {target_hash_2}')
    link = page.locator(f'a[href*="{target_hash_2}"]')
    if link.count() > 0:
        link.first.click()
        page.wait_for_timeout(2000)
        page.screenshot(path='verification_screenshots/test_nav_click.png')
        heading2 = page.evaluate('''() => {
            const h = document.querySelector('h1, h2');
            return {
                url: window.location.href,
                heading: h ? h.innerText : null,
                scrollY: window.scrollY
            };
        }''')
        print('Click result:', heading2)
    else:
        print('Link not found directly by exact href')
        
    browser.close()
