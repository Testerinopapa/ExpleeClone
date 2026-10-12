import os
import time
from playwright.sync_api import sync_playwright
from PIL import Image

os.makedirs('verification_screenshots', exist_ok=True)
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=chrome_path if os.path.exists(chrome_path) else None,
        headless=True
    )
    # Match standard desktop 1920x1080
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    
    # 1. Base sign-in page
    print("Navigating to http://127.0.0.1:3000/sign-in?app_id=yb37qgq72o4s2o8kao78v...")
    page.goto('http://127.0.0.1:3000/sign-in?app_id=yb37qgq72o4s2o8kao78v', wait_until='networkidle')
    time.sleep(2)
    page.screenshot(path='verification_screenshots/local_signin_default.png')
    print("Saved verification_screenshots/local_signin_default.png")

    # 2. Input focus & typing state
    email_input = page.locator('#email-input')
    if email_input.count() > 0:
        email_input.focus()
        time.sleep(0.3)
        page.screenshot(path='verification_screenshots/local_signin_focused.png')
        print("Saved verification_screenshots/local_signin_focused.png")
        email_input.fill('alex@acme.corp')
        time.sleep(0.3)
        page.screenshot(path='verification_screenshots/local_signin_filled.png')
        print("Saved verification_screenshots/local_signin_filled.png")
        email_input.fill('')

    # 3. LinkedIn button hover
    linkedin_btn = page.locator('button:has-text("Continue with LinkedIn")')
    if linkedin_btn.count() > 0:
        linkedin_btn.hover()
        time.sleep(0.3)
        page.screenshot(path='verification_screenshots/local_signin_hover_linkedin.png')
        print("Saved verification_screenshots/local_signin_hover_linkedin.png")

    # 4. Footer hover
    footer_link = page.locator('a[aria-label="Powered by Logto"]')
    if footer_link.count() > 0:
        footer_link.hover()
        time.sleep(0.3)
        page.screenshot(path='verification_screenshots/local_signin_hover_footer.png')
        print("Saved verification_screenshots/local_signin_hover_footer.png")

    browser.close()

# 5. Side-by-side comparison
ref = Image.open('loginpage/Screenshot (4028).png')
loc = Image.open('verification_screenshots/local_signin_default.png')

# The reference screenshot has the browser chrome/url bar at the top (top ~80px).
# Let's crop the actual web viewport from both!
print(f"Ref size: {ref.size}, Local size: {loc.size}")

# In ref, content starts below URL bar around y=80 to y=1040.
# Let's crop the card from both:
# Card center in 1920x1080 is around (960, 540)
ref_card = ref.crop((650, 200, 1270, 950))
loc_card = loc.crop((650, 175, 1270, 925))

# Create side by side comparison
comp_w = ref_card.width + loc_card.width + 20
comp_h = max(ref_card.height, loc_card.height)
comp = Image.new('RGB', (comp_w, comp_h), (20, 20, 20))
comp.paste(ref_card, (0, 0))
comp.paste(loc_card, (ref_card.width + 20, 0))
comp.save('verification_screenshots/side_by_side_comparison.png')
print("Saved verification_screenshots/side_by_side_comparison.png")
