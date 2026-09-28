from playwright.sync_api import sync_playwright

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    page.goto('http://127.0.0.1:3000', wait_until='networkidle')
    
    page.evaluate('''() => {
        document.querySelectorAll('.landing').forEach(el => el.style.overflowX = 'visible');
        document.body.style.overflowX = 'visible';
        document.documentElement.style.overflowX = 'clip';
    }''')
    
    # Scroll to where all cards stack
    page.evaluate('window.scrollTo(0, 4400)')
    page.wait_for_timeout(400)
    
    bbs = page.evaluate('''() => {
        return Array.from(document.querySelectorAll('.use-case-sticky-wrap')).map((el, i) => {
            const r = el.getBoundingClientRect();
            return { i, top: r.top, bottom: r.bottom };
        });
    }''')
    print('Cards at scroll 4400:', bbs)
    page.screenshot(path='verification_screenshots/test_pipeline_all_stacked.png')
    browser.close()
