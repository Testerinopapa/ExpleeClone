from playwright.sync_api import sync_playwright
import time

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    page.goto('http://127.0.0.1:3000/tools/explorer?q=day+spa', wait_until='networkidle')
    time.sleep(2)

    url = page.url
    print("Page URL:", url)
    content = page.content()
    print("Has Cluster 16 in HTML:", "Cluster 16" in content)
    svg_texts = page.locator('svg text').all_text_contents()
    print(f"Total svg text elements: {len(svg_texts)}")
    print("First 20 svg texts:", svg_texts[:20])
    browser.close()
