from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe')
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    page.goto('http://127.0.0.1:3000')
    
    sec = page.query_selector_all('section')[1]
    children = sec.query_selector_all('*')
    for c in children:
        b = c.bounding_box()
        if b and b['height'] > 300:
            tag = c.evaluate('el => el.tagName')
            cls = c.evaluate('el => el.className')
            print(f'Tall element: <{tag} class="{cls}"> height={b["height"]}')
    browser.close()
