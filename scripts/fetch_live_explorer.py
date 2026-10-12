from playwright.sync_api import sync_playwright
import time
import os

os.makedirs('explorerpage/live_dump', exist_ok=True)
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome_path, headless=True)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        # Listen to responses to see what APIs are called!
        api_responses = {}
        def handle_response(response):
            url = response.url
            if 'api' in url or 'cluster' in url or 'search' in url or 'explorer' in url or 'json' in url:
                try:
                    if 'application/json' in response.headers.get('content-type', ''):
                        api_responses[url] = response.json()
                except:
                    pass

        page.on('response', handle_response)

        print("Navigating to https://explee.com/tools/explorer...")
        page.goto('https://explee.com/tools/explorer', wait_until='commit', timeout=30000)
        time.sleep(5)

        with open('explorerpage/live_dump/explorer_landing.html', 'w', encoding='utf-8') as f:
            f.write(page.content())
        page.screenshot(path='explorerpage/live_dump/explorer_landing.png', full_page=True)
        print("Captured landing page HTML and screenshot.")

        # Now let's try searching 'AI meeting note writer'
        print("Navigating to https://explee.com/tools/explorer?q=AI+meeting+note+writer...")
        page.goto('https://explee.com/tools/explorer?q=AI+meeting+note+writer', wait_until='commit', timeout=30000)
        time.sleep(6)

        with open('explorerpage/live_dump/explorer_ai_meeting.html', 'w', encoding='utf-8') as f:
            f.write(page.content())
        page.screenshot(path='explorerpage/live_dump/explorer_ai_meeting.png', full_page=True)
        print("Captured AI meeting note writer page HTML and screenshot.")

        # Save any captured API JSON
        import json
        with open('explorerpage/live_dump/api_responses.json', 'w', encoding='utf-8') as f:
            json.dump({k: v for k, v in api_responses.items() if not k.endswith('.js')}, f, indent=2)
        print(f"Captured {len(api_responses)} API responses.")

        browser.close()
        print("Done successfully.")
except Exception as e:
    print("Error during live dump:", e)
