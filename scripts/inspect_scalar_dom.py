from playwright.sync_api import sync_playwright
import json

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    page.goto('https://api.explee.com/public/api/docs#tag/autogtm/PATCH/public/api/v1/autogtm/campaigns/{campaign_id}', wait_until='networkidle')
    page.wait_for_timeout(2000)
    
    info = page.evaluate('''() => {
        const targetId = 'tag/autogtm/PATCH/public/api/v1/autogtm/campaigns/{campaign_id}';
        const elById = document.getElementById(targetId);
        
        // Find main content container
        const main = document.querySelector('main') || document.querySelector('.scalar-api-reference') || document.body;
        
        // Find all elements with ids
        const idElements = Array.from(document.querySelectorAll('[id]')).map(el => ({
            id: el.id,
            tag: el.tagName,
            cls: el.className ? String(el.className).slice(0, 50) : ''
        })).filter(x => x.id.includes('tag/') || x.id.includes('description/'));
        
        return {
            hasElById: !!elById,
            elByIdTag: elById ? elById.tagName : null,
            elByIdClass: elById ? elById.className : null,
            idElementsCount: idElements.length,
            sampleIdElements: idElements.slice(0, 10),
            mainTag: main.tagName,
            mainClass: main.className
        };
    }''')
    print(json.dumps(info, indent=2))
    browser.close()
